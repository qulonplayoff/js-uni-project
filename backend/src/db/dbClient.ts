import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import {exists, existsSync} from "node:fs";

sqlite3.verbose();

// Створюємо папку data в корені проекту, якщо її немає
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'app.db');

// Відкриваємо (або створюємо) файл бази даних
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Помилка підключення до SQLite:', err.message);
        process.exit(1);
    }
    console.log(`✅ SQLite підключено: ${dbPath}`);
});

// Функція для отримання МАСИВУ рядків (SELECT)
export function all<T>(sql: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else resolve(rows as T[]);
        });
    });
}

// Функція для отримання ОДНОГО рядка (SELECT WHERE id = ...)
export function get<T>(sql: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) reject(err);
            else resolve(row as T);
        });
    });
}

// Функція для виконання запитів (INSERT, UPDATE, DELETE, CREATE TABLE)
export function run(sql: string): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
        db.run(sql, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}