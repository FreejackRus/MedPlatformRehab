export const initialThreads = [
  {
    id: "thread-1",
    patientId: "pt-001",
    title: "Боль после упражнения",
    status: "needs_review",
    unreadByDoctor: true,
    unreadByPatient: false,
    botState: {
      mode: "pain_assessment",
      trigger: "pain_after_exercise",
      painScore: 6,
      location: null,
      timing: null,
    },
    messages: [
      { id: "m1", author: "patient", text: "У меня болит колено после упражнения.", timestamp: "09:10" },
      {
        id: "m2",
        author: "bot",
        text: "Чтобы понять, безопасна ли нагрузка, ответьте, пожалуйста, на три вопроса: оцените боль по шкале от 0 до 10; где именно болит: спереди, сбоку или сзади; когда появилась боль: сразу после упражнения или через время.",
        timestamp: "09:11",
      },
    ],
  },
  {
    id: "thread-2",
    patientId: "pt-002",
    title: "Температура и отёк",
    status: "escalated",
    unreadByDoctor: true,
    unreadByPatient: false,
    botState: { mode: "escalated" },
    messages: [
      { id: "m4", author: "patient", text: "Сегодня температура 38.1 и усилился отёк.", timestamp: "08:06" },
      { id: "m5", author: "bot", text: "Это тревожный признак. Я передаю обращение врачу.", timestamp: "08:06" },
    ],
  },
];
