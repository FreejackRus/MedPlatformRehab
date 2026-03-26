import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler.js";
import { validateJournalPatch } from "../shared/validation.js";

export function createWorkspaceRoutes(service) {
  const router = Router();

  router.get("/patient/:patientId", asyncHandler(async (req, res) => {
    const data = await service.getPatientWorkspace(req.params.patientId);
    res.json(data);
  }));

  router.get("/doctor", asyncHandler(async (_req, res) => {
    const data = await service.getDoctorWorkspace();
    res.json(data);
  }));

  router.patch("/patient/:patientId/journal", asyncHandler(async (req, res) => {
    const patch = validateJournalPatch(req.body ?? {});
    const data = await service.updatePatientJournal(req.params.patientId, patch);
    res.json(data);
  }));

  router.patch("/patient/:patientId/tasks/:taskId/toggle", asyncHandler(async (req, res) => {
    const data = await service.togglePatientTask(req.params.patientId, req.params.taskId);
    res.json(data);
  }));

  router.patch("/patient/:patientId/reminders/:reminderId/toggle", asyncHandler(async (req, res) => {
    const data = await service.togglePatientReminder(req.params.patientId, req.params.reminderId);
    res.json(data);
  }));

  router.patch("/patient/:patientId/exercises/:exerciseId/toggle", asyncHandler(async (req, res) => {
    const data = await service.togglePatientExercise(req.params.patientId, req.params.exerciseId);
    res.json(data);
  }));

  return router;
}
