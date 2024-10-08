import axios from "axios";
import * as interfaces from "./Interfaces";
import config from "@/Configs/config";
import { getCookie } from "@/Functions/Cookies";
axios.interceptors.request.use(config => {
    config.withCredentials = true;
    const token = getCookie("admin");
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
})
export const adminLogin: Function = async (data: interfaces.AdminLogin): Promise<interfaces.AdminLoginResponse> => {
    try {
        const response = await axios.post(`${config.ADMIN}/login`, data, {
            withCredentials: true
        })
        return <interfaces.AdminLoginResponse>response.data
    } catch (e) {
        console.log(e)
        return <interfaces.AdminLoginResponse>{
            message: 'Internal server error',
        }
    }
}

export const adminOTP: Function = async (data: interfaces.adminVerifyOTP): Promise<interfaces.adminVerifyOTPResponse> => {
    try {
        const response = await axios.post(`${config.ADMIN}/otp/${data.UserId}`, data, {
            withCredentials: true
        })
        return <interfaces.adminVerifyOTPResponse>response.data
    } catch (e) {
        console.log(e)
        return <interfaces.adminVerifyOTPResponse>{
            message: 'Internal server error',
        }
    }
}

export const adminResendOTP: Function = async (data: interfaces.adminResendOTP): Promise<interfaces.adminResendOTPResponse> => {
    try {
        const response = await axios.post(`${config.ADMIN}/resendotp/${data.UserId}`, data, {
            withCredentials: true
        })
        return <interfaces.adminResendOTPResponse>response.data
    } catch (e) {
        return <interfaces.adminResendOTPResponse>{
            message: 'Internal server error',
        }
    }
}

export const verifyAdmin: Function = async (data: interfaces.adminVerifyAuth): Promise<interfaces.adminVerifyAuthResponse> => {
    try {
        const response = await axios.get(`${config.ADMIN}/verify`, {
            headers: {
                Authorization: data.token
            }
        })
        return <interfaces.adminVerifyAuthResponse>response.data
    } catch (e) {
        return <interfaces.adminVerifyAuthResponse>{
            message: 'Internal server error',
        }
    }
}