import { Router, Request, Response, NextFunction } from "express";
import { getAllSqliteDevices, getSqliteDeviceById, createSqliteDevice } from "../repositories/sqliteDevice.repository";

export const sqliteDeviceRouter = Router();

sqliteDeviceRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = await getAllSqliteDevices();
        res.json({ data: devices });
    } catch (err) {
        next(err);
    }
});

sqliteDeviceRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const device = await getSqliteDeviceById(req.params.id);
        if (!device) {
            return res.status(404).json({ error: "Флешку не знайдено" });
        }
        res.json({ data: device });
    } catch (err) {
        next(err);
    }
});

sqliteDeviceRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serial, type, owner, status } = req.body;

        if (!serial || !type) {
            return res.status(400).json({ error: "Поля serial та type є обов'язковими" });
        }

        const createdDevice = await createSqliteDevice(serial, type, owner || "Невідомо", status || "Вільно");
        res.status(201).json({ data: createdDevice });

    } catch (err: any) {
        if (err.message && err.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Флешка з таким серійним номером вже існує" });
        }
        next(err);
    }
});