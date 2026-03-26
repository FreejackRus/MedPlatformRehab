import { Link } from "react-router-dom";

function DoctorAuthForm({ form, onChange, onSubmit }) {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="brand-row">
          <div className="brand-mark">РК</div>
          <div>
            <p className="overline accent">Кабинет врача</p>
            <h1>Авторизация врача и куратора реабилитации</h1>
          </div>
        </div>

        <p className="auth-text">
          Рабочее место врача включает сигналы риска, реестр пациентов, клиническую сводку и переписку с пациентами в одном защищённом интерфейсе.
        </p>

        <div className="auth-highlights">
          <article>
            <span>1</span>
            <strong>Сигналы риска</strong>
            <p>Температура, сильная боль, выраженный отёк и отсутствие активности автоматически поднимаются как поводы для оценки.</p>
          </article>
          <article>
            <span>2</span>
            <strong>Переписка</strong>
            <p>Сообщения из чата поступают в рабочую ленту, где врач отвечает напрямую пациенту.</p>
          </article>
          <article>
            <span>3</span>
            <strong>Тестовый доступ</strong>
            <p>Электронная почта: `doctor@hospital.ru`, пароль: `doctor123`.</p>
          </article>
        </div>
      </section>

      <form
        className="auth-card"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="card-head">
          <div>
            <p className="overline">Вход врача</p>
            <h2>Рабочее место врача</h2>
          </div>
          <Link className="text-link" to="/auth">
            Общая форма входа
          </Link>
        </div>

        <label>
          Корпоративная электронная почта
          <input value={form.email} onChange={(event) => onChange("email", event.target.value)} placeholder="doctor@hospital.ru" />
        </label>

        <label>
          Пароль
          <input type="password" value={form.password} onChange={(event) => onChange("password", event.target.value)} placeholder="doctor123" />
        </label>

        <label>
          Медицинская организация
          <input value={form.organization} onChange={(event) => onChange("organization", event.target.value)} placeholder="ГКБ №12" />
        </label>

        <p className="form-hint">Тестовые данные для входа: `doctor@hospital.ru` / `doctor123`.</p>

        <button className="primary-action" type="submit">
          Войти как врач
        </button>
      </form>
    </div>
  );
}

export default DoctorAuthForm;
