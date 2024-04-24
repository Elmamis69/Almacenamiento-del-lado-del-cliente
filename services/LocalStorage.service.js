import { Crypto } from './Crypto.js';

export class LocalStorageService {
    constructor() { }

    static setItem(key, value) {
        const encryptedData = Crypto.encryptData(value);
        localStorage.setItem(key, encryptedData);
    }

    static getItem(key) {
        const encryptedData = localStorage.getItem(key);
        return Crypto.decryptData(encryptedData);
    }
}
