import { apiClient } from "../../../shared/api/client.js";

export function createAuthActions({ getState, setState, setLoading, resetToDefaultState }) {
  return {
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
        const state = getState();
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
        const state = getState();
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
    resetDemo() {
      resetToDefaultState();
      window.location.assign("/auth");
    },
    async logout(role) {
      const state = getState();
      try {
        const token = role === "doctor" ? state.auth.doctorToken : state.auth.patientToken;
        apiClient.setToken(token);
        await apiClient.logout();
      } catch {
        // ignore network errors on logout
      } finally {
        resetToDefaultState();
        window.location.assign("/auth");
      }
    },
  };
}
