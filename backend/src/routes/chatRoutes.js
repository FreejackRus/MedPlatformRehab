import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler.js";
import { validateChatPayload } from "../shared/validation.js";

export function createChatRoutes(service) {
  const router = Router();

  router.post("/patient-message", asyncHandler(async (req, res) => {
    const { threadId, patientId, text } = validateChatPayload(req.body ?? {}, "patient");
    const data = await service.sendPatientMessage(threadId, patientId, text);
    res.json(data);
  }));

  router.post("/doctor-message", asyncHandler(async (req, res) => {
    const { threadId, text } = validateChatPayload(req.body ?? {}, "doctor");
    const thread = await service.sendDoctorMessage(threadId, text);
    res.json(thread);
  }));

  return router;
}
