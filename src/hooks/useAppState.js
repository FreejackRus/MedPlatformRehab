import { useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEY, defaultAppState, techniqueChecks } from "../data/mockData.js";
import { apiClient } from "../shared/api/client.js";
import { connectSocket } from "../shared/api/socket.js";
import {
  buildRecoveryPlan,
  getCurrentStage,
  getDaysAfterSurgery,
  getMetricConfig,
  getVisiblePatients,
} from "../utils/domain.js";

function loadState() {
  if (typeof window === "undefined") {
    return defaultAppState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultAppState;
  }

  try {
    return { ...defaultAppState, ...JSON.parse(raw) };
  } catch {
    return defaultAppState;
  }
}

function buildEmergencySignals(journal, progress) {
  const signals = [];
  const temperature = Number.parseFloat(String(journal.temperature).replace(",", "."));
  const pain = Number(journal.pain);
  const steps = Number(journal.steps || 0);
  const recentSteps = [...progress.steps.slice(-2), steps].slice(-2);

  if (temperature > 38) {
    signals.push({ id: "temp", severity: "critical", label: "Температура выше 38 °C" });
  }
  if (pain >= 7) {
    signals.push({ id: "pain", severity: "high", label: "Сильная боль по ВАШ" });
  }
  if (journal.swelling === "Выраженный") {
    signals.push({ id: "swelling", severity: "high", label: "Выраженный отёк" });
  }
  if (recentSteps.length === 2 && recentSteps.every((value) => Number(value) < 300)) {
    signals.push({ id: "activity", severity: "high", label: "Нет активности более 2 дней" });
  }

  return signals;
}

function normalizeJournalResponse(response, currentState) {
  if (response && response.journal) {
    return {
      journal: response.journal,
      journalDraft: response.journal,
      progress: response.progress ?? currentState.progress,
      incidents: response.incidents ?? currentState.incidents,
    };
  }

  return {
    journal: response ?? currentState.journalDraft,
    journalDraft: response ?? currentState.journalDraft,
    progress: currentState.progress,
    incidents: currentState.incidents,
  };
}

function normalizePatientMessageResponse(response, currentState) {
  if (response && response.thread) {
    return {
      thread: response.thread,
      journal: response.journal ?? currentState.journal,
      journalDraft: response.journal ?? currentState.journalDraft,
      progress: response.progress ?? currentState.progress,
      incidents: response.incidents ?? currentState.incidents,
    };
  }

  return {
    thread: response,
    journal: currentState.journal,
    journalDraft: currentState.journalDraft,
    progress: currentState.progress,
    incidents: currentState.incidents,
  };
}

export function useAppState() {
  const [state, setState] = useState(loadState);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const token = state.role === "doctor" ? state.auth.doctorToken : state.auth.patientToken;
    apiClient.setToken(token);
  }, [state.auth.doctorToken, state.auth.patientToken, state.role]);

  useEffect(() => {
    if (bootstrappedRef.current) {
      return;
    }
    bootstrappedRef.current = true;

    async function bootstrap() {
      const patientToken = state.auth.patientToken;
      const doctorToken = state.auth.doctorToken;
      const hadPersistedSession = Boolean(patientToken || doctorToken);

      if (doctorToken) {
        try {
          apiClient.setToken(doctorToken);
          const subject = await apiClient.me();
          if (subject.role === "doctor") {
            const data = await apiClient.getDoctorWorkspace();
            setState((current) => ({
              ...current,
              authReady: true,
              role: "doctor",
              auth: {
                ...current.auth,
                doctorAuthorized: true,
              },
              incidents: data.incidents,
              chatThreads: data.threads,
            }));
            return;
          }
        } catch {
          // invalid doctor session
        }
      }

      if (patientToken) {
        try {
          apiClient.setToken(patientToken);
          const subject = await apiClient.me();
          if (subject.role === "patient") {
            const patientId = subject.patientId ?? state.patient.id;
            const data = await apiClient.getPatientWorkspace(patientId);
            setState((current) => ({
              ...current,
              authReady: true,
              role: "patient",
              auth: {
                ...current.auth,
                patientAuthorized: true,
              },
              patient: data.patient,
              tasks: data.workspace.tasks,
              reminders: data.workspace.reminders,
              exercises: data.workspace.exercises,
              journal: data.workspace.journal,
              journalDraft: data.workspace.journal,
              progress: data.workspace.progress,
              chatThreads: data.threads,
              incidents: data.incidents ?? current.incidents,
            }));
            return;
          }
        } catch {
          // invalid patient session
        }
      }

      setState((current) => ({
        ...current,
        authReady: true,
        ...(hadPersistedSession
          ? {
              auth: {
                ...current.auth,
                patientAuthorized: false,
                doctorAuthorized: false,
                patientToken: "",
                doctorToken: "",
              },
            }
          : {}),
      }));
    }

    bootstrap().catch(() => {});
  }, []);

  useEffect(() => {
    const authorized = state.auth.patientAuthorized || state.auth.doctorAuthorized;
    if (!authorized) {
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }

    socketRef.current?.close();
    const token = state.role === "doctor" ? state.auth.doctorToken : state.auth.patientToken;
    if (!token) {
      return;
    }

    const socket = connectSocket(token, (event) => {
      if (event.type === "thread.updated") {
        setState((current) => ({
          ...current,
          chatThreads: current.chatThreads.map((thread) => (thread.id === event.payload.id ? event.payload : thread)),
        }));
      }
    });
    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [state.auth.patientAuthorized, state.auth.doctorAuthorized, state.auth.doctorToken, state.auth.patientToken, state.role]);

  const derived = useMemo(() => {
    const patient = state.patient;
    const daysAfterSurgery = getDaysAfterSurgery(patient.surgeryDate);
    const recoveryPlan = buildRecoveryPlan(patient);
    const currentStage = getCurrentStage(patient.surgeryDate, patient.rehabProgram);
    const progressPercent = Math.min(92, 18 + daysAfterSurgery * 2);
    const completedTasks = state.tasks.filter((task) => task.done).length;
    const completedExercises = state.exercises.filter((exercise) => exercise.completed).length;
    const metricConfig = getMetricConfig(state.progress);
    const stageOptions = Array.from(new Set(state.exercises.map((exercise) => exercise.stageId))).map((stageId) => {
      const exercise = state.exercises.find((item) => item.stageId === stageId);
      return { value: stageId, label: exercise?.stage ?? stageId };
    });
    const filteredExercises = state.exercises.filter((exercise) => {
      const typeMatches = state.selectedFilter === "Все" ? true : exercise.type === state.selectedFilter;
      const stageMatches = state.selectedStageFilter === "all" ? true : exercise.stageId === state.selectedStageFilter;
      const searchMatches = state.exerciseSearch.trim()
        ? `${exercise.title} ${exercise.stage} ${exercise.videoSummary}`.toLowerCase().includes(state.exerciseSearch.toLowerCase())
        : true;
      return typeMatches && stageMatches && searchMatches;
    });
    const recommendedExercises = state.exercises.filter((exercise) => exercise.stageId === currentStage.id);
    const techniqueGuides = techniqueChecks
      .map((guide) => ({
        ...guide,
        exercise: state.exercises.find((exercise) => exercise.id === guide.exerciseId) ?? null,
      }))
      .filter((guide) => guide.exercise);
    const emergencySignals = buildEmergencySignals(state.journalDraft, state.progress);
    const visiblePatients = getVisiblePatients(state.patient, state.doctor);
    const activePatientThread = state.chatThreads.find((thread) => thread.id === state.patientChat.selectedThreadId) ?? state.chatThreads[0] ?? null;
    const activeDoctorThread = state.chatThreads.find((thread) => thread.id === state.doctor.selectedThreadId) ?? state.chatThreads[0] ?? null;

    return {
      patient,
      daysAfterSurgery,
      currentStage,
      recoveryPlan,
      progressPercent,
      completedTasks,
      completedExercises,
      metricConfig,
      filteredExercises,
      recommendedExercises,
      techniqueGuides,
      emergencySignals,
      stageOptions,
      visiblePatients,
      activePatientThread,
      activeDoctorThread,
    };
  }, [state]);

  const actions = {
    updateRegistration(field, value) {
      setState((current) => ({
        ...current,
        registrationForm: {
          ...current.registrationForm,
          [field]: value,
        },
      }));
    },
    updateDoctorAuth(field, value) {
      setState((current) => ({
        ...current,
        doctorAuthForm: {
          ...current.doctorAuthForm,
          [field]: value,
        },
      }));
    },
    async loginPatient() {
      setLoading(true);
      try {
        const auth = await apiClient.patientLogin(state.registrationForm);
        apiClient.setToken(auth.token);
        const data = await apiClient.getPatientWorkspace(auth.patient.id);
        setState((current) => ({
          ...current,
          authReady: true,
          role: "patient",
          auth: {
            ...current.auth,
            patientAuthorized: true,
            patientToken: auth.token,
            doctorAuthorized: false,
          },
          patient: data.patient,
          tasks: data.workspace.tasks,
          reminders: data.workspace.reminders,
          exercises: data.workspace.exercises,
          journal: data.workspace.journal,
          journalDraft: data.workspace.journal,
          progress: data.workspace.progress,
          chatThreads: data.threads,
          incidents: data.incidents ?? current.incidents,
        }));
      } finally {
        setLoading(false);
      }
    },
    async loginDoctor() {
      setLoading(true);
      try {
        const auth = await apiClient.doctorLogin(state.doctorAuthForm);
        apiClient.setToken(auth.token);
        const data = await apiClient.getDoctorWorkspace();
        setState((current) => ({
          ...current,
          authReady: true,
          role: "doctor",
          auth: {
            ...current.auth,
            doctorAuthorized: true,
            doctorToken: auth.token,
            patientAuthorized: false,
          },
          incidents: data.incidents,
          chatThreads: data.threads,
        }));
      } finally {
        setLoading(false);
      }
    },
    switchRole(role) {
      setState((current) => ({ ...current, role }));
    },
    navigatePatientSection(section) {
      setState((current) => ({ ...current, patientSection: section }));
    },
    navigateDoctorSection(section) {
      setState((current) => ({ ...current, doctorSection: section }));
    },
    async toggleTask(taskId) {
      const tasks = await apiClient.toggleTask(state.patient.id, taskId);
      setState((current) => ({
        ...current,
        tasks,
      }));
    },
    async toggleExercise(exerciseId) {
      const exercises = await apiClient.toggleExercise(state.patient.id, exerciseId);
      setState((current) => ({
        ...current,
        exercises,
      }));
    },
    updateJournalDraft(field, value) {
      setState((current) => ({
        ...current,
        journalDraft: {
          ...current.journalDraft,
          [field]: value,
        },
      }));
    },
    async saveJournal() {
      setState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          journalSaveStatus: "saving",
          journalSaveMessage: "Сохраняем дневник...",
        },
      }));

      try {
        const response = await apiClient.updateJournal(state.patient.id, state.journalDraft);
        const data = normalizeJournalResponse(response, state);
        setState((current) => ({
          ...current,
          journal: data.journal,
          journalDraft: data.journalDraft,
          progress: data.progress,
          incidents: data.incidents,
          ui: {
            ...current.ui,
            journalSaveStatus: "success",
            journalSaveMessage: "Данные дневника сохранены.",
          },
        }));
      } catch (error) {
        setState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            journalSaveStatus: "error",
            journalSaveMessage: error?.message ? `Не удалось сохранить дневник: ${error.message}` : "Не удалось сохранить дневник.",
          },
        }));
      }
    },
    resetJournalDraft() {
      setState((current) => ({
        ...current,
        journalDraft: current.journal,
      }));
    },
    async toggleReminder(reminderId) {
      const reminders = await apiClient.toggleReminder(state.patient.id, reminderId);
      setState((current) => ({
        ...current,
        reminders,
      }));
    },
    setMetric(metric) {
      setState((current) => ({ ...current, selectedMetric: metric }));
    },
    setFilter(filter) {
      setState((current) => ({ ...current, selectedFilter: filter }));
    },
    setStageFilter(stage) {
      setState((current) => ({ ...current, selectedStageFilter: stage }));
    },
    setExerciseSearch(value) {
      setState((current) => ({ ...current, exerciseSearch: value }));
    },
    updateDoctorFilter(field, value) {
      setState((current) => ({
        ...current,
        doctor: {
          ...current.doctor,
          [field]: value,
        },
      }));
    },
    selectPatientThread(threadId) {
      setState((current) => ({
        ...current,
        patientChat: {
          ...current.patientChat,
          selectedThreadId: threadId,
        },
      }));
    },
    selectDoctorThread(threadId) {
      setState((current) => ({
        ...current,
        doctor: {
          ...current.doctor,
          selectedThreadId: threadId,
        },
      }));
    },
    updatePatientDraft(value) {
      setState((current) => ({
        ...current,
        patientChat: {
          ...current.patientChat,
          draft: value,
        },
      }));
    },
    updateDoctorDraft(value) {
      setState((current) => ({
        ...current,
        doctor: {
          ...current.doctor,
          replyDraft: value,
        },
      }));
    },
    async sendPatientMessage() {
      const draft = state.patientChat.draft.trim();
      if (!draft) return;
      const response = await apiClient.sendPatientMessage({
        threadId: state.patientChat.selectedThreadId,
        patientId: state.patient.id,
        text: draft,
      });
      const data = normalizePatientMessageResponse(response, state);
      setState((current) => ({
        ...current,
        chatThreads: current.chatThreads.map((thread) => (thread.id === data.thread.id ? data.thread : thread)),
        journal: data.journal,
        journalDraft: data.journal,
        progress: data.progress,
        incidents: data.incidents,
        patientChat: {
          ...current.patientChat,
          draft: "",
        },
      }));
    },
    async sendDoctorReply() {
      const draft = state.doctor.replyDraft.trim();
      if (!draft) return;
      const updatedThread = await apiClient.sendDoctorMessage({
        threadId: state.doctor.selectedThreadId,
        text: draft,
      });
      setState((current) => ({
        ...current,
        chatThreads: current.chatThreads.map((thread) => (thread.id === updatedThread.id ? updatedThread : thread)),
        doctor: {
          ...current.doctor,
          replyDraft: "",
        },
      }));
    },
    resetDemo() {
      window.localStorage.removeItem(STORAGE_KEY);
      setState(defaultAppState);
      window.location.assign("/auth");
    },
    async logout(role) {
      try {
        const token = role === "doctor" ? state.auth.doctorToken : state.auth.patientToken;
        apiClient.setToken(token);
        await apiClient.logout();
      } catch {
        // ignore network errors on logout
      } finally {
        window.localStorage.removeItem(STORAGE_KEY);
        setState(defaultAppState);
        window.location.assign("/auth");
      }
    },
  };

  return { state, actions, derived, loading };
}
