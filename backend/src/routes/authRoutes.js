import { Router } from "express";
import { asyncHandler } from "../shared/asyncHandler.js";
import { validateDoctorLogin, validatePatientLogin } from "../shared/validation.js";

export function createAuthRoutes(service, authService) {
  const router = Router();

  router.post("/patient/login", asyncHandler(async (req, res) => {
    const payload = validatePatientLogin(req.body ?? {});
    const result = await service.patientLogin(payload);
    const session = authService.createSession({ role: "patient", patientId: result.patient.id });
    res.json({ ...result, token: session.token });
  }));

  router.post("/doctor/login", asyncHandler(async (req, res) => {
    const payload = validateDoctorLogin(req.body ?? {});
    const result = await service.doctorLogin(payload);
    const session = authService.createSession({ role: "doctor", doctorId: result.doctor.id });
    res.json({ ...result, token: session.token });
  }));

  router.get("/me", (req, res) => {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    const session = token ? authService.getSession(token) : null;

    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.json(session.subject);
  });

  router.post("/logout", (req, res) => {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      authService.deleteSession(token);
    }
    res.json({ ok: true });
  });

  return router;
}
