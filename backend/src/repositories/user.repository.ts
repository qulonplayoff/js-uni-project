// src/repositories/user.repository.ts

import { User, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
// Імпортуємо генератор унікальних айдішників (ми його ставили в терміналі)
import { v4 as uuidv4 } from 'uuid';

// Наша імпровізована база даних (просто масив у пам'яті сервера)
let users: User[] = [];

export class UserRepository {

    // Повернути всіх користувачів
    getAll(): User[] {
        return users;
    }

    // Знайти одного за ID
    getById(id: string): User | undefined {
        return users.find(user => user.id === id);
    }

    // Створити нового
    create(dto: CreateUserDto): User {
        const newUser: User = {
            id: uuidv4(), // генеруємо складний унікальний рядок типу "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
            name: dto.name,
            email: dto.email
        };
        users.push(newUser); // закидаємо в масив
        return newUser;
    }

    // Оновити існуючого
    update(id: string, dto: UpdateUserDto): User | undefined {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return undefined; // Якщо не знайшли - повертаємо пустоту

        // Беремо старого юзера і "зверху" накладаємо нові дані (...dto)
        users[index] = { ...users[index], ...dto };
        return users[index];
    }

    // Видалити
    delete(id: string): boolean {
        const initialLength = users.length;
        // Фільтруємо масив: залишаємо всіх, крім того, кого треба видалити
        users = users.filter(user => user.id !== id);
        // Якщо довжина масиву змінилася - значить успішно видалили
        return users.length !== initialLength;
    }
}

// Експортуємо готовий об'єкт репозиторію, щоб інші файли могли ним користуватись
export const userRepository = new UserRepository();