import { apiClient } from "../../../shared/api/client.js";
import { normalizeJournalResponse } from "./normalizers.js";

export function createJournalActions({ getState, setState }) {
  return {
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
        const state = getState();
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
  };
}
