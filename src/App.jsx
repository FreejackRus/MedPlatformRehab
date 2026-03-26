import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppHeader from "./widgets/app-header/index.jsx";
import { useAppState } from "./hooks/useAppState.js";
import AuthLandingPage from "./pages/auth/index.jsx";
import DoctorAuthPage from "./pages/auth-doctor/index.jsx";
import PatientAuthPage from "./pages/auth-patient/index.jsx";
import DoctorPage from "./pages/doctor/index.jsx";
import PatientPage from "./pages/patient/index.jsx";
import RouteGuard from "./shared/ui/RouteGuard.jsx";

function AppRoutes() {
  const { state, actions, derived, loading } = useAppState();
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  useEffect(() => {
    if (location.pathname.startsWith("/doctor") && state.role !== "doctor") {
      actions.switchRole("doctor");
    }
    if (location.pathname.startsWith("/patient") && state.role !== "patient") {
      actions.switchRole("patient");
    }
  }, [actions, location.pathname, state.role]);

  return (
    <>
      {!isAuthRoute ? <AppHeader role={state.role} onLogout={actions.logout} /> : null}
      {loading ? <div className="loading-banner">Синхронизация данных...</div> : null}

      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthLandingPage />} />
        <Route
          path="/auth/patient"
          element={<PatientAuthRoute form={state.registrationForm} onChange={actions.updateRegistration} onSubmit={actions.loginPatient} />}
        />
        <Route
          path="/auth/doctor"
          element={<DoctorAuthRoute form={state.doctorAuthForm} onChange={actions.updateDoctorAuth} onSubmit={actions.loginDoctor} />}
        />

        <Route
          path="/patient"
          element={
            <RouteGuard allow={state.authReady ? state.auth.patientAuthorized : null} redirectTo="/auth">
              <Navigate to="/patient/overview" replace />
            </RouteGuard>
          }
        />
        <Route
          path="/patient/:screen"
          element={
            <RouteGuard allow={state.authReady ? state.auth.patientAuthorized : null} redirectTo="/auth">
              <PatientPage state={state} derived={derived} actions={actions} />
            </RouteGuard>
          }
        />

        <Route
          path="/doctor"
          element={
            <RouteGuard allow={state.authReady ? state.auth.doctorAuthorized : null} redirectTo="/auth">
              <Navigate to="/doctor/overview" replace />
            </RouteGuard>
          }
        />
        <Route
          path="/doctor/:screen"
          element={
            <RouteGuard allow={state.authReady ? state.auth.doctorAuthorized : null} redirectTo="/auth">
              <DoctorPage state={state} derived={derived} actions={actions} />
            </RouteGuard>
          }
        />
      </Routes>
    </>
  );
}

function PatientAuthRoute({ form, onChange, onSubmit }) {
  const navigate = useNavigate();

  return (
    <PatientAuthPage
      form={form}
      onChange={onChange}
      onSubmit={async () => {
        await onSubmit();
        navigate("/patient/overview");
      }}
    />
  );
}

function DoctorAuthRoute({ form, onChange, onSubmit }) {
  const navigate = useNavigate();

  return (
    <DoctorAuthPage
      form={form}
      onChange={onChange}
      onSubmit={async () => {
        await onSubmit();
        navigate("/doctor/overview");
      }}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-page">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
