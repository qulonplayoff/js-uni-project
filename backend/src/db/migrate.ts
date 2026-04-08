import fs from "fs";
import path from "path";
import { run, all } from "./dbClient";

type MigrationRow = { filename: string };

export async function migrate(): Promise<void> {
    // Вмикаємо підтримку зовнішніх ключів (вимога методички)
    await run("PRAGMA foreign_keys = ON;");

    // Створюємо службову таблицю для фіксації міграцій
    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            filename TEXT NOT NULL UNIQUE,
            appliedAt TEXT NOT NULL
        );
    `);

    const migrationsDir = path.join(__dirname, "migrations");

    // Читаємо всі файли з папки migrations і сортуємо їх
    const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => /^\d+_.+\.sql$/.test(f))
        .sort();

    // Дізнаємося, які міграції вже були виконані
    const applied = await all<MigrationRow>(`SELECT filename FROM schema_migrations;`);
    const appliedSet = new Set(applied.map((x) => x.filename));

    for (const file of files) {
        // Якщо міграція вже була — пропускаємо її
        if (appliedSet.has(file)) continue;

        const fullPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(fullPath, "utf8").trim();
        if (!sql) continue;

        // Виконуємо SQL-запит
        await run(sql);

        const now = new Date().toISOString();
        // Записуємо в таблицю, що ця міграція успішно виконана
        await run(`
            INSERT INTO schema_migrations (filename, appliedAt)
            VALUES ('${file}', '${now}');
        `);

        console.log(`Міграцію застосовано: ${file}`);
    }
    console.log("Перевірка міграцій завершена.");
}