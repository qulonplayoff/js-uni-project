// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
// Імпортуємо наші маршрути користувачів
import { userRouter } from "./routes/user.routes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// --- МІДЛВАР ЛОГУВАННЯ (Обов'язкова вимога лаби) ---
// Ця штука буде писати в консоль кожен запит, який приходить на сервер
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
        const ms = Date.now() - start;
        console.log(`[LOG] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
});

// Тестовий роут
app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "OK", message: "Бекенд працює!" });
});

// --- ПІДКЛЮЧЕННЯ НАШИХ МАРШРУТІВ ---
// Кажемо серверу: всі запити, які починаються на /api/users, передавай у userRouter
app.use("/api/users", userRouter);

// --- ЦЕНТРАЛІЗОВАНИЙ ОБРОБНИК ПОМИЛОК (Обов'язкова вимога) ---
// Має бути обов'язково в самому кінці файлу!
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Неочікувана помилка:", err);
    res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Внутрішня помилка сервера" }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});