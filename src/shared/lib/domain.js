import { basePatients } from "../../entities/patient/model/constants.js";
import { chartLabels, rehabProtocols, rehabStages } from "../../entities/rehab/model/constants.js";

export { chartLabels };

export function getDaysAfterSurgery(surgeryDate) {
  const today = new Date("2026-03-27T12:00:00");
  const surgery = new Date(`${surgeryDate}T00:00:00`);
  return Math.max(0, Math.floor((today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getCurrentStage(surgeryDate, rehabProgram = "standard") {
  const daysAfter = getDaysAfterSurgery(surgeryDate);
  const plan = buildRecoveryPlan({ surgeryDate, rehabProgram });
  return plan.stages.find((stage) => daysAfter >= stage.range[0] && daysAfter <= stage.range[1]) ?? plan.stages[plan.stages.length - 1];
}

export function getMetricConfig(progress) {
  return {
    pain: { title: "Динамика боли", values: progress.pain, suffix: "/10", max: 10, label: "Боль" },
    swelling: { title: "Динамика отёка", values: progress.swelling, suffix: "/5", max: 5, label: "Отёк" },
    steps: { title: "Количество шагов", values: progress.steps, suffix: "", max: 4000, label: "Шаги" },
    flexion: { title: "Сгибание сустава", values: progress.flexion, suffix: "°", max: 100, label: "Сгибание" },
  };
}

export function getVisiblePatients(patient, doctorState) {
  const doctorPatients = [patient, ...basePatients.filter((item) => item.id !== patient.id)];
  const search = doctorState.patientSearch.toLowerCase();
  return doctorPatients.filter((item) => {
    const matches =
      item.fullName.toLowerCase().includes(search) ||
      item.clinic.toLowerCase().includes(search) ||
      item.contact.toLowerCase().includes(search);

    if (!matches) {
      return false;
    }

    return doctorState.triageFilter === "Все" ? true : item.status === doctorState.triageFilter;
  });
}

export function getRehabProgramMeta(rehabProgram = "standard") {
  return rehabProtocols.find((item) => item.id === rehabProgram) ?? rehabProtocols[0];
}

export function buildRecoveryPlan(patient) {
  const daysAfter = getDaysAfterSurgery(patient.surgeryDate);
  const program = getRehabProgramMeta(patient.rehabProgram);
  let currentStart = 0;

  const stages = rehabStages.map((stage, index) => {
    const duration = program.stageDurations[index] ?? stage.baseDuration;
    const range = [currentStart, currentStart + duration - 1];
    currentStart += duration;

    return {
      ...stage,
      range,
      period: `${range[0]}-${range[1]} день`,
      focus: `${stage.focus} ${program.clinicalAccent}`,
      goals: [...stage.goals, program.goalAccent],
    };
  });

  const currentStage = stages.find((stage) => daysAfter >= stage.range[0] && daysAfter <= stage.range[1]) ?? stages[stages.length - 1];

  const scheduledTasks = [
    { time: "08:30", title: "Утренний комплекс ЛФК", note: program.dailyLoad },
    { time: "12:00", title: "Заполнение дневника самоконтроля", note: "Боль, отёк, температура, шаги, пульс, самочувствие" },
    { time: "15:00", title: "Ходьба по плану", note: program.walkingGoal },
    { time: "18:00", title: "Контроль симптомов в чате", note: program.chatRecommendation },
  ];

  return {
    program,
    currentStage,
    stages,
    scheduledTasks,
  };
}
