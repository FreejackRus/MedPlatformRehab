export function createWorkspaceNavigationActions({ setState }) {
  return {
    navigatePatientSection(section) {
      setState((current) => ({ ...current, patientSection: section }));
    },
    navigateDoctorSection(section) {
      setState((current) => ({ ...current, doctorSection: section }));
    },
  };
}
