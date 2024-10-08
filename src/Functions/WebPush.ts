import axios from "axios";
import config from "@/Configs/config";
import { getCookie } from "./Cookies";

export const subscribe = async (serviceWorkerReg: ServiceWorkerRegistration, status: boolean) => {
    try {
        let subscription = await serviceWorkerReg.pushManager.getSubscription();
        if (!subscription && status) {
            subscription = await serviceWorkerReg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BOCVKtCi34hgnwOWSK5jXlZEUijYKyAcRkBa5jwCPuo0jheodoV1974ij6SupCtiUEoHEofyaucnRo2EqXNBNwY',
            });
            const token = getCookie("token")
            if (token) {
                await axios.post(`${config.USER}/subscribe`, subscription, {
                    withCredentials: true,
                    headers: {
                        Authorization: token
                    }
                });
            }
        }
        console.log(subscription)
        return subscription;
    } catch (e) {
        console.log(e)
    }
}


const fction = async (status: boolean) => {
    try {
        const token = getCookie("token")
        if (token) {
            const url = '/serviceWorker.js';
            const reg = await navigator.serviceWorker.register(url, {
                scope: "/"
            });
            await navigator.serviceWorker.ready;

            return await subscribe(reg, status);
        } else return;

    } catch (error) {
        console.error('Service worker registration failed:', error);
    }
};


export default fction;