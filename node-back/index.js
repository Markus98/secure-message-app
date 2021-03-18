const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
//controller for router for interacting with database
let messageRoute = require("./controllers/messages");
app.use(cors());
app.use(express.json());
//notice its localhost/api
app.use('/api',messageRoute);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});