import { apiClient } from "../../../shared/api/client.js";

export function createRehabActions({ getState, setState }) {
  return {
    async toggleTask(taskId) {
      const state = getState();
      const tasks = await apiClient.toggleTask(state.patient.id, taskId);
      setState((current) => ({ ...current, tasks }));
    },
    async toggleExercise(exerciseId) {
      const state = getState();
      const exercises = await apiClient.toggleExercise(state.patient.id, exerciseId);
      setState((current) => ({ ...current, exercises }));
    },
    async toggleReminder(reminderId) {
      const state = getState();
      const reminders = await apiClient.toggleReminder(state.patient.id, reminderId);
      setState((current) => ({ ...current, reminders }));
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
  };
}
