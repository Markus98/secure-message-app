--
-- File generated with SQLiteStudio v3.2.1 on ke maalis 24 14:46:16 2021
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: messages
CREATE TABLE messages (url STRING PRIMARY KEY UNIQUE NOT NULL, message STRING NOT NULL, password STRING);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
