import { all, get, run } from "../db/dbClient";

// Функція для екранування апострофів (захист від помилок синтаксису)
function escapeSqlString(s: string): string {
    return String(s).replace(/'/g, "''");
}

export async function getAllSqliteUsers() {
    return await all(`SELECT id, email, name, createdAt FROM Users ORDER BY id DESC;`);
}

export async function getSqliteUserById(id: number | string) {
    const userId = Number(id);
    return await get(`SELECT id, email, name, createdAt FROM Users WHERE id = ${userId};`);
}

export async function createSqliteUser(email: string, name: string) {
    const safeEmail = escapeSqlString(email);
    const safeName = escapeSqlString(name);
    const now = new Date().toISOString();

    const sql = `
        INSERT INTO Users (email, name, createdAt)
        VALUES ('${safeEmail}', '${safeName}', '${now}');
    `;

    const result = await run(sql);
    return await getSqliteUserById(result.lastID);
}