import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as interfaces from './Interfaces'
import * as adminUserService from './AdminUserService'


export const getUsers = createAsyncThunk<interfaces.GetUsersResponse, interfaces.GetUsers>(
    'adminuser/getUsers',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await adminUserService.getUsers(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.GetUsersResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const updateUser = createAsyncThunk<interfaces.UpdateUserResponse,interfaces.UpdateUser>(
    'adminuser/UpdateUser',
    async (credentials,{rejectWithValue}) => {
        try {
            const data = await adminUserService.updateUser(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.UpdateUserResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

const initialState: interfaces.UserManage = {
    users: [],
    message: '',
    loadingUsers: false
}

const UserManagementSlice = createSlice({
    name: 'adminuser',
    initialState,
    reducers: {
        resetAdminUserState: (state) => {
            Object.assign(state, initialState);
        },
        updateUserData:(state,action)=>{
            state.users = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.
            addCase(getUsers.pending, (state) => {
                state.loadingUsers = true;
                state.message = '';
            })
            .addCase(getUsers.fulfilled, (state, action: PayloadAction<interfaces.GetUsersResponse>) => {
                state.loadingUsers = false;
                state.message = action.payload.message;
                console.log(action.payload.users)
                if (action.payload.users) {
                    state.users = action.payload.users;
                }
            })
            .addCase(updateUser.pending,(state)=>{
                state.loadingUsers = true;
                state.message = '';
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<interfaces.UpdateUserResponse>) => {
                state.loadingUsers = false;
                state.message = action.payload.message;
            })
    },
})


export default UserManagementSlice.reducer
export const { resetAdminUserState,updateUserData } = UserManagementSlice.actions 