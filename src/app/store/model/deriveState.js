import { techniqueChecks } from "../../../entities/rehab/model/constants.js";
import { buildEmergencySignals } from "../../../entities/journal/model/signals.js";
import {
  buildRecoveryPlan,
  getCurrentStage,
  getDaysAfterSurgery,
  getMetricConfig,
  getVisiblePatients,
} from "../../../shared/lib/domain.js";

export function deriveState(state) {
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
}
