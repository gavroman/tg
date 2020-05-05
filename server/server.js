const http = require('http');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Handlers = require('./handlers.js');

app.use(morgan('dev'));
const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3333',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser('secretsecrethfb4234cjkasdhnkeadsa'));
app.disable('x-powered-by');

const storage = {
    users: new Map([
        ['4taa', '1'],
        ['gavroman', '1'],
        ['gromofon', '1'],
        ['gromogon', '1'],
        ['garvroar', '1'],
        ['qwezxc', '1'],
        ['asdzxc', '1'],
        ['zxczxc', '1'],
        ['qweqwe', '1'],
        ['qweasd', '1'],
        ['qwezxc', '1'],
        ['zxcqwe', '1'],
        ['zxcasd', '1'],
        ['zxczxc', '1'],
    ]),
    sessions: {},
    chats: [],
    messages: [],
};

const handlers = new Handlers(storage);
app.post('/api/register', handlers.register);
app.post('/api/login', handlers.login);
app.get('/api/search', handlers.search);
app.get('/api/chats', handlers.getChats);
app.get('/api/chats/:user', handlers.getMessages);

const websocketClients = new Map();
app.ws('/ws', handlers.websocketHandler);

app.listen(1717, () => console.log(`HTTP server started`));





