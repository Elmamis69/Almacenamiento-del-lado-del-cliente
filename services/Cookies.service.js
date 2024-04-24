import { Crypto } from './Crypto.js';

export class CookiesService {
    constructor() { }

    static setCookie(name, value, days) {
        const encryptedData = Crypto.encryptData(value);
        let expires = '';

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = `expires=${date.toUTCString()}`;
        }

        document.cookie = `${name}=${encryptedData}; ${expires}; path=/`;
    }

    static getCookie(name) {
        const cookies = document.cookie.split(';');

        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === name) {
                return Crypto.decryptData(cookieValue.trim());
            }
        } 

        return null;
    }
}
