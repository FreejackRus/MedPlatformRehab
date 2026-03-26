export function requireString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Field "${field}" must be a non-empty string`);
  }
  return value.trim();
}

export function requireObject(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Field "${field}" must be an object`);
  }
  return value;
}

export function validatePatientLogin(payload) {
  const data = requireObject(payload, "payload");
  return {
    fullName: requireString(data.fullName, "fullName"),
    contact: requireString(data.contact, "contact"),
    surgeryDate: requireString(data.surgeryDate, "surgeryDate"),
    prosthesisType: requireString(data.prosthesisType, "prosthesisType"),
    clinic: requireString(data.clinic, "clinic"),
    rehabProgram: requireString(data.rehabProgram, "rehabProgram")
  };
}

export function validateDoctorLogin(payload) {
  const data = requireObject(payload, "payload");
  return {
    email: requireString(data.email, "email"),
    password: requireString(data.password, "password"),
    organization: requireString(data.organization, "organization")
  };
}

export function validateChatPayload(payload, role) {
  const data = requireObject(payload, "payload");
  const base = {
    threadId: requireString(data.threadId, "threadId"),
    text: requireString(data.text, "text")
  };

  if (role === "patient") {
    return {
      ...base,
      patientId: requireString(data.patientId, "patientId")
    };
  }

  return base;
}

export function validateJournalPatch(payload) {
  return requireObject(payload, "payload");
}
