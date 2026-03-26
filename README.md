# MedPlatformRehab

Цифровая платформа реабилитации после эндопротезирования с отдельными интерфейсами пациента и врача, чатом, дневником самоконтроля, планом восстановления и серверной частью для авторизации и обмена данными.

## Возможности

- отдельный вход пациента и врача;
- личный кабинет пациента с этапами реабилитации;
- дневник самоконтроля с сохранением показателей;
- модуль ЛФК и персональные упражнения;
- чат пациента, врача и чат-бота;
- врачебная панель с пациентами, инцидентами и перепиской;
- backend API на Express;
- WebSocket-канал для обновления чатов;
- Redis-контур для хранения состояния.

## Структура проекта

- `src/` — frontend на React + Vite
- `backend/src/` — backend на Express + WebSocket
- `dist/` — production-сборка frontend

## Запуск локально

### Frontend

```bash
npm install
npm run dev
```

Frontend будет доступен по адресу `http://localhost:5173`.

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend будет доступен по адресу `http://localhost:4010`.

## Запуск через Docker

```bash
docker compose up --build
```

После запуска:

- frontend: `http://localhost:5173`
- backend: `http://localhost:4010`
- Redis: `localhost:6379`

## Переменные окружения

### Frontend

- `VITE_API_URL` — адрес backend API
- `VITE_WS_URL` — адрес WebSocket backend

### Backend

- `PORT` — порт backend
- `REDIS_URL` — адрес Redis

## Сборка frontend

```bash
npm run build
```

## Проверка backend

```bash
node --check backend/src/server.js
```

## Репозиторий

GitHub: `https://github.com/FreejackRus/MedPlatformRehab.git`
