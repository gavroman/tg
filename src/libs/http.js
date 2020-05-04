export const fetchPost = (url, payload) => {
    return fetch(url, {
        headers: new Headers({'content-type': 'application/json'}),
        credentials: 'include',
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(payload),
    });
};

export const fetchGet = (url, queryObj = {}, headers = {}) => {
    const urlObj = new URL(url);

    for (const key in queryObj) {
        urlObj.searchParams.append(key, queryObj[key]);
    }

    return fetch(urlObj.href, {
        credentials: 'include',
        mode: 'cors',
        method: 'GET',
        headers,
    });
};

export const fetchPut = (url, body, headers = {}) => {
    return fetch(url, {
        credentials: 'include',
        mode: 'cors',
        method: 'PUT',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(body),
    });
};

export const fetchDelete = (url, headers = {}) => {
    return fetch(url, {
        credentials: 'include',
        mode: 'cors',
        method: 'DELETE',
        headers,
    });
};


