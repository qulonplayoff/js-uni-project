# Лабораторна робота №3 - Інтеграція SQLite
**Виконав:** Шеремета Назар, група кб-11
**Варіант:** 15 (Інвентаризація носіїв інформації)

## Як запустити локально:
1. Відкрити термінал у папці `backend`.
2. Встановити залежності командою: `npm i`
3. Запустити сервер у режимі розробки: `npm run dev`
4. Сервер працюватиме за адресою: `http://localhost:3000`

*Примітка: База даних (`app.db`) та всі таблиці створюються автоматично при запуску сервера завдяки написаному механізму міграцій.*

## Схема бази даних (Реалізовані сутності):
База складається з 3-х таблиць. Увімкнено підтримку зовнішніх ключів (`PRAGMA foreign_keys = ON;`).

**1. Users (`/api/sqlite/users`) - Користувачі**
- `id` (INTEGER PRIMARY KEY)
- `email` (TEXT NOT NULL UNIQUE)
- `name` (TEXT NOT NULL)
- `createdAt` (TEXT NOT NULL)

**2. Devices (`/api/sqlite/devices`) - Носії інформації**
- `id` (INTEGER PRIMARY KEY)
- `serial` (TEXT NOT NULL UNIQUE)
- `type` (TEXT NOT NULL)
- `owner` (TEXT NOT NULL)
- `status` (TEXT NOT NULL)
- `createdAt` (TEXT NOT NULL)

**3. DeviceLogs (`/api/sqlite/logs`) - Журнал видачі (Зв'язкова таблиця)**
- `id` (INTEGER PRIMARY KEY)
- `deviceId` (INTEGER NOT NULL, FK -> Devices.id ON DELETE CASCADE)
- `userId` (INTEGER NOT NULL, FK -> Users.id ON DELETE CASCADE)
- `action` (TEXT NOT NULL CHECK (action IN ('Взяв', 'Повернув'))) - *Обмеження цілісності*
- `createdAt` (TEXT NOT NULL)

## Фічі на оцінку "Відмінно":
- **Міграції:** Автоматичне створення таблиць з SQL-файлів (папка `migrations`) при старті сервера.
- **З'єднання таблиць (JOIN):** Ендпойнт `GET /api/sqlite/logs/history` повертає об'єднані дані з іменами користувачів та серійниками флешок.
- **Агрегація (COUNT):** Ендпойнт `GET /api/sqlite/logs/stats` повертає загальну статистику системи (кількість записів).

## Демонстрація вразливості (SQL Injection)
У проекті навмисно реалізовано вразливий ендпойнт `GET /api/sqlite/logs/search-unsafe?q=...`

Якщо передати параметр `?q=' OR 1=1 --`, умова пошуку ламається (штучно стає завжди істинною), і база повертає всі існуючі записи, ігноруючи пошуковий фільтр. Це демонструє небезпеку звичайної конкатенації рядків у SQL-запитах.