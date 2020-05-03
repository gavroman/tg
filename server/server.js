const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Handlers = require('./handlers.js');

const app = express();
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
    users: new Map(),
    sessions: {},
    dialogs: {},
    messages: {},
};

const handlers = new Handlers(storage);
app.post('/api/register', handlers.registerHandler);
app.post('/api/login', handlers.loginHandler);

app.listen(1717, () => console.log(`HTTP server started`));





