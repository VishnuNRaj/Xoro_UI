import Cookies from "js-cookie";
import { toast } from "sonner"
export const getCookie: Function = (token: string): string | undefined => {
    return Cookies.get(token)
}

export const setCookie: Function = (token: string, name: string) => {
    return Cookies.set(name, token)
}

export const removeCookie: Function = (name: string) => {
    return Cookies.remove(name)
}

export type toastType = 'success' | 'error';

export const useToast: Function = (message: string, name: toastType) => {
    return toast[name](message, {
        duration: 1500,
        position: 'top-right'
    })
} 