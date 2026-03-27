import { initialThreads } from "../../../entities/chat/model/seed.js";
import { basePatients } from "../../../entities/patient/model/seed.js";
import { initialExercises } from "../../../entities/rehab/model/seed.js";

export const STORAGE_KEY = "rehabcare-platform-state";

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function createInitialJournal() {
  return {
    pain: 3,
    swelling: "Умеренный",
    temperature: "36.7",
    pulse: "78",
    steps: "3420",
    mood: "Спокойное, есть прогресс",
    sleep: "6.5 часов",
    wound: "Шов сухой, без выделений",
  };
}

export function createDefaultAppState() {
  const primaryPatient = cloneValue(basePatients[0]);
  const initialJournal = createInitialJournal();

  return {
    role: "patient",
    authReady: false,
    auth: {
      patientAuthorized: false,
      doctorAuthorized: false,
      patientToken: "",
      doctorToken: "",
    },
    patientSection: "overview",
    doctorSection: "overview",
    patient: primaryPatient,
    registrationForm: {
      contact: primaryPatient.contact,
      fullName: primaryPatient.fullName,
      surgeryDate: primaryPatient.surgeryDate,
      prosthesisType: primaryPatient.prosthesisType,
      clinic: primaryPatient.clinic,
      rehabProgram: primaryPatient.rehabProgram,
    },
    doctorAuthForm: {
      email: "doctor@hospital.ru",
      password: "doctor123",
      organization: "ГКБ №12",
    },
    reminders: [
      { id: "exercise", label: "Упражнения", description: "Напоминание о времени выполнения ЛФК", enabled: true },
      { id: "meds", label: "Лекарства", description: "Контроль схемы приёма препаратов", enabled: true },
      { id: "journal", label: "Дневник", description: "Ежедневное заполнение самоконтроля", enabled: true },
      { id: "consult", label: "Консультации", description: "Будущие приёмы и госпитализации", enabled: false },
    ],
    tasks: [
      { id: "task-1", time: "08:30", title: "Утренний комплекс ЛФК", note: "15 минут, мягкая мобилизация и дыхательные упражнения", done: true },
      { id: "task-2", time: "12:00", title: "Заполнение дневника самоконтроля", note: "Боль, отёк, температура, шаги, пульс, самочувствие", done: false },
      { id: "task-3", time: "18:00", title: "Контрольное сообщение чат-бота", note: "Проверка симптомов и фиксация дневной активности", done: false },
    ],
    exercises: cloneValue(initialExercises),
    journal: cloneValue(initialJournal),
    journalDraft: cloneValue(initialJournal),
    progress: {
      pain: [6, 5, 5, 4, 4, 3, 3],
      swelling: [4, 4, 4, 3, 3, 3, 2],
      steps: [1800, 2200, 2500, 2900, 3100, 3420, 3860],
      flexion: [45, 52, 57, 63, 70, 78, 85],
    },
    selectedMetric: "pain",
    selectedFilter: "Все",
    selectedStageFilter: "all",
    exerciseSearch: "",
    doctor: {
      patientSearch: "",
      triageFilter: "Все",
      selectedThreadId: "thread-1",
      replyDraft: "",
    },
    ui: {
      journalSaveStatus: "idle",
      journalSaveMessage: "",
    },
    patientChat: {
      selectedThreadId: "thread-1",
      draft: "",
    },
    chatThreads: cloneValue(initialThreads),
    incidents: [
      { id: "inc-1", severity: "Высокий", title: "Боль после упражнения", patient: "Иван Петров", time: "Сегодня, 09:12", status: "Ожидает ответа врача" },
      { id: "inc-2", severity: "Критический", title: "Температура 38.1 и выраженный отёк", patient: "Марина Соколова", time: "Сегодня, 08:06", status: "Срочная связь с врачом" },
    ],
  };
}
