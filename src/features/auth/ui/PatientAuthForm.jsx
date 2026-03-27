import { Link } from "react-router-dom";
import { clinics, prosthesisTypes, rehabProtocols } from "../model/options.js";

function PatientAuthForm({ form, onChange, onSubmit }) {
  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <div className="brand-row">
          <div className="brand-mark">РК</div>
          <div>
            <p className="overline accent">Кабинет пациента</p>
            <h1>Вход пациента в цифровой маршрут реабилитации</h1>
          </div>
        </div>

        <p className="auth-text">
          После входа пациент получает персональный план восстановления, видео ЛФК, дневник самоконтроля, напоминания и защищённый чат поддержки.
        </p>

        <div className="auth-highlights">
          <article>
            <span>1</span>
            <strong>Маршрут восстановления</strong>
            <p>План рассчитывается по дате операции и рекомендациям стационара.</p>
          </article>
          <article>
            <span>2</span>
            <strong>Самоконтроль</strong>
            <p>Боль, отёк, температура, шаги, пульс и общее самочувствие сохраняются как медицинский дневник.</p>
          </article>
          <article>
            <span>3</span>
            <strong>Чат и наблюдение</strong>
            <p>Тревожные сообщения автоматически передаются врачу, а обычные вопросы можно решить через чат поддержки.</p>
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
            <p className="overline">Авторизация пациента</p>
            <h2>Личный кабинет</h2>
          </div>
          <Link className="text-link" to="/auth">
            Общая форма входа
          </Link>
        </div>

        <label>
          Телефон или электронная почта
          <input value={form.contact} onChange={(event) => onChange("contact", event.target.value)} placeholder="+7 999 123 45 67" />
        </label>

        <label>
          ФИО
          <input value={form.fullName} onChange={(event) => onChange("fullName", event.target.value)} placeholder="Иван Петров" />
        </label>

        <label>
          Дата операции
          <input type="date" value={form.surgeryDate} onChange={(event) => onChange("surgeryDate", event.target.value)} />
        </label>

        <label>
          Тип протеза
          <select value={form.prosthesisType} onChange={(event) => onChange("prosthesisType", event.target.value)}>
            {prosthesisTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Поликлиника по месту жительства
          <select value={form.clinic} onChange={(event) => onChange("clinic", event.target.value)}>
            {clinics.map((clinic) => (
              <option key={clinic}>{clinic}</option>
            ))}
          </select>
        </label>

        <label>
          Рекомендации стационара
          <select value={form.rehabProgram} onChange={(event) => onChange("rehabProgram", event.target.value)}>
            {rehabProtocols.map((program) => (
              <option key={program.id} value={program.id}>
                {program.label}
              </option>
            ))}
          </select>
        </label>

        <button className="primary-action" type="submit">
          Открыть кабинет пациента
        </button>
      </form>
    </div>
  );
}

export default PatientAuthForm;
