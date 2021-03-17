const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
//controller for router for interacting with database
let messageRoute = require("./controllers/messages")

app.use(express.json())
//notice its localhost/api
app.use('/api',messageRoute);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});