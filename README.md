# AgroSphere 🌾

Сучасна платформа для управління сільськогосподарськими угіддями, полями та паралями з можливістю геопросторового аналізу та планування робіт.

## 📋 Про проект

**AgroSphere** — це комплексне рішення для фермерів та аграрних підприємств, яке дозволяє:

- 🗺️ Управляти паралями та полями за допомогою інтерактивних карт
- 📊 Аналізувати дані про врожайність та стан ґрунту
- 📅 Планувати сільськогосподарські роботи та операції
- 💰 Управляти фінансами та платежами через Stripe
- 👥 Здійснювати управління доступом та правами користувачів
- 📱 Мати доступ з мобільних пристроїв та веб-браузера

## 🏗️ Структура проекту

Це **monorepo** проект на базі **Nx**, організований таким чином:

```
agrosphere/
├── apps/
│   ├── agrosphere/         # 🌐 Основний веб-додаток (Next.js)
│   ├── mobile/             # 📱 Мобільний додаток (React Native)
│   ├── backend/            # 🔧 API серверна частина
│   └── keycloakify-starter/ # 🔐 Аутентифікація (Keycloak)
├── libs/
│   └── shared/             # 📚 Спільні бібліотеки та компоненти
├── tools/                  # 🛠️ Утиліти для сборки та розробки
└── nx.json                 # Конфігурація Nx workspace
```

### Основні додатки

| Додаток | Опис | Технологія |
|---------|------|-----------|
| **AgroSphere** | Веб-платформа для управління фермами | Next.js 15, React 19, TypeScript |
| **Mobile** | Мобільний додаток для смартфонів | React Native, Expo |
| **Backend** | REST API для всіх клієнтів | Node.js |
| **Keycloakify** | Система аутентифікації та авторизації | Keycloak, OAuth2 |

## 🚀 Швидкий старт

### Передумови

- **Node.js** ≥ 18.0
- **Yarn** 1.22.22
- **Docker** (для Keycloak)

### Встановлення залежностей

```bash
yarn install
```

### Запуск Веб-додатка (AgroSphere)

```bash
npx nx dev agrosphere
```

Додаток буде доступний за адресою: `http://localhost:3000`

### Запуск Мобільного додатка

```bash
npx nx dev mobile
```

### Запуск Backend API

```bash
npx nx dev backend
```

Сервер буде запущений на: `http://localhost:4000`

### Сборка для виробництва

```bash
npx nx build agrosphere
npx nx build backend
```

## 🔧 Backend API

### Архітектура Backend

Backend побудований на **NestJS** — прогресивному фреймворку для Node.js з підтримкою TypeScript.

**Технологічний стек:**
- **NestJS** 10.3 — framework для Node.js
- **Prisma** 5.13 — ORM для роботи з базою даних
- **PostgreSQL** — реляційна база даних
- **Express** — HTTP сервер
- **Jest** — тестування
- **Class Validator** — валідація даних

### Основні модулі

- 👥 **Clients** — управління клієнтами
- 🏡 **Farms** — управління фермами та їх локаціями
- 🌾 **Parcels** — управління паралями з границями та зонами
- 📍 **Zones** — створення та управління зонами в паралях
- 📋 **Tasks** — управління завданнями та їх статусами
- 👨‍💼 **Users** — користувачі, ролі та дозволи
- 🏢 **Organisations** — управління організаціями
- 👫 **Teams** — управління командами та запрошеннями
- ⚙️ **Settings** — налаштування додатка та підписки

### Запуск Backend

#### Розробка

```bash
# Запуск в режимі розробки з auto-reload
npx nx dev backend

# або через npm
npm run start:dev --workspace=@agrosphere/backend
```

#### Продакшн

```bash
# Побудова
npm run build --workspace=@agrosphere/backend

# Запуск
npm run start:prod --workspace=@agrosphere/backend
```

### База даних

#### Налаштування Prisma

```bash
# Створити .env файл з DATABASE_URL
cp apps/backend/.env.example apps/backend/.env

# Запустити міграції
npx prisma migrate dev --schema=apps/backend/prisma/schema.prisma

# Переглянути дані в UI
npx prisma studio --schema=apps/backend/prisma/schema.prisma
```

#### Структура Prisma

Схема бази даних розташована в `apps/backend/prisma/schema.prisma`. Основні моделі:
- User
- Client
- Farm
- Parcel
- Zone
- Task
- Organisation
- Team

### API Endpoints

#### Клієнти
```
GET    /api/clients          - Отримати всіх клієнтів
GET    /api/clients/:id      - Отримати клієнта за ID
POST   /api/clients          - Створити клієнта
PUT    /api/clients/:id      - Оновити клієнта
DELETE /api/clients/:id      - Видалити клієнта
```

#### Ферми
```
GET    /api/farms            - Отримати всі ферми
GET    /api/farms/:id        - Отримати ферму за ID
POST   /api/farms            - Створити ферму
PUT    /api/farms/:id        - Оновити ферму
DELETE /api/farms/:id        - Видалити ферму
```

#### Парцели
```
GET    /api/parcels          - Отримати всі парцели
GET    /api/parcels/:id      - Отримати парцелю за ID
POST   /api/farms/:farmId/parcels                  - Створити парцелю
PUT    /api/farms/:farmId/parcels/:parcelId        - Оновити парцелю
DELETE /api/farms/:farmId/parcels/:parcelId        - Видалити парцелю
```

#### Завдання
```
GET    /api/tasks             - Отримати всі завдання
GET    /api/tasks/:id         - Отримати завдання за ID
POST   /api/tasks             - Створити завдання
PUT    /api/tasks/:id         - Оновити завдання
DELETE /api/tasks/:id         - Видалити завдання
GET    /api/tasks/per-status  - Отримати статистику по статусах
```

### Тестування Backend

```bash
# Unit тести
npm run test --workspace=@agrosphere/backend

# З покриттям
npm run test:cov --workspace=@agrosphere/backend

# У режимі спостереження
npm run test:watch --workspace=@agrosphere/backend
```

## 🔐 Налаштування Keycloak

### Запуск Keycloak локально

```bash
npx nx run-keycloak keycloakify-starter
```

### Storybook для компонентів Keycloak теми

```bash
npx nx storybook keycloakify-starter
```

### Побудова Keycloak JAR файлу

```bash
npx nx build-keycloak-theme keycloakify-starter
```

Згенеровані `.jar` файли знаходяться в `keycloakify-starter/dist_keycloak` і мають бути скопійовані до папки `providers` на сервері.

## 🛠️ Доступні команди

### Розробка всієї системи

```bash
# Запуск Frontend + Backend одночасно (потребує двох терміналів)
# Термінал 1:
npx nx dev agrosphere

# Термінал 2:
npx nx dev backend

# Запуск мобільного додатка
npx nx dev mobile

# Запуск Keycloak з аутентифікацією
npx nx run-keycloak keycloakify-starter
```

### Тестування

```bash
# Запуск всіх тестів
npx nx test

# Тести для конкретного додатка
npx nx test agrosphere
npx nx test backend

# Перевірка кодування (linting)
npx nx lint
```

### Сборка

```bash
# Продакшн сборка Frontend
npx nx build agrosphere

# Продакшн сборка Backend
npx nx build backend

# Побудова для Docker
npm run build

# Побудова Keycloak теми
npx nx build-keycloak-theme keycloakify-starter
```

### Утиліти Nx

```bash
# Показати граф всіх залежностей
npx nx graph

# Показати інформацію про проект
npx nx show project agrosphere

# Список встановлених плагінів Nx
npx nx list

# Запустити спеціалізовані команди для проекту
npx nx show project agrosphere --targets
```

### Prisma (для Backend)

```bash
# Створити нову міграцію
npx prisma migrate dev --name feature_name --schema=apps/backend/prisma/schema.prisma

# Переглянути дані через UI
npx prisma studio --schema=apps/backend/prisma/schema.prisma

# Генерувати Prisma Client
npx prisma generate --schema=apps/backend/prisma/schema.prisma
```

## 📦 Технологічний стек

### Frontend (AgroSphere)

| Технологія | Версія | Використання |
|----------|--------|-------------|
| **Next.js** | 15.2 | Framework для веб-додатка |
| **React** | 19 | UI бібліотека |
| **TypeScript** | 5.8 | Типізація JavaScript |
| **Tailwind CSS** | 3.4 | Утилітарний CSS фреймворк |
| **Material UI** | 7.2 | UI компоненти |
| **Mapbox GL** | 3.13 | Інтерактивні карти |

### Backend (NestJS API)

| Технологія | Версія | Використання |
|----------|--------|-------------|
| **NestJS** | 10.3 | Framework для Node.js |
| **Prisma** | 5.13 | ORM для бази даних |
| **PostgreSQL** | 14+ | Реляційна база даних |
| **Express** | (вл. NestJS) | HTTP сервер |
| **TypeScript** | 5.3 | Типізація |
| **Jest** | 29.7 | Тестування |

### Геопросторові бібліотеки

- **Turf.js** — географічні розрахунки та аналіз
- **Mapbox GL Draw** — малювання та редагування геометрії на карті
- **Mapbox GL Geocoder** — геокодування адрес

### Форми та валідація

- **React Hook Form** — управління формами
- **Zod** — валідація даних
- **Hookform Resolvers** — інтеграція з валідаторами

### Управління станом

- **Zustand** — простий state management
- **TanStack React Query** — управління асинхронними даними
- **TanStack React Table** — потужна таблиця даних

### Інші інструменти

- **Axios** — HTTP клієнт
- **React Toastify** — сповіщення та тости
- **Stripe** — обробка платежів
- **FullCalendar** — інтерактивний календар
- **NextAuth** — аутентифікація
- **Day.js** — робота з датами

### DevTools

- **Storybook** 8.6 — розробка компонентів в ізоляції
- **Jest** — unit-тестування
- **Nx** — управління monorepo
- **ESLint** — перевірка коду
- **Prettier** — форматування коду
- **SWC** — швидка компіляція TypeScript

## 🌐 Конфігурація середовища

### Frontend (.env.local)

Створіть файл `.env.local` в папці `apps/agrosphere`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Keycloak
KEYCLOAK_CLIENT_ID=your-client-id
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ISSUER=http://localhost:8080/auth/realms/your-realm

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# API
NEXT_PUBLIC_API_URL=http://localhost:4000
API_SECRET=your-api-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-pk
STRIPE_SECRET_KEY=your-stripe-sk
```

### Backend (.env)

Створіть файл `.env` в папці `apps/backend`:

```env
# База даних
DATABASE_URL=postgresql://user:password@localhost:5432/agrosphere_db

# Порт сервера
PORT=4000

# Середовище
NODE_ENV=development

# Keycloak (для аутентифікації)
KEYCLOAK_ISSUER=http://localhost:8080/auth/realms/your-realm
KEYCLOAK_CLIENT_ID=backend-client
KEYCLOAK_CLIENT_SECRET=your-client-secret

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=24h

# Stripe (опціонально)
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Запуск с Docker Compose

Створіть `docker-compose.yml` для локальної розробки:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: agrosphere_db
      POSTGRES_USER: agrosphere_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Запуск:
```bash
docker-compose up -d
```

## 📁 Головні директорії

```
apps/agrosphere/src/
├── app/              # Next.js додаток
├── api/              # API інтеграції
├── components/       # React компоненти
├── lib/              # Утиліти та хелпери
├── hooks/            # Custom React hooks
├── store/            # Zustand store
└── styles/           # CSS та Tailwind

libs/shared/src/
├── components/       # Спільні компоненти
├── utils/            # Утиліти
├── types/            # TypeScript типи
└── hooks/            # Спільні hooks
```

## 🧪 Тестування

### Запуск тестів

```bash
# Тести для конкретного проекту
npx nx test agrosphere

# Всі тести
npx nx test

# З покриттям
npx nx test --coverage
```

## 🐳 Docker (для виробництва)

### Побудова Docker образу

```bash
docker build -t agrosphere:latest .
```

### Запуск контейнера

```bash
docker compose up -d
```

## 🎯 Локальна розробка повної системи

### Крок 1: Налаштування Бази Даних

```bash
# Запустити PostgreSQL через Docker
docker-compose up -d

# Виконати міграції Prisma
npx prisma migrate dev --schema=apps/backend/prisma/schema.prisma

# (Опціонально) Переглянути дані через UI
npx prisma studio --schema=apps/backend/prisma/schema.prisma
```

### Крок 2: Запуск Backend (API)

```bash
# Термінал 1
cd apps/backend
npm run start:dev

# Сервер буде доступний на: http://localhost:4000
# Swagger документація: http://localhost:4000/api/docs (якщо налаштована)
```

### Крок 3: Запуск Frontend (Web App)

```bash
# Термінал 2
cd apps/agrosphere
npm run dev

# Додаток буде доступний на: http://localhost:3000
```

### Крок 4: Налаштування Аутентифікації (Опціонально)

```bash
# Термінал 3
npx nx run-keycloak keycloakify-starter

# Keycloak буде доступний на: http://localhost:8080
```

### Перевірка статусу системи

```bash
# Перевірити, що Frontend працює
curl http://localhost:3000

# Перевірити, що Backend працює
curl http://localhost:4000/health

# Перевірити підключення до БД
curl http://localhost:4000/api/farms
```

## 🤝 Система авторизації

Проект використовує **NextAuth.js** з **Keycloak** для управління доступом:

- OAuth2 аутентифікація
- Ролі та дозволи користувачів
- JWT токени
- Сесійне управління

Більше деталей у `keycloakify-starter` додатку.

### Архітектура аутентифікації

```
Frontend (NextAuth)
        ↓
   Keycloak (Auth Server)
        ↓
   Backend API (Protected Routes)
        ↓
   PostgreSQL (User Data)
```

## 📊 Монітринг та аналітика

Проект підтримує інтеграцію з:

- **Chromatic** — для управління UI компонентами
- **Stripe Dashboard** — для аналізу платежів

## 🔗 Корисні посилання

- 📖 [Nx документація](https://nx.dev)
- 🗺️ [Mapbox GL документація](https://docs.mapbox.com/mapbox-gl-js/)
- 🌍 [Turf.js документація](https://turfjs.org/)
- 🎨 [Material UI документація](https://mui.com/)
- 📅 [FullCalendar документація](https://fullcalendar.io/)

## 🔄 Щоденна розробка

### Структура файлів для добавлення нової функції

**Backend (NestJS):**
```
apps/backend/src/modules/
└── my-feature/
    ├── my-feature.controller.ts      # HTTP endpoints
    ├── my-feature.service.ts         # Business logic
    ├── my-feature.module.ts          # Module definition
    ├── dto/
    │   ├── create-my-feature.dto.ts
    │   └── update-my-feature.dto.ts
    └── entities/
        └── my-feature.entity.ts       # Prisma model
```

**Frontend (Next.js + React):**
```
apps/agrosphere/src/
├── app/
│   └── my-feature/              # Pages
│       ├── page.tsx
│       └── layout.tsx
├── components/
│   └── MyFeature/                # Components
│       ├── MyFeatureForm.tsx
│       └── MyFeatureList.tsx
├── hooks/
│   └── useMyFeature.ts           # Custom hooks
└── api/
    └── services/
        └── myFeatureService.ts   # API calls
```

### Роботи з Git та PR

```bash
# Створити нову гілку для функції
git checkout -b feat/my-new-feature

# Після завершення роботи - commit та push
git add .
git commit -m "feat: add new feature description"
git push origin feat/my-new-feature

# Створити Pull Request в GitHub
```

### Перевірка якості коду

```bash
# Lint та fix проблеми
npx nx lint agrosphere --fix
npx nx lint backend --fix

# Форматування коду через Prettier
npm run format

# Запустити тести перед commit'ом
npx nx test agrosphere
npx nx test backend
```

## 🐛 Налагодження (Debug)

### Frontend Debug

```bash
# Запустити Next.js з дебаг режимом
NODE_OPTIONS='--inspect' npx nx dev agrosphere

# Відкрити Chrome DevTools на chrome://inspect
```

### Backend Debug

```bash
# Запустити NestJS з дебаг режимом
npm run start:debug --workspace=@agrosphere/backend

# Підключитися до дебагера в VS Code
# Додайте в .vscode/launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Attach Backend",
  "port": 9229,
  "restart": true,
  "protocol": "inspector"
}
```

### Логування

**Backend:**
```typescript
// У NestJS сервісах
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  myMethod() {
    this.logger.log('Something happened');
    this.logger.error('An error occurred');
  }
}
```

**Frontend:**
```typescript
// У React компонентах
console.log('Debug info:', data);
console.error('Error:', error);
```

## 📝 Ліцензія

MIT

## 👤 Автор

Розроблено **Andriy-sh**

## 📞 Контакти та підтримка

Для питань та пропозицій зв'яжіться через:
- GitHub Issues
- Email: [support@agrosphere.dev]

---

**Last Updated:** 2026-05-24

## 🚀 Наступні кроки

- [ ] Налаштувати CI/CD pipeline
- [ ] Додати інтеграційні тести
- [ ] Налаштувати моніторинг та логування
- [ ] Документувати API через Swagger
- [ ] Налаштувати автоматичні розгортання


