export const STORAGE_KEY = "rehabcare-platform-state";

export const clinics = ["ГКБ №12", "Поликлиника №4", "Центр травматологии №2", "Городская поликлиника №18"];
export const prosthesisTypes = ["Тотальный", "Частичный", "Ревизионный"];
export const exerciseFilters = ["Все", "Дыхание", "Суставы", "Баланс", "Ходьба", "Сила"];
export const chartLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const rehabProtocols = [
  {
    id: "standard",
    label: "Стандартный протокол",
    clinicalAccent: "Нагрузка увеличивается по типовой схеме отделения.",
    goalAccent: "Переходить к следующему этапу при стабильной переносимости нагрузки.",
    dailyLoad: "15 минут, мягкая мобилизация и дыхательные упражнения.",
    walkingGoal: "Дозированная ходьба 3-4 подхода в течение дня.",
    chatRecommendation: "Сообщить о боли выше 5 баллов или нарастании отёка.",
    stageDurations: [14, 14, 28, 63],
  },
  {
    id: "gentle",
    label: "Щадящий протокол",
    clinicalAccent: "Темп увеличения нагрузки снижен по рекомендации стационара.",
    goalAccent: "Приоритет на контроль боли и защиту мягких тканей.",
    dailyLoad: "10-12 минут, щадящая мобилизация без форсирования амплитуды.",
    walkingGoal: "Короткая ходьба с дополнительными паузами на отдых.",
    chatRecommendation: "Отмечать любую температуру, усиление боли или покраснение.",
    stageDurations: [21, 21, 35, 63],
  },
  {
    id: "intensive",
    label: "Ускоренный протокол",
    clinicalAccent: "Допускается более раннее расширение активности под контролем врача.",
    goalAccent: "Приоритет на рост бытовой активности и переносимости ходьбы.",
    dailyLoad: "20 минут, расширенный комплекс ЛФК и работа на силу.",
    walkingGoal: "Увеличение дневной дистанции с контролем боли и усталости.",
    chatRecommendation: "Фиксировать перегрузку после ходьбы и упражнений.",
    stageDurations: [10, 14, 24, 72],
  },
];

export const patientSections = [
  { id: "overview", label: "Обзор" },
  { id: "plan", label: "План" },
  { id: "journal", label: "Самоконтроль" },
  { id: "lfk", label: "ЛФК" },
  { id: "progress", label: "Прогресс" },
  { id: "notifications", label: "Уведомления" },
  { id: "chat", label: "Чат" },
  { id: "materials", label: "Материалы" },
  { id: "profile", label: "Профиль" },
];

export const doctorSections = [
  { id: "overview", label: "Сводка" },
  { id: "patients", label: "Пациенты" },
  { id: "incidents", label: "Инциденты" },
  { id: "chat", label: "Чаты" },
];

export const rehabStages = [
  {
    id: "phase-1",
    title: "Контроль боли и запуск движения",
    focus: "Снижение боли, уход за швом, первые шаги с опорой.",
    goals: ["Боль не выше 4-5 по ВАШ", "Безопасная ходьба с опорой", "Ежедневный самоконтроль"],
    baseDuration: 14,
  },
  {
    id: "phase-2",
    title: "Рост активности и устойчивости",
    focus: "Постепенное расширение объёма движений, баланс и дозированная ходьба.",
    goals: ["Увеличение дистанции", "Контроль умеренного отёка", "Самостоятельное выполнение ЛФК"],
    baseDuration: 14,
  },
  {
    id: "phase-3",
    title: "Возврат к бытовой активности",
    focus: "Укрепление мышц, работа над походкой и снижение зависимости от опоры.",
    goals: ["Больше бытовой активности", "Рост силы мышц бедра", "Стабильная походка"],
    baseDuration: 28,
  },
  {
    id: "phase-4",
    title: "Закрепление результата",
    focus: "Переход к расширенной активности и профилактика перегрузки.",
    goals: ["Уверенная мобильность", "Понимание безопасной нагрузки", "Стабильный домашний режим"],
    baseDuration: 63,
  },
];

export const faqMaterials = [
  "Инструкция по уходу за швом и список тревожных признаков",
  "Рекомендации по питанию для снижения отёка и восстановления тканей",
  "Правила безопасного передвижения с костылями или ходунками",
  "Ответы на вопросы о боли, сне, лекарствах и бытовой активности",
];

export const emergencyRules = [
  "Температура выше 38 °C",
  "Боль по ВАШ 7 и выше",
  "Выраженный отёк или покраснение",
  "Нет активности более 2 дней",
];

export const techniqueChecks = [
  {
    id: "tech-1",
    title: "Боль после упражнения",
    cue: "Если после упражнения появилась боль, перейдите к щадящей мобилизации сустава и оцените технику выполнения.",
    exerciseId: "ex-2",
  },
  {
    id: "tech-2",
    title: "Неуверенность при ходьбе",
    cue: "При нарушении шага проверьте опору и вернитесь к видео по дозированной ходьбе.",
    exerciseId: "ex-5",
  },
  {
    id: "tech-3",
    title: "Сложно удерживать баланс",
    cue: "Если теряете устойчивость, используйте опору и пересмотрите упражнения на баланс.",
    exerciseId: "ex-4",
  },
];

export const basePatients = [
  {
    id: "pt-001",
    fullName: "Иван Петров",
    contact: "+7 999 123 45 67",
    surgeryDate: "2026-03-12",
    prosthesisType: "Тотальный",
    clinic: "ГКБ №12",
    curator: "Ольга Смирнова",
    rehabProgram: "standard",
    status: "На домашнем этапе",
    lastContact: "Сегодня, 09:20",
    notes: "Выполняет ЛФК регулярно, отмечает умеренный отёк к вечеру.",
  },
  {
    id: "pt-002",
    fullName: "Марина Соколова",
    contact: "marina@example.com",
    surgeryDate: "2026-03-05",
    prosthesisType: "Частичный",
    clinic: "Поликлиника №4",
    curator: "Антон Беляев",
    rehabProgram: "gentle",
    status: "Требует внимания",
    lastContact: "Сегодня, 08:10",
    notes: "Нужен повторный контакт из-за температуры и усилившегося отёка.",
  },
  {
    id: "pt-003",
    fullName: "Сергей Волков",
    contact: "+7 900 777 90 10",
    surgeryDate: "2026-02-22",
    prosthesisType: "Ревизионный",
    clinic: "Центр травматологии №2",
    curator: "Наталья Егорова",
    rehabProgram: "intensive",
    status: "Стабильный прогресс",
    lastContact: "Вчера, 18:45",
    notes: "Стабильная динамика шагов и уменьшение боли.",
  },
];

export const initialExercises = [
  {
    id: "ex-1",
    title: "Дыхательные упражнения",
    stageId: "phase-1",
    stage: "0-2 неделя",
    type: "Дыхание",
    duration: "7 мин",
    completed: true,
    videoTitle: "Видео: дыхательная активация",
    videoSummary: "Спокойный темп, работа с дыханием и мягкой активацией кровообращения.",
  },
  {
    id: "ex-2",
    title: "Мягкая мобилизация колена",
    stageId: "phase-1",
    stage: "0-2 неделя",
    type: "Суставы",
    duration: "12 мин",
    completed: true,
    videoTitle: "Видео: мягкая мобилизация колена",
    videoSummary: "Щадящее упражнение для уменьшения боли и восстановления амплитуды.",
  },
  {
    id: "ex-3",
    title: "Подъём прямой ноги",
    stageId: "phase-1",
    stage: "0-2 неделя",
    type: "Сила",
    duration: "8 мин",
    completed: false,
    videoTitle: "Видео: подъём прямой ноги",
    videoSummary: "Базовое силовое упражнение с акцентом на правильную ось ноги.",
  },
  {
    id: "ex-4",
    title: "Баланс с опорой",
    stageId: "phase-2",
    stage: "3-4 неделя",
    type: "Баланс",
    duration: "10 мин",
    completed: false,
    videoTitle: "Видео: баланс с опорой",
    videoSummary: "Упражнение на устойчивость с обязательной страховкой.",
  },
  {
    id: "ex-5",
    title: "Ходьба с дозированной нагрузкой",
    stageId: "phase-2",
    stage: "3-4 неделя",
    type: "Ходьба",
    duration: "9 мин",
    completed: false,
    videoTitle: "Видео: дозированная ходьба",
    videoSummary: "Пошаговая техника безопасной ходьбы и контроля переноса веса.",
  },
  {
    id: "ex-6",
    title: "Укрепление бедра и ягодичных",
    stageId: "phase-3",
    stage: "5-8 неделя",
    type: "Сила",
    duration: "14 мин",
    completed: false,
    videoTitle: "Видео: укрепление бедра",
    videoSummary: "Работа на силу и контроль положения таза.",
  },
];

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

export const defaultAppState = {
  role: "patient",
  authReady: false,
  auth: {
    patientAuthorized: false,
    doctorAuthorized: false,
    patientToken: "",
    doctorToken: "",
  },
  patientSection: "overview",
  doctorSection: "overview",
  patient: basePatients[0],
  registrationForm: {
    contact: basePatients[0].contact,
    fullName: basePatients[0].fullName,
    surgeryDate: basePatients[0].surgeryDate,
    prosthesisType: basePatients[0].prosthesisType,
    clinic: basePatients[0].clinic,
    rehabProgram: basePatients[0].rehabProgram,
  },
  doctorAuthForm: {
    email: "doctor@hospital.ru",
    password: "doctor123",
    organization: "ГКБ №12",
  },
  reminders: [
    { id: "exercise", label: "Упражнения", description: "Напоминание о времени выполнения ЛФК", enabled: true },
    { id: "meds", label: "Лекарства", description: "Контроль схемы приёма препаратов", enabled: true },
    { id: "journal", label: "Дневник", description: "Ежедневное заполнение самоконтроля", enabled: true },
    { id: "consult", label: "Консультации", description: "Будущие приёмы и госпитализации", enabled: false },
  ],
  tasks: [
    { id: "task-1", time: "08:30", title: "Утренний комплекс ЛФК", note: "15 минут, мягкая мобилизация и дыхательные упражнения", done: true },
    { id: "task-2", time: "12:00", title: "Заполнение дневника самоконтроля", note: "Боль, отёк, температура, шаги, пульс, самочувствие", done: false },
    { id: "task-3", time: "18:00", title: "Контрольное сообщение чат-бота", note: "Проверка симптомов и фиксация дневной активности", done: false },
  ],
  exercises: initialExercises,
  journal: {
    pain: 3,
    swelling: "Умеренный",
    temperature: "36.7",
    pulse: "78",
    steps: "3420",
    mood: "Спокойное, есть прогресс",
    sleep: "6.5 часов",
    wound: "Шов сухой, без выделений",
  },
  journalDraft: {
    pain: 3,
    swelling: "Умеренный",
    temperature: "36.7",
    pulse: "78",
    steps: "3420",
    mood: "Спокойное, есть прогресс",
    sleep: "6.5 часов",
    wound: "Шов сухой, без выделений",
  },
  progress: {
    pain: [6, 5, 5, 4, 4, 3, 3],
    swelling: [4, 4, 4, 3, 3, 3, 2],
    steps: [1800, 2200, 2500, 2900, 3100, 3420, 3860],
    flexion: [45, 52, 57, 63, 70, 78, 85],
  },
  selectedMetric: "pain",
  selectedFilter: "Все",
  selectedStageFilter: "all",
  exerciseSearch: "",
  doctor: {
    patientSearch: "",
    triageFilter: "Все",
    selectedThreadId: "thread-1",
    replyDraft: "",
  },
  ui: {
    journalSaveStatus: "idle",
    journalSaveMessage: "",
  },
  patientChat: {
    selectedThreadId: "thread-1",
    draft: "",
  },
  chatThreads: initialThreads,
  incidents: [
    { id: "inc-1", severity: "Высокий", title: "Боль после упражнения", patient: "Иван Петров", time: "Сегодня, 09:12", status: "Ожидает ответа врача" },
    { id: "inc-2", severity: "Критический", title: "Температура 38.1 и выраженный отёк", patient: "Марина Соколова", time: "Сегодня, 08:06", status: "Срочная связь с врачом" },
  ],
};
