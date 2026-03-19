// src/dtos/user.dto.ts

// Це головна модель: так користувач виглядає у нашій базі (з айдішником)
export interface User {
    id: string;
    name: string;
    email: string;
}

// Це DTO для СТВОРЕННЯ: коли юзер реєструється, він ще не має ID, тому тут його немає
export interface CreateUserDto {
    name: string;
    email: string;
}

// Це DTO для ОНОВЛЕННЯ: знак питання (?) означає, що поле необов'язкове.
// Можна змінити тільки ім'я, або тільки імейл.
export interface UpdateUserDto {
    name?: string;
    email?: string;
}