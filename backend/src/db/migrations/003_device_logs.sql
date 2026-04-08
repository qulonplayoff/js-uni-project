CREATE TABLE IF NOT EXISTS DeviceLogs (
                                          id INTEGER PRIMARY KEY,
                                          deviceId INTEGER NOT NULL,
                                          userId INTEGER NOT NULL,
                                          action TEXT NOT NULL CHECK (action IN ('Взяв', 'Повернув')),
    createdAt TEXT NOT NULL,
    FOREIGN KEY (deviceId) REFERENCES Devices (id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users (id) ON DELETE CASCADE
    );