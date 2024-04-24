import { LocalStorageService } from "./services/LocalStorage.service.js";
import { SessionStorageService } from './services/SessionStorage.service.js';
import { CookiesService } from "./services/Cookies.service.js";

let user = { nombre: 'John Doe', edad: 25 };

// Esto se almacena en LocalStorage
LocalStorageService.setItem('user', user);
console.log('Este es el usuario obtenido desde Local Storage:', LocalStorageService.getItem('user'));

// Esto se almacena en SessionStorage
SessionStorageService.setItem('user', user);
console.log('Este es el usuario obtenido desde Session Storage:', SessionStorageService.getItem('user'));

// Esto se almacena en la Cookie
CookiesService.setCookie('user', user, 7);
const userCookie = CookiesService.getCookie('user');
console.log('Este es el usuario obtenido desde la Cookie:', userCookie);
