import { Router, Request, Response, NextFunction } from "express";
import { getAllSqliteUsers, getSqliteUserById, createSqliteUser } from "../repositories/sqliteUser.repository";


export const sqliteUserRouter = Router();

// 1. Отримати всіх користувачів
sqliteUserRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllSqliteUsers();
        res.json({ data: users });
    } catch (err) {
        next(err); // Передаємо помилку в глобальний обробник
    }
});

// 2. Отримати користувача за ID
sqliteUserRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getSqliteUserById(req.params.id);

        // Якщо база повернула undefined — значить такого юзера нема
        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }
        res.json({ data: user });
    } catch (err) {
        next(err);
    }
});

// 3. Створити нового користувача
sqliteUserRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = req.body;

        // Перевірка (валідація), щоб клієнт обов'язково передав дані
        if (!email || !name) {
            return res.status(400).json({ error: "Поля email та name є обов'язковими" });
        }

        const createdUser = await createSqliteUser(email, name);
        res.status(201).json({ data: createdUser });

    } catch (err: any) {
        // Якщо база каже, що такий email вже є (помилка UNIQUE)
        if (err.message && err.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Користувач з таким email вже існує" });
        }
        next(err);
    }
});