import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as authService from './AuthService';
import * as interfaces from './Interfaces';
import { toast } from 'sonner';
import { removeCookie,setCookie } from '../../../Functions/Cookies';


export const login = createAsyncThunk<interfaces.loginResponse, interfaces.LoginCredentials>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.login(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.loginResponse>{
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const register = createAsyncThunk<interfaces.registerResponse, interfaces.RegisterCredentials>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.register(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.registerResponse>{
                message: 'Internal Server Error',
                errors: [],
            });
        }
    }
);

export const verifyAccount = createAsyncThunk<interfaces.verifyAccountResponse, interfaces.VerifyAccount>(
    'auth/verifyAccount',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.verifyaccount(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.verifyAccountResponse>{
                message: 'Internal Server Error',
            });
        }
    }
)

export const AddProfilePic = createAsyncThunk<interfaces.addProfileResponse, interfaces.AddProfilePic>(
    'auth/AddProfilePic',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.addProfile(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.addProfileResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const OTPLogin = createAsyncThunk<interfaces.OTPVerifyResponse, interfaces.OTPVerify>(
    'auth/OTPLogin',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.otplogin(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.OTPVerifyResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const AuthUser = createAsyncThunk<interfaces.AuthVerifyUserResponse, interfaces.AuthVerifyUser>(
    'auth/AuthUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.VerifyUserAuth(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.OTPVerifyResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)


export const resendOtp = createAsyncThunk<interfaces.resendOTPResponse, interfaces.resendOTP>(
    'auth/resendOtp',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.otpresend(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.resendOTPResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const getTwoStep = createAsyncThunk<interfaces.getTwoStepResponse, interfaces.getTwoStep>(
    'auth/getTwoStep',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authService.getTwoStep(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.resendOTPResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

const initialState: interfaces.AuthState = {
    user: null,
    loading: false,
    error: [],
    message: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetState: (state) => {
            Object.assign(state, initialState);
        },
        setUser: (state, action: PayloadAction<interfaces.User>) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = [];
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = [];
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<interfaces.loginResponse>) => {
                state.loading = false;
                if(action.payload.refresh) {
                    setCookie(action.payload.refresh,"refresh")
                }
                if (action.payload.status === 204) {
                    toast.success(action.payload.message, {
                        position: 'top-right',
                        duration: 3000,
                    });
                    return;
                }
                state.error = action.payload.errors;
                state.user = action.payload.status === 210 ? action.payload.user : null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<interfaces.registerResponse>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.error = action.payload.errors;
            })
            .addCase(verifyAccount.pending, (state) => {
                state.loading = true
                state.message = 'Verifying Account Please Wait'
            })
            .addCase(verifyAccount.fulfilled, (state, action: PayloadAction<interfaces.verifyAccountResponse>) => {
                state.loading = false
                state.message = action.payload.message
                if (action.payload.status === 200) {
                    state.user = action.payload.user
                    setCookie(action.payload.token,'token')
                    setCookie( action.payload.refresh,'refresh')
                }
                else {
                    state.user = null
                }
            })
            .addCase(AddProfilePic.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(AddProfilePic.fulfilled, (state, action: PayloadAction<interfaces.addProfileResponse>) => {
                state.message = action.payload.message;
                state.loading = false
                if (action.payload.status === 200) {
                    setCookie( action.payload.token,'token')
                    setCookie( action.payload.refresh,'refresh')
                }
            })
            .addCase(OTPLogin.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(OTPLogin.fulfilled, (state, action: PayloadAction<interfaces.OTPVerifyResponse>) => {
                state.message = action.payload.message;
                state.loading = false
                if (action.payload.status === 200) {
                    setCookie( action.payload.token,'token')
                    setCookie( action.payload.refresh,'refresh')
                }
            })
            .addCase(AuthUser.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(AuthUser.fulfilled, (state, action: PayloadAction<interfaces.AuthVerifyUserResponse>) => {
                if (action.payload.status !== 200) {
                    toast.error(action.payload.message, {
                        position: 'top-right',
                        duration: 2000,
                    });
                    removeCookie('token')
                    removeCookie('refresh')
                }
                state.message = action.payload.message;
                state.loading = false
                if (action.payload.status === 200) {
                    state.user = action.payload.user
                }
            })
            .addCase(resendOtp.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(resendOtp.fulfilled, (state, action: PayloadAction<interfaces.resendOTPResponse>) => {
                let toastify = toast.error;
                if (action.payload.status === 200) {
                    toastify = toast.success;
                }
                state.loading = false
                toastify(action.payload.message, {
                    position: 'top-center',
                    duration: 3000,
                });
            })
            .addCase(getTwoStep.pending, (state) => {
                state.loading = true
                state.message = ''
            })
            .addCase(getTwoStep.fulfilled, (state, action: PayloadAction<interfaces.getTwoStepResponse>) => {
                state.loading = false
                state.message = action.payload.message

            })
    },
});
export const { resetState, setUser } = authSlice.actions;
export default authSlice.reducer;
