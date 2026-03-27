# Frontend Architecture (FSD)

Проект переведен на FSD-структуру без legacy-слоев `components/`, `hooks/`, `data/`, `utils/`.

Текущие слои:

- `app/` — корневой composition layer и store (`app/store/useAppStore.js`)
- `pages/` — route-level страницы (`auth`, `auth-patient`, `auth-doctor`, `patient`, `doctor`)
- `widgets/` — крупные экранные сборки (`patient-workspace`, `doctor-workspace`, `app-header`)
- `features/` — пользовательские сценарии и их модель (`features/auth/model/options.js`, `features/auth/ui/*`)
- `entities/` — доменные сущности и локальные модели (`chat`, `doctor`, `patient`, `rehab`, `journal`, `metric`)
- `shared/` — переиспользуемая инфраструктура (`shared/api`, `shared/lib`, `shared/ui`)

Бизнес-логика:

- orchestration-слой store: `app/store/useAppStore.js`
- bootstrap/persistence/derived: `app/store/model/*`
- доменные вычисления восстановления и прогресса: `shared/lib/domain.js`
- доменные константы и seed-данные: `entities/*/model/seed.js` и `entities/*/model/constants.js`
- UI-композиция по ролям: `widgets/patient-workspace/ui/PatientWorkspace.jsx` и `widgets/doctor-workspace/ui/DoctorWorkspace.jsx`
- feature actions:
- `features/auth/model/actions.js`
- `features/journal/model/actions.js`
- `features/chat/model/actions.js`
- `features/rehab/model/actions.js`
- `features/doctor-filter/model/actions.js`
- `features/workspace-navigation/model/actions.js`
