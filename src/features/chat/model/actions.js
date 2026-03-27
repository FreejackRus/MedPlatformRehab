import { apiClient } from "../../../shared/api/client.js";
import { normalizePatientMessageResponse } from "./normalizers.js";

export function createChatActions({ getState, setState }) {
  return {
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
      const state = getState();
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
      const state = getState();
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
  };
}
