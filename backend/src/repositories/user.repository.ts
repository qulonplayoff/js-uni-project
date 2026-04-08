

import { User, CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
// Імпортуємо генератор унікальних айдішників
import { v4 as uuidv4 } from 'uuid';

// імпровізована бд
let users: User[] = [];

export class UserRepository {

    // Повернути юзи
    getAll(): User[] {
        return users;
    }

    // Знайти одного юза
    getById(id: string): User | undefined {
        return users.find(user => user.id === id);
    }

    // Створити нового юза
    create(dto: CreateUserDto): User {
        const newUser: User = {
            id: uuidv4(), // генеруємо складний унікальний рядок типу "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
            name: dto.name,
            email: dto.email
        };
        users.push(newUser); // закидаємо в масив
        return newUser;
    }

    // Оновити існуючого юза
    update(id: string, dto: UpdateUserDto): User | undefined {
        const index = users.findIndex(user => user.id === id);
        if (index === -1) return undefined; // Якщо не знайшли - повертаємо пустоту

        // додавання нових данних до старого юзера через дто
        users[index] = { ...users[index], ...dto };
        return users[index];
    }

    delete(id: string): boolean {
        const initialLength = users.length;
        // Фільтруємо масив: залишаємо всіх, крім того, кого треба видалити
        users = users.filter(user => user.id !== id);
        // Якщо довжина масиву змінилася - значить успішно видалили
        return users.length !== initialLength;
    }
}

// експорт обєкту
export const userRepository = new UserRepository();