

import { userRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, User } from '../dtos/user.dto';

export class UserService {

    // Просимо репозиторій віддати всіх юзерів
    getAllUsers(): User[] {
        return userRepository.getAll();
    }

    // Шукаємо одного.404
    getUserById(id: string): User {
        const user = userRepository.getById(id);
        if (!user) {
            throw new Error("404: Користувача не знайдено");
        }
        return user;
    }

    // Новий юз + реалізація валідації (відмінно)
    createUser(dto: CreateUserDto): User {
        // Перевіряємо, чи є ім'я і чи воно не порожнє
        if (!dto.name || dto.name.trim().length < 2) {
            throw new Error("400: Ім'я обов'язкове і має містити мінімум 2 символи");
        }
        // Проста перевірка на наявність "равлика" в email
        if (!dto.email || !dto.email.includes("@")) {
            throw new Error("400: Некоректний email");
        }

        // Якщо перевірки пройдені, передаємо дані в репозиторій
        return userRepository.create(dto);
    }

    // апдейт
    updateUser(id: string, dto: UpdateUserDto): User {
        const updatedUser = userRepository.update(id, dto);
        if (!updatedUser) {
            throw new Error("404: Користувача не знайдено для оновлення");
        }
        return updatedUser;
    }


    deleteUser(id: string): void {
        const isDeleted = userRepository.delete(id);
        if (!isDeleted) {
            throw new Error("404: Користувача не знайдено для видалення");
        }
    }
}

export const userService = new UserService();