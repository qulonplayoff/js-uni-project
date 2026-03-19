// src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';

export const userRouter = Router();

// Прив'язуємо методи НТТР до функцій нашого контролера
userRouter.get('/', userController.getAll);           // Отримати всіх
userRouter.get('/:id', userController.getById);       // Отримати одного
userRouter.post('/', userController.create);          // Створити
userRouter.put('/:id', userController.update);        // Оновити
userRouter.delete('/:id', userController.delete);     // Видалити