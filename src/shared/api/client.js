const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4010";
let authToken = "";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  setToken(token) {
    authToken = token;
  },
  me() {
    return request("/auth/me");
  },
  logout() {
    return request("/auth/logout", {
      method: "POST"
    });
  },
  patientLogin(payload) {
    return request("/auth/patient/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  doctorLogin(payload) {
    return request("/auth/doctor/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getPatientWorkspace(patientId) {
    return request(`/workspace/patient/${patientId}`);
  },
  getDoctorWorkspace() {
    return request("/workspace/doctor");
  },
  updateJournal(patientId, patch) {
    return request(`/workspace/patient/${patientId}/journal`, {
      method: "PATCH",
      body: JSON.stringify(patch)
    });
  },
  toggleTask(patientId, taskId) {
    return request(`/workspace/patient/${patientId}/tasks/${taskId}/toggle`, {
      method: "PATCH"
    });
  },
  toggleReminder(patientId, reminderId) {
    return request(`/workspace/patient/${patientId}/reminders/${reminderId}/toggle`, {
      method: "PATCH"
    });
  },
  toggleExercise(patientId, exerciseId) {
    return request(`/workspace/patient/${patientId}/exercises/${exerciseId}/toggle`, {
      method: "PATCH"
    });
  },
  sendPatientMessage(payload) {
    return request("/chat/patient-message", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  sendDoctorMessage(payload) {
    return request("/chat/doctor-message", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
