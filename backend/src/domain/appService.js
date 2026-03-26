function now() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function message(author, text) {
  return {
    id: `${author}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    author,
    text,
    timestamp: now(),
  };
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/ё/g, "е");
}

function painScoreFromText(text) {
  const match = normalizeText(text).match(/(?:^|\D)(10|[0-9])(?:\D|$)/);
  return match ? Number(match[1]) : null;
}

function painLocationFromText(text) {
  const normalized = normalizeText(text);
  if (normalized.includes("сперед")) return "спереди";
  if (normalized.includes("сбок")) return "сбоку";
  if (normalized.includes("сзад")) return "сзади";
  return null;
}

function painTimingFromText(text) {
  const normalized = normalizeText(text);
  if (normalized.includes("сразу")) return "сразу после упражнения";
  if (normalized.includes("через")) return "через некоторое время";
  return null;
}

function isPainAfterExercise(text) {
  const normalized = normalizeText(text);
  return (
    (normalized.includes("бол") || normalized.includes("болит")) &&
    (normalized.includes("колен") || normalized.includes("сустав") || normalized.includes("упражнен"))
  );
}

function swellingToScore(swelling) {
  if (swelling === "Выраженный") return 5;
  if (swelling === "Умеренный") return 3;
  return 1;
}

function rollMetric(values, next) {
  return [...values.slice(1), next];
}

function buildEmergencySignals(journal, progress) {
  const signals = [];
  const temperature = Number.parseFloat(String(journal.temperature).replace(",", "."));
  const pain = Number(journal.pain);
  const steps = Number(journal.steps || 0);
  const recentSteps = [...progress.steps.slice(-2), steps].slice(-2);

  if (temperature > 38) {
    signals.push("Температура выше 38 °C");
  }
  if (pain >= 7) {
    signals.push("Сильная боль по ВАШ");
  }
  if (journal.swelling === "Выраженный") {
    signals.push("Выраженный отёк");
  }
  if (recentSteps.length === 2 && recentSteps.every((value) => Number(value) < 300)) {
    signals.push("Низкая активность более 2 дней");
  }

  return signals;
}

function pushIncident(state, patientId, severity, title, status) {
  const patient = state.patients.find((item) => item.id === patientId);
  state.incidents.unshift({
    id: `inc-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    severity,
    title,
    patient: patient?.fullName ?? "Пациент",
    time: now(),
    status,
  });
}

function appendJournalNote(journal, text) {
  const current = String(journal.mood || "").trim();
  return current ? `${current}. ${text}` : text;
}

export class AppService {
  constructor(storage, realtime) {
    this.storage = storage;
    this.realtime = realtime;
  }

  async patientLogin(payload) {
    const state = await this.storage.readState();
    const patient = {
      ...state.patients[0],
      fullName: payload.fullName || state.patients[0].fullName,
      contact: payload.contact || state.patients[0].contact,
      surgeryDate: payload.surgeryDate || state.patients[0].surgeryDate,
      prosthesisType: payload.prosthesisType || state.patients[0].prosthesisType,
      clinic: payload.clinic || state.patients[0].clinic,
      rehabProgram: payload.rehabProgram || state.patients[0].rehabProgram,
    };
    state.patients[0] = patient;
    await this.storage.writeState(state);
    return { token: `patient-${patient.id}`, patient };
  }

  async doctorLogin(payload) {
    const state = await this.storage.readState();
    const expectedEmail = state.doctor.email || "doctor@hospital.ru";
    const expectedPassword = state.doctor.password || "doctor123";

    if (payload.email !== expectedEmail || payload.password !== expectedPassword) {
      const error = new Error("Неверный email или пароль врача");
      error.statusCode = 401;
      throw error;
    }

    const doctor = {
      ...state.doctor,
      email: payload.email || expectedEmail,
      password: expectedPassword,
      organization: payload.organization || state.doctor.organization,
    };
    state.doctor = doctor;
    await this.storage.writeState(state);
    return { token: `doctor-${doctor.id}`, doctor };
  }

  async getPatientWorkspace(patientId) {
    const state = await this.storage.readState();
    const patient = state.patients.find((item) => item.id === patientId) ?? state.patients[0];
    return {
      patient,
      workspace: state.patientWorkspace,
      threads: state.threads.filter((thread) => thread.patientId === patient.id),
      incidents: state.incidents.filter((incident) => incident.patient === patient.fullName),
    };
  }

  async getDoctorWorkspace() {
    const state = await this.storage.readState();
    return {
      doctor: state.doctor,
      patients: state.patients,
      incidents: state.incidents,
      threads: state.threads,
    };
  }

  async updatePatientJournal(patientId, patch) {
    const state = await this.storage.readState();
    if (state.patients.some((item) => item.id === patientId)) {
      const nextJournal = {
        ...state.patientWorkspace.journal,
        ...patch,
      };

      state.patientWorkspace.journal = nextJournal;
      state.patientWorkspace.progress = {
        ...state.patientWorkspace.progress,
        pain: rollMetric(state.patientWorkspace.progress.pain, Number(nextJournal.pain)),
        swelling: rollMetric(state.patientWorkspace.progress.swelling, swellingToScore(nextJournal.swelling)),
        steps: rollMetric(state.patientWorkspace.progress.steps, Number(nextJournal.steps || 0)),
      };

      const emergencySignals = buildEmergencySignals(nextJournal, state.patientWorkspace.progress);
      emergencySignals.forEach((signal) => {
        pushIncident(state, patientId, signal.includes("Температура") ? "Критический" : "Высокий", signal, "Автоматически выявлено в дневнике");
      });
    }
    await this.storage.writeState(state);
    return {
      journal: state.patientWorkspace.journal,
      progress: state.patientWorkspace.progress,
      incidents: state.incidents,
    };
  }

  async togglePatientTask(patientId, taskId) {
    const state = await this.storage.readState();
    if (state.patients.some((item) => item.id === patientId)) {
      state.patientWorkspace.tasks = state.patientWorkspace.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      );
    }
    await this.storage.writeState(state);
    return state.patientWorkspace.tasks;
  }

  async togglePatientReminder(patientId, reminderId) {
    const state = await this.storage.readState();
    if (state.patients.some((item) => item.id === patientId)) {
      state.patientWorkspace.reminders = state.patientWorkspace.reminders.map((reminder) =>
        reminder.id === reminderId ? { ...reminder, enabled: !reminder.enabled } : reminder
      );
    }
    await this.storage.writeState(state);
    return state.patientWorkspace.reminders;
  }

  async togglePatientExercise(patientId, exerciseId) {
    const state = await this.storage.readState();
    if (state.patients.some((item) => item.id === patientId)) {
      state.patientWorkspace.exercises = state.patientWorkspace.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, completed: !exercise.completed } : exercise
      );
    }
    await this.storage.writeState(state);
    return state.patientWorkspace.exercises;
  }

  async sendPatientMessage(threadId, patientId, text) {
    const state = await this.storage.readState();
    const normalized = normalizeText(text);

    state.threads = state.threads.map((thread) => {
      if (thread.id !== threadId) return thread;

      const nextMessages = [...thread.messages, message("patient", text)];
      const botState = { ...(thread.botState ?? {}) };
      let nextStatus = "needs_review";

      if (botState.mode === "pain_assessment") {
        botState.painScore ??= painScoreFromText(text);
        botState.location ??= painLocationFromText(text);
        botState.timing ??= painTimingFromText(text);

        if (botState.painScore == null || !botState.location || !botState.timing) {
          const missing = [];
          if (botState.painScore == null) missing.push("оцените боль по шкале от 0 до 10");
          if (!botState.location) missing.push("уточните, где именно болит: спереди, сбоку или сзади");
          if (!botState.timing) missing.push("напишите, когда появилась боль: сразу после упражнения или через время");
          nextMessages.push(message("bot", `Чтобы оценить ситуацию, пожалуйста, ${missing.join("; ")}.`));
        } else if (botState.painScore < 5) {
          nextMessages.push(
            message(
              "bot",
              "Боль умеренная. Рекомендую отдохнуть, приложить холод на 10-15 минут и перейти к щадящему упражнению «Мягкая мобилизация колена» в разделе ЛФК."
            )
          );
          botState.mode = "resolved";
          nextStatus = "open";
        } else {
          nextMessages.push(
            message(
              "bot",
              "Боль выше безопасного порога. Прекратите нагрузку, я записал вас на срочную консультацию с куратором и передал информацию врачу."
            )
          );
          nextStatus = "escalated";
          state.patientWorkspace.journal = {
            ...state.patientWorkspace.journal,
            pain: Math.max(Number(state.patientWorkspace.journal.pain), botState.painScore),
            mood: appendJournalNote(
              state.patientWorkspace.journal,
              `Чат-бот зафиксировал боль после упражнения: ${botState.painScore}/10, ${botState.location}, ${botState.timing}.`
            ),
          };
          pushIncident(state, patientId, "Высокий", "Боль после упражнения требует консультации", "Передано врачу из чат-бота");
          botState.mode = "escalated";
        }
      } else if (isPainAfterExercise(text)) {
        botState.mode = "pain_assessment";
        botState.trigger = "pain_after_exercise";
        nextMessages.push(
          message(
            "bot",
            "Чтобы понять, безопасна ли нагрузка, ответьте, пожалуйста, на три вопроса: оцените боль по шкале от 0 до 10; где именно болит: спереди, сбоку или сзади; когда появилась боль: сразу после упражнения или через время."
          )
        );
      } else {
        const emergencyKeywords = ["температура", "38", "сильная боль", "отек", "отёк"];
        const shouldEscalate = emergencyKeywords.some((keyword) => normalized.includes(keyword));
        nextMessages.push(
          shouldEscalate
            ? message("bot", "Фиксирую тревожный симптом и передаю обращение врачу.")
            : message("bot", "Сообщение получено. Я добавил запись в журнал наблюдения и при необходимости уведомлю врача.")
        );

        if (shouldEscalate) {
          nextStatus = "escalated";
          pushIncident(state, patientId, "Высокий", text.slice(0, 72), "Новое сообщение в чате");
        }
      }

      return {
        ...thread,
        botState,
        status: nextStatus,
        unreadByDoctor: nextStatus !== "open",
        unreadByPatient: false,
        messages: nextMessages,
      };
    });

    await this.storage.writeState(state);
    const thread = state.threads.find((item) => item.id === threadId);
    this.realtime.broadcast("thread.updated", thread);
    return {
      thread,
      journal: state.patientWorkspace.journal,
      progress: state.patientWorkspace.progress,
      incidents: state.incidents,
    };
  }

  async sendDoctorMessage(threadId, text) {
    const state = await this.storage.readState();
    state.threads = state.threads.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            status: "doctor_replied",
            unreadByDoctor: false,
            unreadByPatient: true,
            messages: [...thread.messages, message("doctor", text)],
          }
        : thread
    );
    await this.storage.writeState(state);
    const thread = state.threads.find((item) => item.id === threadId);
    this.realtime.broadcast("thread.updated", thread);
    return thread;
  }
}
