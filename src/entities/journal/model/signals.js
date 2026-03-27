export function buildEmergencySignals(journal, progress) {
  const signals = [];
  const temperature = Number.parseFloat(String(journal.temperature).replace(",", "."));
  const pain = Number(journal.pain);
  const steps = Number(journal.steps || 0);
  const recentSteps = [...progress.steps.slice(-2), steps].slice(-2);

  if (temperature > 38) {
    signals.push({ id: "temp", severity: "critical", label: "Температура выше 38 °C" });
  }
  if (pain >= 7) {
    signals.push({ id: "pain", severity: "high", label: "Сильная боль по ВАШ" });
  }
  if (journal.swelling === "Выраженный") {
    signals.push({ id: "swelling", severity: "high", label: "Выраженный отёк" });
  }
  if (recentSteps.length === 2 && recentSteps.every((value) => Number(value) < 300)) {
    signals.push({ id: "activity", severity: "high", label: "Нет активности более 2 дней" });
  }

  return signals;
}
