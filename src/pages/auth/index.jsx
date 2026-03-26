import { Link } from "react-router-dom";

function AuthLandingPage() {
  return (
    <div className="auth-shell auth-landing">
      <section className="auth-hero">
        <div className="brand-row">
          <div className="brand-mark">РК</div>
          <div>
            <p className="overline accent">Цифровая реабилитация</p>
            <h1>Единая платформа реабилитации после эндопротезирования</h1>
          </div>
        </div>

        <p className="auth-text">
          Выберите сценарий входа. Для пациента доступен личный кабинет с планом реабилитации, дневником самоконтроля и чатом.
          Для врача доступно рабочее место для наблюдения, оценки рисков и переписки.
        </p>
      </section>

      <section className="auth-choice-grid">
        <article className="auth-choice-card">
          <p className="overline">Пациент</p>
          <h2>Вход в личный кабинет пациента</h2>
          <p className="auth-text">Регистрация по телефону или электронной почте, персональный план восстановления, ЛФК, дневник, уведомления и чат.</p>
          <Link className="primary-action" to="/auth/patient">
            Войти как пациент
          </Link>
        </article>

        <article className="auth-choice-card">
          <p className="overline">Врач</p>
          <h2>Вход в рабочее место врача</h2>
          <p className="auth-text">Пациенты, сигналы внимания, инциденты, клиническая сводка и ответы в чате из единого рабочего контура.</p>
          <Link className="primary-action" to="/auth/doctor">
            Войти как врач
          </Link>
        </article>
      </section>
    </div>
  );
}

export default AuthLandingPage;
