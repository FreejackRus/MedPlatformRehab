import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Граница ошибок приложения:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-page">
          <div className="card error-card">
            <p className="overline accent">Ошибка приложения</p>
            <h2>Интерфейс столкнулся с ошибкой</h2>
            <p className="hero-text">Обновите страницу или перезапустите сессию. При необходимости можно добавить централизованную обработку ошибок и всплывающие уведомления.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
