import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const deviceRouter = Router();

// бд
let devices: any[] = [];

// Отримати всі пристрої
deviceRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json(devices);
});

// 2. Отримати один
deviceRouter.get('/:id', (req: Request, res: Response) => {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
        return res.status(404).json({ message: "Пристрій не знайдено" });
    }
    res.status(200).json(device);
});

// Створити новий + проста валідація
deviceRouter.post('/', (req: Request, res: Response) => {
    const { serial, type, owner, status } = req.body;

    // Базова перевірка (задовільно)
    if (!serial || !type) {
        return res.status(400).json({
            error: "Помилка валідації",
            message: "Серійний номер та тип є обов'язковими"
        });
    }

    const newDevice = {
        id: uuidv4(),
        serial,
        type,
        owner: owner || "Невідомо",
        status: status || "Вільно"
    };

    devices.push(newDevice);
    res.status(201).json(newDevice);
});

// Оновити
deviceRouter.put('/:id', (req: Request, res: Response) => {
    const index = devices.findIndex(d => d.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Пристрій не знайдено" });
    }

    devices[index] = { ...devices[index], ...req.body };
    res.status(200).json(devices[index]);
});

//Видалити
deviceRouter.delete('/:id', (req: Request, res: Response) => {
    const initialLength = devices.length;
    devices = devices.filter(d => d.id !== req.params.id);

    if (devices.length === initialLength) {
        return res.status(404).json({ message: "Пристрій не знайдено" });
    }

    res.status(204).send();
});