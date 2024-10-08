export interface AdminLogin {
    Email: string;
    Password: string;
}

export interface AdminLoginResponse {
    message: string;
    error: string[];
    status: number;
    admin: any;
}

export interface AdminAuth {
    message: string;
    admin: any;
    error: string[]
    loading: boolean;
}

export interface adminVerifyOTP {
    OTP: string;
    RememberMe: boolean;
    UserId: string;
}

export interface adminVerifyOTPResponse {
    message: string;
    status: number;
    admin: any;
    token: string;
}

export interface adminResendOTP {
    UserId: string;
}

export interface adminResendOTPResponse {
    message: string;
    status: number;
}

export interface adminVerifyAuth {
    token: string;
}

export interface adminVerifyAuthResponse {
    message: string;
    status: number;
    admin: any;
}