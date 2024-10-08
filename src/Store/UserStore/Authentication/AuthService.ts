import axios from 'axios';
import * as interfaces from './Interfaces'
import config from '@/Configs/config'


export const login: Function = async (data: interfaces.LoginCredentials): Promise<interfaces.loginResponse> => {
    try {
        const response = await axios.post(`${config.USER}/login`, data, {
            withCredentials: true
        })
        return <interfaces.loginResponse>response.data
    } catch (e) {
        return <interfaces.loginResponse>{
            errors: [],
            message: 'Internal Server Error',
            status: 500
        }
    }
}


export const register: Function = async (data: interfaces.RegisterCredentials): Promise<interfaces.registerResponse> => {
    try {
        const response = await axios.post(`${config.USER}/register`, data, {
            withCredentials: true
        })
        return <interfaces.registerResponse>response.data
    } catch (e) {
        return <interfaces.registerResponse>{
            errors: [],
            message: 'Internal Server Error',
            status: 500
        }
    }
}

export const verifyaccount: Function = async (data: interfaces.VerifyAccount): Promise<interfaces.verifyAccountResponse> => {
    try {
        const response = await axios.get(`${config.USER}/verify-account/${data.VerificationLink}/${data.UserId}`, {
            withCredentials: true
        })
        return <interfaces.verifyAccountResponse>response.data
    } catch (e) {
        return <interfaces.verifyAccountResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const addProfile: Function = async (data: interfaces.AddProfilePic): Promise<interfaces.addProfileResponse> => {
    try {
        console.log(data)
        const formData = new FormData();
        formData.append('Profile', data.Profile ? data.Profile : '');
        formData.append('Username', data.Username);
        formData.append('UserId', data.UserId ? data.UserId : '');
        formData.append('RememberMe', String(data.RememberMe));
        const response = await axios.post(`${config.USER}/update-verify/${data.UserId}`, formData, {
            withCredentials: true
        })
        return <interfaces.addProfileResponse>response.data
    } catch (e) {
        return <interfaces.addProfileResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const otplogin: Function = async (data: interfaces.OTPVerify): Promise<interfaces.OTPVerifyResponse> => {
    try {
        const response = await axios.post(`${config.USER}/otp/${data.UserId}`, data, {
            withCredentials: true
        })
        return <interfaces.OTPVerifyResponse>response.data
    } catch (e) {
        return <interfaces.OTPVerifyResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const VerifyUserAuth: Function = async (data: interfaces.AuthVerifyUser): Promise<interfaces.AuthVerifyUserResponse> => {
    try {
        const response = await axios.get(`${config.USER}/verify`, {
            withCredentials: true,
            headers: {
                Authorization: `${data.token}`
            }
        });
        return <interfaces.AuthVerifyUserResponse>response.data;
    } catch (e) {
        console.error(e);
        return <interfaces.AuthVerifyUserResponse>{
            message: 'Internal Server Error'
        };
    }
};

export const otpresend: Function = async (data: interfaces.resendOTP): Promise<interfaces.resendOTPResponse> => {
    try {
        const response = await axios.post(`${config.USER}/resendotp/${data.UserId}`, data, {
            withCredentials: true
        })
        return <interfaces.resendOTPResponse>response.data
    } catch (e) {
        return <interfaces.resendOTPResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const getTwoStep: Function = async (data: interfaces.getTwoStep): Promise<interfaces.getTwoStepResponse> => {
    try {
        const response = await axios.post(`${config.USER}/get-twostep`, data, {
            withCredentials: true,
            headers: {
                Authorization: `${data.token}`
            }
        })
        return <interfaces.getTwoStepResponse>response.data
    } catch (e) {
        return <interfaces.getTwoStepResponse>{
            message: 'Internal Server Error',
        }
    }
}
