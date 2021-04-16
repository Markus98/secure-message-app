const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

//controller for router for interacting with database
let messageRoute = require("./controllers/messages");
app.use(cors());
app.use(express.json());

app.use('/api',messageRoute);
// For hosting the built frontend
app.use(express.static("build"));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});