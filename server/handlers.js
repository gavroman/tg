const http = require('http-status-codes');

module.exports = class handlers {
    constructor(storage) {
        this.storage = storage;

        this.getNicknameByCookie = this.getNicknameByCookie.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.getChats = this.getChats.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.postChats = this.postChats.bind(this);
        this.search = this.search.bind(this);

        this.wsClients = new Map();
        this.websocketHandler = this.websocketHandler.bind(this);
    }

    getNicknameByCookie(req) {
        const signedCookies = req.signedCookies;
        if (signedCookies) {
            return signedCookies.session_id;
        }
        return undefined;
    }

    register(req, res) {
        const users = this.storage.users;
        const body = req.body;
        if (this.getNicknameByCookie(req)) {
            res.status(http.SEE_OTHER).send();
            return;
        }
        if (users.has(body.login)) {
            res.status(http.CONFLICT).send();
        } else {
            users.set(body.login, body.password);
            res.cookie('session_id', body.login, {maxAge: 90000000, httpOnly: false, secure: false, signed: true});
            res.status(http.OK).send();
        }
    }

    login(req, res) {
        if (this.getNicknameByCookie(req)) {
            res.status(http.SEE_OTHER).send();
            return;
        }
        const users = this.storage.users;
        if (users.get(req.body.login) === req.body.password) {
            res.cookie('session_id', req.body.login, {maxAge: 90000000, httpOnly: false, secure: false, signed: true});
            res.status(http.OK).send();
        } else {
            res.status(http.NOT_FOUND).send();
        }
    }

    search(req, res) {
        if (!this.getNicknameByCookie(req)) {
            res.status(http.UNAUTHORIZED).send();
            return;
        }
        const nicknamePart = req.query.nicknamePart;
        const results = [...this.storage.users.keys()].filter(user => user.includes(nicknamePart));
        res.status(http.OK).send(results);
    }

    getChats(req, res) {
        const nickname = this.getNicknameByCookie(req);
        if (!nickname) {
            res.status(http.UNAUTHORIZED).send();
            return;
        }
        let chats = this.storage.chats
            .filter(chat => chat.members.has(nickname))
            .map(chat => ({members: [...chat.members].filter(member => member !== nickname)}));
        res.status(http.OK).send({chats});
    }

    getMessages(req, res) {
        const nickname = this.getNicknameByCookie(req);
        if (!nickname) {
            res.status(http.UNAUTHORIZED).send();
            return;
        }
        const reciever = req.params.user;
        const messages = this.storage.messages
            .filter(message => {
                return (message.from === nickname && message.to === reciever)
                    || (message.from === reciever && message.to === nickname)
            })
            .map(message => ({text: message.text, authorIsReader: message.from === nickname}));
        res.status(http.OK).send(messages);
    }

    postChats(req, res) {
        const nickname = this.getNicknameByCookie(req);
        if (!nickname) {
            req.status(http.UNAUTHORIZED).send();
            return;
        }
        const member = req.body.member;
        if (!this.storage.users.has(member)) {
            req.status(http.NOT_FOUND).send();
            return;
        }
        const members = new Set([nickname, member]);
        res.status(http.OK);
    }

    websocketHandler(ws, req) {
        const nickname = this.getNicknameByCookie(req);
        if (!nickname) {
            ws.close();
            return;
        }
        this.wsClients.set(nickname, ws);
        console.log('WS', nickname, 'opened');

        ws.on('message', (string) => {
            const message = JSON.parse(string);
            // console.log(message);
            const receiver = message.to;
            if (!this.storage.users.has(receiver)) {
                return
            }
            console.log('WS', nickname, 'MSG:', receiver, message.text);
            if (!this.storage.chats.some(chat => chat.members.has(nickname) && chat.members.has(nickname))) {
                this.storage.chats.push({members: new Set([nickname, receiver])})
            }

            this.storage.messages.push({from: nickname, to: receiver, text: message.text});
            // console.log(this.storage.messages);
            // console.log(this.storage.chats);

            if (this.wsClients.has(receiver)) {
                const receiverClient = this.wsClients.get(receiver);
                receiverClient.send(JSON.stringify({from: nickname, text: message.text}));
            }
        });

        ws.on('close', () => {
            this.wsClients.delete(nickname);
            console.log('WS', nickname, 'closed');
        });
    }

};
