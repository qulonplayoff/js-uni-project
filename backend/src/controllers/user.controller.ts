// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export class UserController {

    // Отримати всіх (GET)
    getAll(req: Request, res: Response) {
        const users = userService.getAllUsers();
        res.status(200).json(users); // 200 OK
    }

    // Отримати одного за ID (GET)
    getById(req: Request, res: Response) {
        try {
            // ДОДАЛИ "as string", щоб TypeScript заспокоївся
            const id = req.params.id as string;
            const user = userService.getUserById(id);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    // Створити нового (POST)
    create(req: Request, res: Response) {
        try {
            const dto = req.body;
            const newUser = userService.createUser(dto);
            res.status(201).json(newUser);
        } catch (error: any) {
            res.status(400).json({ error: "Помилка валідації", message: error.message });
        }
    }

    // Оновити (PUT)
    update(req: Request, res: Response) {
        try {
            // ДОДАЛИ "as string"
            const id = req.params.id as string;
            const dto = req.body;
            const updatedUser = userService.updateUser(id, dto);
            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    // Видалити (DELETE)
    delete(req: Request, res: Response) {
        try {
            // ДОДАЛИ "as string"
            const id = req.params.id as string;
            userService.deleteUser(id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export const userController = new UserController();