CREATE TABLE IF NOT EXISTS Devices (
                                       id INTEGER PRIMARY KEY,
                                       serial TEXT NOT NULL UNIQUE,
                                       type TEXT NOT NULL,
                                       owner TEXT NOT NULL,
                                       status TEXT NOT NULL,
                                       createdAt TEXT NOT NULL
);