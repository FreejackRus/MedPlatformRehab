import { apiClient } from "../../../shared/api/client.js";

export async function bootstrapSession({ initialState, setState }) {
  const patientToken = initialState.auth.patientToken;
  const doctorToken = initialState.auth.doctorToken;
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
        const patientId = subject.patientId ?? initialState.patient.id;
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
