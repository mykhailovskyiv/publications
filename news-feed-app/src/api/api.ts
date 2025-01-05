import axios from 'axios';

const BASE_URL = 'https://content-api.boberneprotiv.com/';
const TOKEN = 'd737d43c-7291-4f09-b2d3-f6799eee91af';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json',
    },
});

export const endpoints = {
    publications: '/Publications',
    updatePublication: (id: string) => `/Publications/${id}`,
};

export default api;
