const http = require('http');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const IP_ADDRESS = require('ip').address();
const IS_DEV = process.env.NODE_ENDV === 'development';

const Handlers = require('./handlers.js');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser('secretsecrethfb4234cjkasdhnkeadsa'));

if (IS_DEV) {
    const corsWhitelist = [
        'http://localhost:3333',
        'http://192.168.0.104:3333',
        'http://89.208.197.150:3333',
        'http://localhost:1717',
        'http://192.168.0.104:1717',
        'http://89.208.197.150:1717',
    ];
    const corsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            if (corsWhitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS ' + origin))
            }
        }
    };
    app.use(cors(corsOptions));
}

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
app.ws('/ws', handlers.websocketHandler);

if (!IS_DEV) {
    const distFolder = path.resolve(__dirname, '../', 'dist');
    const imgFolder = path.resolve(__dirname, '../', 'img');
    app.use(express.static(distFolder));
    app.use(express.static(imgFolder));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(distFolder, 'index.html'));
    });
}

app.listen(1717, () => console.log(`HTTP server started`));

