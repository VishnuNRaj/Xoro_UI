import axios from "axios";
import config from "@/Configs/config";
import { getCookie } from "./Cookies";

async function subscribeToWebPush(serviceWorkerReg: ServiceWorkerRegistration, status: boolean) {
  try {
    let subscription = await serviceWorkerReg.pushManager.getSubscription();
    if (!subscription && status) {
      subscription = await serviceWorkerReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BOCVKtCi34hgnwOWSK5jXlZEUijYKyAcRkBa5jwCPuo0jheodoV1974ij6SupCtiUEoHEofyaucnRo2EqXNBNwY',
      });
      const token = getCookie("token");
      if (token) {
        await axios.post(`${config.USER}/subscribe`, subscription, {
          withCredentials: true,
          headers: {
            Authorization: token
          }
        });
      }
    }
    console.log(subscription);
    return subscription;
  } catch (error) {
    console.error('Subscription failed:', error);
    throw error;
  }
}

async function setupWebPushNotifications(status: boolean) {
  try {
    const token = getCookie("token");
    if (!token) return;

    const url = '/serviceWorker.js';
    const reg = await navigator.serviceWorker.register(url, {
      scope: "/"
    });
    await navigator.serviceWorker.ready;

    return await subscribeToWebPush(reg, status);
  } catch (error) {
    console.error('Service worker registration failed:', error);
    throw error;
  }
}

export default setupWebPushNotifications;