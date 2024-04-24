export class Crypto {
  constructor() { }

  static encryptData(data) {
    try {
      const encryptedData = btoa(JSON.stringify(data));
      return encryptedData;
    } catch (error) {
      console.log('Error al cifrar datos', error);
      return data;
    }
  }

  static decryptData(data) {
    try {
      return JSON.parse(atob(data));
    } catch (error) {
      console.log('Error al decifrar datos', error);
      return data;
    }
  } 
}
