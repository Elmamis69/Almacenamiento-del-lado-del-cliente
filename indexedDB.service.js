import { Crypto } from './Crypto.js';

export class IndexedDBService {
    // Constructor de la clase con parámetros para el nombre de la base de datos y el nombre del almacén de objetos
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
    }

    // Método estático asincrónico para establecer un elemento en IndexedDB
    async setItem(key, value) {
        // Encripta el valor utilizando el método encryptData del módulo Crypto
        const encryptedValue = Crypto.encryptData(value);

        // Abre la base de datos, inicia una transacción en modo de escritura y accede al almacén de objetos
        const db = await this.openDB();
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);

        // Inserta el objeto (key, value: encryptedValue) en el almacén de objetos
        store.put({ key, value: encryptedValue });

        // Espera a que se complete la transacción
        await tx.complete;
    }

    // Método estático asincrónica para obtener un elemento de IndexedDB
    async getItem(key) {
        return new Promise((resolve, reject) => {
            try {
                // Abre la base de datos y devuelve una Promise
                this.openDB().
                    then((db) => {
                        // Inicia una transacción y accede al almacén de objetos
                        const tx = db.transaction(this.storeName);
                        const store = tx.objectStore(this.storeName);

                        // Obtiene el objeto asociado con la clave (key) utilizando el método get
                        const request = store.get(key);

                        // Maneja el evento onsuccess
                        request.onsuccess = (event) => {
                            const result = event.target.result;
                            // Si se encuentra un resultado, resuelve la Promise con el valor desencriptado
                            // Si no hay resultado, resuelve la Promise con null
                            resolve(result ? Crypto.decryptData(result.value) : null);
                        };

                        // Maneja el evento onerror
                        request.onerror = (event) => {
                            console.error('Error al obtener el elemento desde IndexedDB:', request.error);
                            reject(request.error); // Rechaza la Promise con el error
                        };
                    })
                    .catch(error => {
                        console.error("Error al abrir la base de datos:", error);
                        reject(error); // Rechaza la Promise con el error
                    });
            } catch (error) {
                console.error('Error al obtener el elemento desde IndexedDB:', error);
                reject(error); // Rechaza la Promise con el error
            }
        });
    }

    // Método estático asincrónico para abrir la base de datos
    async openDB() {
        // Devuelve una promesa que se resuelve con la instancia de la base de datos
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            // Maneja el evento onupgradeneeded para realizar actualizaciones, si es necesario
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(this.storeName, { keyPath: 'key' });
            };

            // Maneja el evento onsuccess para resolver la promesa con la instancia de la base de datos
            request.onsuccess = () => resolve(request.result);

            // Maneja el evento onerror para rechazar la promesa con el error
            request.onerror = () => reject(request.error);
        });
    }
}