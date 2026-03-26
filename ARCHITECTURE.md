# Frontend Direction

Сейчас проект переведен в более модульное состояние и готов к дальнейшему раскладыванию в FSD.

Целевой контур:

- `app/` — роутинг, провайдеры, глобальные стили
- `pages/` — страницы `patient`, `doctor`, `auth-patient`, `auth-doctor`
- `widgets/` — крупные сборки экранов: workspace пациента, workspace врача, чатовые панели
- `features/` — действия пользователя: auth, send-message, toggle-reminder, update-journal
- `entities/` — доменные сущности: patient, doctor, chat-thread, rehab-plan, journal-entry
- `shared/` — ui-kit, utils, hooks, config

Сейчас часть кода еще лежит в `components/`, `hooks/`, `data/`, `utils/`.
Это уже лучше монолита, но не финальная FSD-укладка.
