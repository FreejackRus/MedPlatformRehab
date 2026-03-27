import { NavLink } from "react-router-dom";
import { doctorSections, triageStatuses } from "../../../entities/doctor/model/constants.js";
import DoctorChat from "../../../entities/chat/ui/DoctorChat.jsx";

function DoctorOverview({ state, derived }) {
  const { visiblePatients, currentStage } = derived;

  return (
    <section className="hero-panel doctor-hero">
      <div>
        <p className="overline accent">Клинический мониторинг</p>
        <h2>Рабочее пространство врача для наблюдения, оценки рисков и связи с пациентами</h2>
        <p className="hero-text">Врачебный интерфейс показывает пул пациентов, сигналы риска, обращения из чата и краткую клиническую сводку.</p>
      </div>

      <div className="hero-stats clinical-stats">
        <article>
          <span>Пациентов в наблюдении</span>
          <strong>{visiblePatients.length}</strong>
        </article>
        <article>
          <span>Инцидентов сегодня</span>
          <strong>{state.incidents.length}</strong>
        </article>
        <article>
          <span>Текущий этап пациента</span>
          <strong>{currentStage.period}</strong>
        </article>
      </div>
    </section>
  );
}

function PatientsScreen({ state, derived, actions }) {
  const { visiblePatients, patient } = derived;

  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="overline">Пациенты</p>
          <h3>Реестр наблюдения</h3>
        </div>

        <div className="doctor-controls">
          <input
            className="doctor-search"
            placeholder="Поиск по имени, клинике или контакту"
            value={state.doctor.patientSearch}
            onChange={(event) => actions.updateDoctorFilter("patientSearch", event.target.value)}
          />
          <select value={state.doctor.triageFilter} onChange={(event) => actions.updateDoctorFilter("triageFilter", event.target.value)}>
            {triageStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="doctor-patient-list">
        {visiblePatients.map((item) => (
          <article key={item.id} className={item.id === patient.id ? "doctor-patient-card active doctor-info-card" : "doctor-patient-card doctor-info-card"}>
            <div className="doctor-card-main">
              <strong>{item.fullName}</strong>
              <p>{item.clinic}</p>
            </div>
            <div className="doctor-card-meta">
              <div>
                <span>Протез</span>
                <small>{item.prosthesisType}</small>
              </div>
              <div>
                <span>Статус</span>
                <small>{item.status}</small>
              </div>
              <div>
                <span>Последний контакт</span>
                <small>{item.lastContact}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

function IncidentsScreen({ state }) {
  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="overline">Сигналы внимания</p>
          <h3>Сигналы и эскалации</h3>
        </div>
      </div>

      <div className="incident-list">
        {state.incidents.map((incident) => (
          <article key={incident.id} className={incident.severity === "Критический" ? "incident-card critical" : "incident-card"}>
            <span>{incident.severity}</span>
            <strong>{incident.title}</strong>
            <p>{incident.patient}</p>
            <small>
              {incident.time} В· {incident.status}
            </small>
          </article>
        ))}
      </div>
    </article>
  );
}

function ActivePatientScreen({ derived }) {
  const { patient, currentStage } = derived;

  return (
    <article className="card">
      <div className="card-head">
        <div>
          <p className="overline">Карточка пациента</p>
          <h3>Активное наблюдение</h3>
        </div>
      </div>

      <div className="doctor-summary summary-grid">
        <div>
          <span>Пациент</span>
          <strong>{patient.fullName}</strong>
        </div>
        <div>
          <span>Куратор</span>
          <strong>{patient.curator}</strong>
        </div>
        <div>
          <span>Текущий этап</span>
          <strong>{currentStage.title}</strong>
        </div>
        <div className="summary-wide">
          <span>Комментарий</span>
          <p>{patient.notes}</p>
        </div>
      </div>
    </article>
  );
}

function renderDoctorScreen(screen, state, derived, actions) {
  switch (screen) {
    case "patients":
      return <PatientsScreen state={state} derived={derived} actions={actions} />;
    case "incidents":
      return <IncidentsScreen state={state} />;
    case "chat":
      return (
        <DoctorChat
          threads={state.chatThreads}
          activeThread={derived.activeDoctorThread}
          draft={state.doctor.replyDraft}
          onSelectThread={actions.selectDoctorThread}
          onDraftChange={actions.updateDoctorDraft}
          onSend={actions.sendDoctorReply}
        />
      );
    case "overview":
    default:
      return (
        <section className="doctor-grid">
          <PatientsScreen state={state} derived={derived} actions={actions} />
          <IncidentsScreen state={state} />
          <ActivePatientScreen derived={derived} />
        </section>
      );
  }
}

function DoctorWorkspace({ state, derived, actions, screen = "overview" }) {
  return (
    <div className="app-shell doctor-shell">
      <aside className="sidebar">
        <div className="patient-card">
          <p className="overline">Врач</p>
          <strong>Д-р Елена Миронова</strong>
          <span>ГКБ №12</span>
        </div>

        <nav className="nav-list">
          {doctorSections.map((item) => (
            <NavLink
              key={item.id}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              to={`/doctor/${item.id}`}
              onClick={() => actions.navigateDoctorSection(item.id)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        {screen === "overview" ? <DoctorOverview state={state} derived={derived} /> : null}
        {renderDoctorScreen(screen, state, derived, actions)}
      </main>
    </div>
  );
}

export default DoctorWorkspace;
