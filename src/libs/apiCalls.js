import {fetchGet, fetchPost} from 'Libs/http.js';

export const BACKEND = 'http://localhost:1717/api';
export const WEBSOCKET = 'ws://localhost:1717/ws';

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
