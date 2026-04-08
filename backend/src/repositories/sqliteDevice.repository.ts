import { all, get, run } from "../db/dbClient";

function escapeSqlString(s: string): string {
    return String(s).replace(/'/g, "''");
}

export async function getAllSqliteDevices() {
    return await all(`SELECT * FROM Devices ORDER BY id DESC;`);
}

export async function getSqliteDeviceById(id: number | string) {
    return await get(`SELECT * FROM Devices WHERE id = ${Number(id)};`);
}

export async function createSqliteDevice(serial: string, type: string, owner: string, status: string) {
    const safeSerial = escapeSqlString(serial);
    const safeType = escapeSqlString(type);
    const safeOwner = escapeSqlString(owner);
    const safeStatus = escapeSqlString(status);
    const now = new Date().toISOString();

    const sql = `
        INSERT INTO Devices (serial, type, owner, status, createdAt)
        VALUES ('${safeSerial}', '${safeType}', '${safeOwner}', '${safeStatus}', '${now}');
    `;

    const result = await run(sql);
    return await getSqliteDeviceById(result.lastID);
}