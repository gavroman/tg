const http = require('http-status-codes');

module.exports = class handlers {
    constructor(storage) {
        this.storage = storage;
        this.registerHandler = this.registerHandler.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    }

    getNicknameByCookie(req) {
        const signedCookies = req.signedCookies;
        if (signedCookies) {
            return signedCookies.session_id;
        }
        return undefined;
    }

    registerHandler(req, res) {
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

    loginHandler(req, res) {
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
};
