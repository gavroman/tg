import {fetchGet, fetchPost} from 'Libs/http.js';

const BACKEND = `http://${IP_ADDRESS}:1717/api`;
const WEBSOCKET = `ws://${IP_ADDRESS}:1717/ws`;

export const apiLogin = (login, password) => {
    const url = BACKEND + '/login';
    return fetchPost(url, {login, password});
};

export const apiRegister = (login, password) => {
    const url = BACKEND + '/register';
    return fetchPost(url, {login, password});
};

export const apiGetChats = () => {
    const url = BACKEND + '/chats';
    return fetchGet(url);
};

export const apiSearch = (nicknamePart) => {
    const url = BACKEND + '/search';
    return fetchGet(url, {nicknamePart});
};

export const apiGetMessages = (nickname) => {
    const url = `${BACKEND}/chats/${nickname}`;
    return fetchGet(url);
};


export const apiWebsocket = (() => {
    let instance;
    const messageSubscribers = [];
    const closeSubscribers = [];
    const errorSubscribers = [];

    const createInstance = () => {
        const socket = new WebSocket(WEBSOCKET);
        socket.onmessage = (event) => {
            messageSubscribers.forEach(handler => {
                handler(event);
            });
        };
        socket.onclose = (event) => {
            closeSubscribers.forEach(handler => {
                handler(event);
            });
        };
        socket.onerror = (event) => {
            errorSubscribers.forEach(handler => {
                handler(event);
            });
        };
        instance = {
            subscribe: (eventType, handler) => {
                switch (eventType) {
                    case 'message':
                        messageSubscribers.push(handler);
                        break;
                    case 'close':
                        closeSubscribers.push(handler);
                        break;
                    case 'error':
                        errorSubscribers.push(handler);
                        break;
                    default:
                        break;
                }
            },
            send: (dataString) => {
                socket.send(dataString);
            }
        };
        return instance;
    };

    return {
        instance: (() => {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        })()
    };
})();
