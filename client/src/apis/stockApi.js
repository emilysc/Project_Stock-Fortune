import axios from 'axios';

const baseUri = 'https://api.iextrading.com/1.0';
const defaultTypes = ['quote', 'news', 'chart', 'logo'];

export function queryOneSymbol(symbol, types = defaultTypes) {
    return axios
        .get(`${baseUri}/stock/${symbol}/batch?types=${types.join(',')}&range=1m&last=10`, {})
        .then(res => {
            if (res.status !== 200) {
                throw new Error("API error");
            }
            return res.data;
        });
}

export function queryMultipleSymbol(symbols, types = defaultTypes) {
    return axios
        .get(`${baseUri}/stock/market/batch?symbols=${symbols}&types=${types.join(',')}&range=1m&last=10`, {})
        .then(res => {
            if (res.status !== 200) {
                throw new Error("API error");
            }
            return res.data;
        });
}