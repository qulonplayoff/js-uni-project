const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./simple_app.db');
console.log("Db connected!");

db.serialize(() =>{
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT
    )`);

    db.run("INSERT INTO users (name, role) VALUES ('Max', 'Frontend'), ('Anna', 'Backend')")
    console.log("Add new employers")

    db.run("UPDATE users SET role = 'fullstack' WHERE name = 'Max'")
    console.log("Max larned node.js and became fullstack")

    db.run("DELETE FROM users WHERE name = 'Anna'")
    console.log("Deleted employee")

    db.all("SELECT * FROM users", (err, rows) => {
        console.log("All employees");

        rows.forEach(row => {
            console.log(`ID: ${row.id} | name: ${row.name} | role: ${row.role}`);
        });
    });
});

db.close();