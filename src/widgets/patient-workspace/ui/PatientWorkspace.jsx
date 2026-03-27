import { NavLink } from "react-router-dom";
import { patientSections, faqMaterials } from "../../../entities/patient/model/constants.js";
import { exerciseFilters } from "../../../entities/rehab/model/constants.js";
import PatientChat from "../../../entities/chat/ui/PatientChat.jsx";
import MetricChart from "../../../entities/metric/ui/MetricChart.jsx";

function OverviewScreen({ derived }) {
  const { patient, daysAfterSurgery, currentStage, progressPercent, recoveryPlan, emergencySignals } = derived;

  return (
    <>
      <section className="hero-panel clinical-hero">
        <div>
          <p className="overline accent">Реабилитационный маршрут</p>
          <h2>Понятный план восстановления после операции с ежедневным контролем состояния</h2>
          <p className="hero-text">
            Протокол: {recoveryPlan.program.label}. План автоматически пересчитан от даты операции и текущих рекомендаций стационара.
          </p>
        </div>

        <div className="hero-stats clinical-stats">
          <article>
            <span>День после операции</span>
            <strong>{daysAfterSurgery}</strong>
          </article>
          <article>
            <span>Выполнение плана</span>
            <strong>{progressPercent}%</strong>
          </article>
          <article>
            <span>Текущий этап</span>
            <strong>{currentStage.period}</strong>
          </article>
          <article>
            <span>Протокол</span>
            <strong>{recoveryPlan.program.label}</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-head">
            <div>
              <p className="overline">Пациент</p>
              <h3>{patient.fullName}</h3>
            </div>
          </div>
          <div className="registration-card info-grid">
            <div>
              <span>Дата операции</span>
              <strong>{patient.surgeryDate}</strong>
            </div>
            <div>
              <span>Поликлиника</span>
              <strong>{patient.clinic}</strong>
            </div>
            <div>
              <span>Тип протеза</span>
              <strong>{patient.prosthesisType}</strong>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="card-head">
            <div>
              <p className="overline">Текущий этап</p>
              <h3>{currentStage.title}</h3>
            </div>
          </div>
          <p className="hero-text">{currentStage.focus}</p>
          <ul className="material-list">
            {currentStage.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </article>

        <article className="card card-span-2">
          <div className="card-head">
            <div>
              <p className="overline">Контроль безопасности</p>
              <h3>Экстренные сигналы</h3>
            </div>
          </div>
          <div className="signal-grid">
            {emergencySignals.length ? (
              emergencySignals.map((signal) => (
                <article key={signal.id} className={signal.severity === "critical" ? "incident-card critical" : "incident-card"}>
                  <span>{signal.severity === "critical" ? "Критический" : "Высокий"}</span>
                  <strong>{signal.label}</strong>
                  <p>Рекомендуется связаться с врачом или использовать чат поддержки.</p>
                </article>
              ))
            ) : (
              <article className="incident-card">
                <span>Норма</span>
                <strong>Критических сигналов не выявлено</strong>
                <p>Показатели в пределах безопасного домашнего режима.</p>
              </article>
            )}
          </div>
        </article>
      </section>
    </>
  );
}

function PlanScreen({ state, derived, actions }) {
  const { currentStage, recoveryPlan, completedTasks } = derived;

  return (
    <section className="dashboard-grid">
      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">План реабилитации</p>
            <h3>Автоматический график по дате операции и рекомендациям стационара</h3>
          </div>
          <span className="badge">{recoveryPlan.program.label}</span>
        </div>

        <div className="stage-summary">
          <div>
            <span>Текущий этап</span>
            <strong>{currentStage.title}</strong>
            <p>{currentStage.focus}</p>
          </div>
          <div>
            <span>Рекомендации стационара</span>
            <p>{recoveryPlan.program.clinicalAccent}</p>
            <p>{recoveryPlan.program.goalAccent}</p>
          </div>
        </div>

        <div className="timeline-grid">
          {recoveryPlan.stages.map((stage) => (
            <article key={stage.id} className={stage.id === currentStage.id ? "timeline-card current" : "timeline-card"}>
              <span>{stage.period}</span>
              <strong>{stage.title}</strong>
              <p>{stage.focus}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Задачи дня</p>
            <h3>План на сегодня</h3>
          </div>
          <span className="badge subtle">
            {completedTasks}/{state.tasks.length} выполнено
          </span>
        </div>
        <div className="task-list">
          {state.tasks.map((task) => (
            <article key={task.id} className={task.done ? "task-card done" : "task-card"}>
              <span>{task.time}</span>
              <strong>{task.title}</strong>
              <p>{task.note}</p>
              <button className={task.done ? "toggle-button completed" : "toggle-button"} onClick={() => actions.toggleTask(task.id)}>
                {task.done ? "Отмечено" : "Выполнить"}
              </button>
            </article>
          ))}
        </div>
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Стационарный протокол</p>
            <h3>Ежедневные ориентиры</h3>
          </div>
        </div>
        <div className="task-list">
          {recoveryPlan.scheduledTasks.map((task) => (
            <article key={`${task.time}-${task.title}`} className="task-card">
              <span>{task.time}</span>
              <strong>{task.title}</strong>
              <p>{task.note}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function JournalScreen({ state, derived, actions }) {
  return (
    <section className="dashboard-grid">
      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">Дневник самоконтроля</p>
            <h3>Ежедневное заполнение показателей</h3>
          </div>
          <div className="view-actions">
            <button className="view-pill" onClick={actions.resetJournalDraft}>
              Сбросить
            </button>
            <button className="primary-action" onClick={actions.saveJournal} disabled={state.ui?.journalSaveStatus === "saving"}>
              {state.ui?.journalSaveStatus === "saving" ? "Сохраняем..." : "Сохранить дневник"}
            </button>
          </div>
        </div>

        {state.ui?.journalSaveMessage ? (
          <div
            className={
              state.ui?.journalSaveStatus === "error"
                ? "inline-status error"
                : state.ui?.journalSaveStatus === "success"
                  ? "inline-status success"
                  : "inline-status"
            }
          >
            {state.ui.journalSaveMessage}
          </div>
        ) : null}

        <div className="journal-grid">
          <label>
            Боль ВАШ
            <input type="range" min="0" max="10" value={state.journalDraft.pain} onChange={(event) => actions.updateJournalDraft("pain", event.target.value)} />
            <strong>{state.journalDraft.pain} / 10</strong>
          </label>
          <label>
            Отёк
            <select value={state.journalDraft.swelling} onChange={(event) => actions.updateJournalDraft("swelling", event.target.value)}>
              <option>Нет</option>
              <option>Умеренный</option>
              <option>Выраженный</option>
            </select>
          </label>
          <label>
            Температура тела
            <input value={state.journalDraft.temperature} onChange={(event) => actions.updateJournalDraft("temperature", event.target.value)} />
          </label>
          <label>
            Пульс
            <input value={state.journalDraft.pulse} onChange={(event) => actions.updateJournalDraft("pulse", event.target.value)} />
          </label>
          <label>
            Количество шагов
            <input value={state.journalDraft.steps} onChange={(event) => actions.updateJournalDraft("steps", event.target.value)} />
          </label>
          <label>
            Сон
            <input value={state.journalDraft.sleep} onChange={(event) => actions.updateJournalDraft("sleep", event.target.value)} />
          </label>
          <label className="label-wide">
            Состояние шва
            <input value={state.journalDraft.wound} onChange={(event) => actions.updateJournalDraft("wound", event.target.value)} />
          </label>
          <label className="label-wide">
            Общее самочувствие
            <textarea value={state.journalDraft.mood} onChange={(event) => actions.updateJournalDraft("mood", event.target.value)} />
          </label>
        </div>
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Динамика боли</p>
            <h3>Автоматический график</h3>
          </div>
        </div>
        <MetricChart metric={derived.metricConfig.pain} />
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Динамика отёка</p>
            <h3>Автоматический график</h3>
          </div>
        </div>
        <MetricChart metric={derived.metricConfig.swelling} />
      </article>

      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">Активность</p>
            <h3>Количество шагов</h3>
          </div>
        </div>
        <MetricChart metric={derived.metricConfig.steps} />
      </article>
    </section>
  );
}

function LfkScreen({ state, derived, actions }) {
  const { completedExercises, filteredExercises, recommendedExercises, stageOptions, techniqueGuides } = derived;

  return (
    <section className="dashboard-grid">
      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">Видеоуроки ЛФК</p>
            <h3>Персонализированный набор упражнений</h3>
          </div>
          <span className="badge subtle">{completedExercises} отмечено</span>
        </div>

        <div className="filter-row">
          <input
            className="doctor-search"
            placeholder="Поиск по названию, этапу или видео"
            value={state.exerciseSearch}
            onChange={(event) => actions.setExerciseSearch(event.target.value)}
          />
          <select value={state.selectedStageFilter} onChange={(event) => actions.setStageFilter(event.target.value)}>
            <option value="all">Все этапы</option>
            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-row">
          {exerciseFilters.map((filter) => (
            <button key={filter} className={state.selectedFilter === filter ? "metric-pill active" : "metric-pill"} onClick={() => actions.setFilter(filter)}>
              {filter}
            </button>
          ))}
        </div>

        <div className="exercise-list">
          {filteredExercises.map((exercise) => (
            <article key={exercise.id} id={exercise.id} className="exercise-card video-card">
              <div>
                <strong>{exercise.title}</strong>
                <p>
                  {exercise.stage} · {exercise.type} · {exercise.duration}
                </p>
                <p>{exercise.videoTitle}</p>
                <p>{exercise.videoSummary}</p>
              </div>
              <button className={exercise.completed ? "toggle-button completed" : "toggle-button"} onClick={() => actions.toggleExercise(exercise.id)}>
                {exercise.completed ? "Выполнено" : "Отметить"}
              </button>
            </article>
          ))}
        </div>
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Рекомендуемые видео</p>
            <h3>Текущий этап</h3>
          </div>
        </div>
        <div className="task-list">
          {recommendedExercises.map((exercise) => (
            <article key={exercise.id} className="task-card">
              <span>{exercise.stage}</span>
              <strong>{exercise.videoTitle}</strong>
              <p>{exercise.title}</p>
            </article>
          ))}
        </div>
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Проверка техники</p>
            <h3>Ссылки на соответствующие видеоуроки</h3>
          </div>
        </div>
        <div className="task-list">
          {techniqueGuides.map((guide) => (
            <article key={guide.id} className="task-card">
              <span>{guide.title}</span>
              <strong>{guide.exercise.videoTitle}</strong>
              <p>{guide.cue}</p>
              <button
                className="view-pill"
                onClick={() => {
                  document.getElementById(guide.exercise.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                Перейти к видео
              </button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function ProgressScreen({ state, derived, actions }) {
  const { metricConfig } = derived;

  return (
    <section className="dashboard-grid">
      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">Отслеживание прогресса</p>
            <h3>{metricConfig[state.selectedMetric].title}</h3>
          </div>
        </div>
        <div className="metric-switcher">
          {Object.entries(metricConfig).map(([key, metric]) => (
            <button key={key} className={state.selectedMetric === key ? "metric-pill active" : "metric-pill"} onClick={() => actions.setMetric(key)}>
              {metric.label}
            </button>
          ))}
        </div>
        <MetricChart metric={metricConfig[state.selectedMetric]} />
      </article>
    </section>
  );
}

function NotificationsScreen({ state, actions }) {
  return (
    <section className="dashboard-grid">
      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">Напоминания и уведомления</p>
            <h3>Персональные push-сценарии</h3>
          </div>
        </div>
        <div className="reminder-list">
          {state.reminders.map((reminder) => (
            <article key={reminder.id} className="reminder-item">
              <div>
                <strong>{reminder.label}</strong>
                <p>{reminder.description}</p>
              </div>
              <button className={reminder.enabled ? "status enabled clickable" : "status disabled clickable"} onClick={() => actions.toggleReminder(reminder.id)}>
                {reminder.enabled ? "Активно" : "Выключено"}
              </button>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function MaterialsScreen() {
  return (
    <section className="dashboard-grid">
      <article className="card card-span-2">
        <div className="card-head">
          <div>
            <p className="overline">Дополнительные материалы</p>
            <h3>Памятки и рекомендации пациента</h3>
          </div>
        </div>
        <ul className="material-list">
          {faqMaterials.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function ProfileScreen({ derived }) {
  const { patient, recoveryPlan } = derived;

  return (
    <section className="dashboard-grid">
      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Профиль пациента</p>
            <h3>Маршрут наблюдения</h3>
          </div>
        </div>
        <div className="registration-card info-grid">
          <div>
            <span>Контакт</span>
            <strong>{patient.contact}</strong>
          </div>
          <div>
            <span>Дата операции</span>
            <strong>{patient.surgeryDate}</strong>
          </div>
          <div>
            <span>Куратор</span>
            <strong>{patient.curator}</strong>
          </div>
        </div>
      </article>

      <article className="card">
        <div className="card-head">
          <div>
            <p className="overline">Назначенный протокол</p>
            <h3>{recoveryPlan.program.label}</h3>
          </div>
        </div>
        <p className="hero-text">{recoveryPlan.program.clinicalAccent}</p>
        <p className="hero-text">{recoveryPlan.program.goalAccent}</p>
      </article>
    </section>
  );
}

function renderScreen(screen, state, derived, actions) {
  switch (screen) {
    case "plan":
      return <PlanScreen state={state} derived={derived} actions={actions} />;
    case "journal":
      return <JournalScreen state={state} derived={derived} actions={actions} />;
    case "lfk":
      return <LfkScreen state={state} derived={derived} actions={actions} />;
    case "progress":
      return <ProgressScreen state={state} derived={derived} actions={actions} />;
    case "notifications":
      return <NotificationsScreen state={state} actions={actions} />;
    case "chat":
      return (
        <PatientChat
          threads={state.chatThreads.filter((thread) => thread.patientId === derived.patient.id)}
          activeThread={derived.activePatientThread}
          draft={state.patientChat.draft}
          onSelectThread={actions.selectPatientThread}
          onDraftChange={actions.updatePatientDraft}
          onSend={actions.sendPatientMessage}
        />
      );
    case "materials":
      return <MaterialsScreen />;
    case "profile":
      return <ProfileScreen derived={derived} />;
    case "overview":
    default:
      return <OverviewScreen derived={derived} />;
  }
}

function PatientWorkspace({ state, derived, actions, screen = "overview" }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="patient-card">
          <p className="overline">Пациент</p>
          <strong>{derived.patient.fullName}</strong>
          <span>{derived.daysAfterSurgery}-й день после операции</span>
          <div className="patient-meta">
            <div>
              <small>Поликлиника</small>
              <strong>{derived.patient.clinic}</strong>
            </div>
            <div>
              <small>Протокол</small>
              <strong>{derived.recoveryPlan.program.label}</strong>
            </div>
          </div>
        </div>

        <nav className="nav-list">
          {patientSections.map((item) => (
            <NavLink
              key={item.id}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              to={`/patient/${item.id}`}
              onClick={() => actions.navigatePatientSection(item.id)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">{renderScreen(screen, state, derived, actions)}</main>
    </div>
  );
}

export default PatientWorkspace;
