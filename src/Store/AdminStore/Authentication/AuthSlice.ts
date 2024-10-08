import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as authService from './AuthService';
import * as interfaces from './Interfaces';
import Cookies from 'js-cookie';


export const adminLogin = createAsyncThunk<interfaces.AdminLoginResponse, interfaces.AdminLogin>(
    'admin/adminLogin',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.adminLogin(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.AdminLoginResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)


export const adminOTP = createAsyncThunk<interfaces.adminVerifyOTPResponse, interfaces.adminVerifyOTP>(
    'admin/adminOTP',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.adminOTP(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.adminVerifyOTPResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const resendOTP = createAsyncThunk<interfaces.adminResendOTPResponse, interfaces.adminResendOTP>(
    'admin/resendOTP',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.adminResendOTP(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.adminResendOTPResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const adminVerifyAuth = createAsyncThunk<interfaces.adminVerifyAuthResponse, interfaces.adminVerifyAuth>(
    'admin/adminVerifyAuth',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.verifyAdmin(credentials)
            console.log(data)
            return data
        } catch (error) {
            return rejectWithValue(<interfaces.adminResendOTPResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)


const initialState: interfaces.AdminAuth = {
    admin: null,
    loading: false,
    error: [],
    message: '',
};


const authSliceAdmin = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        resetAdminState: (state) => {
            Object.assign(state, initialState);
        },
        setAdmin: (state, action: PayloadAction<interfaces.AdminAuth>) => {
            state.admin = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
                state.message = ''
            })
            .addCase(adminLogin.fulfilled, (state, action: PayloadAction<interfaces.AdminLoginResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(adminOTP.pending, (state) => {
                state.loading = true;
                state.message = ''
            })
            .addCase(adminOTP.fulfilled, (state, action: PayloadAction<interfaces.adminVerifyOTPResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                if (action.payload.status === 200) {
                    state.admin = action.payload.admin
                    Cookies.set('admin', action.payload.token)
                }
            })
            .addCase(adminVerifyAuth.pending, (state) => {
                state.loading = true;
                state.message = ''
            })
            .addCase(adminVerifyAuth.fulfilled, (state, action: PayloadAction<interfaces.adminVerifyAuthResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                console.log(state, '____________________')
                if (action.payload.admin) {
                    state.admin = action.payload.admin
                } else {
                    Cookies.remove('admin')
                }
            })
            .addCase(resendOTP.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(resendOTP.fulfilled, (state, action: PayloadAction<interfaces.adminResendOTPResponse>) => {
                state.loading = false;
                state.message = action.payload.message
            })
    },

})

export const { resetAdminState, setAdmin } = authSliceAdmin.actions
export default authSliceAdmin.reducer
