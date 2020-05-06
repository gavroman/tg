const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const http = require('http');

const distFolder = path.resolve(__dirname, '../', '../', 'dist');
const imgFolder = path.resolve(__dirname, '../', '../', 'img');
app.use(express.static(distFolder));
app.use(express.static(imgFolder));
app.use(morgan('dev'));


app.get('*', (req, res) => {
    res.sendFile(path.resolve(distFolder, 'index.html'));
});

const httpServer = http.createServer(app);
httpServer.listen(1818, () => console.log(`HTTP server started`));

