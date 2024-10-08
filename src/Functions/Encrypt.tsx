import axios from 'axios';
import CryptoJS from 'crypto-js';
import { getCookie } from './Cookies';

export const encryptUserID = (userId: string | any) => {
    const encrypted = CryptoJS.AES.encrypt(userId, 'vishnu8240.achu@gmail.com').toString();
    return encodeURIComponent(encrypted);
};

export const decryptUserID = (UserId: string | any) => {
    const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(UserId), 'vishnu8240.achu@gmail.com').toString(CryptoJS.enc.Utf8);
    return decrypted;
};

export const userAxios = axios.interceptors.request.use((config)=>{
    config.headers.Authorization = getCookie("token");
    return config
})