
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { userRouter } from "./routes/user.routes";
import { migrate } from "./db/migrate";
import { sqliteDeviceRouter } from "./routes/sqliteDevice.routes";
import { sqliteUserRouter } from "./routes/sqliteUser.routes";
import { sqliteLogsRouter } from "./routes/sqliteLogs.routes";


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/api/sqlite/users", sqliteUserRouter);
app.use("/api/sqlite/devices", sqliteDeviceRouter);
app.use("/api/sqlite/logs", sqliteLogsRouter);
// МІДЛВАР ЛОГУВАННЯ

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

//  ПІДКЛЮЧЕННЯ НАШИХ МАРШРУТІВ

app.use("/api/users", userRouter);

// ЦЕНТРАЛІЗОВАНИЙ ОБРОБНИК ПОМИЛОК
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Неочікувана помилка:", err);
    res.status(500).json({
        error: { code: "SERVER_ERROR", message: "Внутрішня помилка сервера" }
    });
});

// ТУТ ДОДАЙ ІМПОРТ ЗГОРУ ФАЙЛУ:
// import { migrate } from "./db/migrate";

// А ЦЕ ВСТАВ У САМИЙ НИЗ ЗАМІСТЬ app.listen:
async function bootstrap() {
    try {
        // Спочатку піднімаємо базу даних і таблиці
        await migrate();

        // І тільки після цього запускаємо сервер приймати запити
        app.listen(PORT, () => {
            console.log(`Сервер запущено на http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Фатальна помилка при запуску:", err);
        process.exit(1);
    }
}

bootstrap();