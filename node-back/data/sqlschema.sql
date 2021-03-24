-- Table: messages
CREATE TABLE messages (
    url_hash TEXT PRIMARY KEY UNIQUE NOT NULL, 
    message_cipher TEXT NOT NULL, 
    password_hash TEXT,
    salt TEXT,
    timestamp REAL NOT NULL,
    lifetime REAL,
    times_read REAL DEFAULT 0 NOT NULL,
    read_limit REAL
);