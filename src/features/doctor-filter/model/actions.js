export function createDoctorFilterActions({ setState }) {
  return {
    updateDoctorFilter(field, value) {
      setState((current) => ({
        ...current,
        doctor: {
          ...current.doctor,
          [field]: value,
        },
      }));
    },
  };
}
