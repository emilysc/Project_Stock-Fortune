import axios from 'axios';

const baseUri = '/api/users/me/watch-list';

export function queryWatchList(id) {
    return axios
        .get(`${baseUri}/${id}`, {})
        .then(res => {
            if (res.status !== 200) {
                throw new Error("API error");
            }
            return res.data;
        })
        .then((data) => {
            return data.map(({ watchList, symbol }) => (symbol))
        });
}

export function addSymbolToWatchList(id, symbol) {
    return axios
        .post(`${baseUri}/${id}`, { symbol })
        .then(res => {
            if (res.status !== 200) {
                throw new Error("API error");
            }
            return res.data;
        });
}

export function removeSymbolToWatchList(id, symbol) {
    return axios
        .delete(`${baseUri}/${id}/${symbol}`)
        .then(res => {
            if (res.status !== 200) {
                throw new Error("API error");
            }
            return res.data;
        });
}
