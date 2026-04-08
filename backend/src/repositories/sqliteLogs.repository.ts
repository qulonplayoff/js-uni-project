import { all, get, run } from "../db/dbClient";

// --- ФІЧА 1: JOIN (З'ЄДНАННЯ ТАБЛИЦЬ) ---
// Замість того щоб показувати сухі цифри (userId: 1, deviceId: 2),
// ми просимо базу саму підставити Імена користувачів і Серійники флешок.
export async function getLogsWithDetails() {
    const sql = `
        SELECT 
            DeviceLogs.id,
            DeviceLogs.action,
            DeviceLogs.createdAt,
            Users.name AS userName,          -- Беремо ім'я з таблиці Users
            Devices.serial AS deviceSerial   -- Беремо серійник з таблиці Devices
        FROM DeviceLogs
        JOIN Users ON DeviceLogs.userId = Users.id       -- Зв'язуємо по ID юзера
        JOIN Devices ON DeviceLogs.deviceId = Devices.id -- Зв'язуємо по ID флешки
        ORDER BY DeviceLogs.id DESC;
    `;
    return await all(sql);
}

// --- ФІЧА 2: АГРЕГАЦІЯ (COUNT) ---
// Просимо базу даних саму порахувати, скільки в нас всього записів.
export async function getSystemStats() {
    // COUNT(*) рахує кількість рядків у таблиці
    const usersCount = await get(`SELECT COUNT(*) as total FROM Users;`);
    const devicesCount = await get(`SELECT COUNT(*) as total FROM Devices;`);

    // Повертаємо об'єкт із готовими цифрами
    return {
        totalUsers: (usersCount as any)?.total || 0,
        totalDevices: (devicesCount as any)?.total || 0
    };
}

// --- ФІЧА 3: ВРАЗЛИВІСТЬ ДО SQL ІН'ЄКЦІЇ ---
// УВАГА: Це спеціально "поганий" код для захисту перед викладачем.
// Ми беремо текст від клієнта і тупо клеїмо його в SQL-запит без перевірок.
export async function searchDevicesUnsafe(searchQuery: string) {
    // Якщо хакер введе замість імені рядок: ' OR 1=1 --
    // Запит перетвориться на: SELECT * FROM Devices WHERE owner LIKE '%' OR 1=1 --%';
    // І база віддасть взагалі всі дані, бо 1=1 це завжди правда.
    const sql = `SELECT * FROM Devices WHERE owner LIKE '%${searchQuery}%';`;

    // Виводимо в консоль, щоб на захисті показати викладачу, як ламається запит
    console.log("⚠️ НЕБЕЗПЕЧНИЙ ЗАПИТ:", sql);

    return await all(sql);
}

// Стандартне створення запису в журнал (хто яку флешку взяв/повернув)
export async function addLog(userId: number, deviceId: number, action: string) {
    const now = new Date().toISOString();
    const sql = `
        INSERT INTO DeviceLogs (userId, deviceId, action, createdAt)
        VALUES (${userId}, ${deviceId}, '${action}', '${now}');
    `;
    const result = await run(sql);
    return { id: result.lastID, userId, deviceId, action, createdAt: now };
}