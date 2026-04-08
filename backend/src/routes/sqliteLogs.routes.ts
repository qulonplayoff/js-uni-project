import { Router, Request, Response, NextFunction } from "express";
import { getLogsWithDetails, getSystemStats, searchDevicesUnsafe, addLog } from "../repositories/sqliteLogs.repository";

export const sqliteLogsRouter = Router();

// 1. Отримати красиву історію видачі (JOIN)
// Шлях: GET /api/sqlite/logs/history
sqliteLogsRouter.get("/history", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const history = await getLogsWithDetails();
        res.json({ data: history });
    } catch (err) {
        next(err);
    }
});

// 2. Отримати статистику (COUNT)
// Шлях: GET /api/sqlite/logs/stats
sqliteLogsRouter.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await getSystemStats();
        res.json({ data: stats });
    } catch (err) {
        next(err);
    }
});

// 3. Пошук із діркою для SQL-ін'єкції
// Шлях: GET /api/sqlite/logs/search-unsafe?q=Іван
sqliteLogsRouter.get("/search-unsafe", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Беремо слово для пошуку з URL (те що після ?q=)
        const query = req.query.q as string || "";

        // Відправляємо у нашу вразливу функцію
        const results = await searchDevicesUnsafe(query);
        res.json({ data: results });
    } catch (err) {
        next(err);
    }
});

// 4. Додати запис про видачу/повернення флешки
// Шлях: POST /api/sqlite/logs
sqliteLogsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, deviceId, action } = req.body;

        // Перевіряємо, чи клієнт передав усі необхідні дані
        if (!userId || !deviceId || !action) {
            return res.status(400).json({ error: "Передайте userId, deviceId та action (Взяв/Повернув)" });
        }

        const newLog = await addLog(userId, deviceId, action);
        res.status(201).json({ data: newLog });
    } catch (err) {
        // Якщо передали ID юзера, якого не існує (спрацює FOREIGN KEY з бази)
        next(err);
    }
});