const roleMeta = {
  patient: {
    overline: "Личный кабинет пациента",
    title: "Домашняя реабилитация после эндопротезирования",
    chip: "Роль: пациент",
  },
  doctor: {
    overline: "Рабочее место врача",
    title: "Мониторинг пациентов, оценка рисков и клинический чат",
    chip: "Роль: врач",
  },
  default: {
    overline: "Цифровая платформа реабилитации",
    title: "Наблюдение, обучение и коммуникация в одном контуре",
    chip: "Сеанс",
  },
};

function AppHeader({ role, onLogout }) {
  const meta = roleMeta[role] ?? roleMeta.default;

  return (
    <header className={`top-switcher ${role === "doctor" ? "doctor-header" : "patient-header"}`}>
      <div className="brand-row">
        <div className="brand-mark">РК</div>
        <div>
          <p className="overline accent">Цифровая реабилитация</p>
          <h1>Контур восстановления</h1>
        </div>
      </div>

      <div className="workspace-heading">
        <p className="overline">{meta.overline}</p>
        <strong>{meta.title}</strong>
      </div>

      <div className="view-actions">
        <span className={`role-badge ${role === "doctor" ? "doctor" : "patient"}`}>{meta.chip}</span>
        <button className="view-pill logout-pill" onClick={() => onLogout(role)}>
          Выйти
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
