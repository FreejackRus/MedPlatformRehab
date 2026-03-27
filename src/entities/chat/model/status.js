export function getThreadStatusLabel(status) {
  const labels = {
    needs_review: "Требует оценки",
    escalated: "Эскалация врачу",
    doctor_replied: "Есть ответ врача",
    open: "Открыт",
  };

  return labels[status] ?? "Открыт";
}
