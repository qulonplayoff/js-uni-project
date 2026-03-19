import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const deviceRouter = Router();

// Наша база даних (просто масив у цьому ж файлі)
let devices: any[] = [];

// 1. Отримати всі пристрої (GET)
deviceRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json(devices);
});

// 2. Отримати один за ID (GET)
deviceRouter.get('/:id', (req: Request, res: Response) => {
    const device = devices.find(d => d.id === req.params.id);
    if (!device) {
        return res.status(404).json({ message: "Пристрій не знайдено" });
    }
    res.status(200).json(device);
});

// 3. Створити новий (POST) - з простою валідацією
deviceRouter.post('/', (req: Request, res: Response) => {
    const { serial, type, owner, status } = req.body;

    // Базова перевірка (вимога для задовільно)
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

// 4. Оновити (PUT)
deviceRouter.put('/:id', (req: Request, res: Response) => {
    const index = devices.findIndex(d => d.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: "Пристрій не знайдено" });
    }

    devices[index] = { ...devices[index], ...req.body };
    res.status(200).json(devices[index]);
});

// 5. Видалити (DELETE)
deviceRouter.delete('/:id', (req: Request, res: Response) => {
    const initialLength = devices.length;
    devices = devices.filter(d => d.id !== req.params.id);

    if (devices.length === initialLength) {
        return res.status(404).json({ message: "Пристрій не знайдено" });
    }

    res.status(204).send();
});