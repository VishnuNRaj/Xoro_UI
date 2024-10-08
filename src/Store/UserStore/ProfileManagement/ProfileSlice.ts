import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import * as interfaces from "./interfaces";
import * as profileService from "./ProfileService";
import { toast } from "sonner";

const profileState: interfaces.profileState = {
    loadingProfile: false,
    users: [],
    posts: []
}

export const editProfilePic = createAsyncThunk<interfaces.EditProfilePicResponse, interfaces.EditProfilePic>(
    "profile/editProfilePic",
    async (credentials) => {
        try {
            const data = await profileService.editProfilePic(credentials);
            return data;
        } catch (error) {
            return { message: "Internal Server Error" };
        }
    }
);

export const editBanner = createAsyncThunk<interfaces.EditBannerResponse, interfaces.EditBanner>(
    "profile/editbanner",
    async (credentials) => {
        try {
            const data = await profileService.editBanner(credentials);
            return data;
        } catch (error) {
            return { message: "Internal Server Error" };
        }
    }
);

export const profileSettings = createAsyncThunk<interfaces.profileSettingsResponse, interfaces.profileSettings>(
    'profile/profileSettings',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.profileSettings(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.profileSettingsResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)

export const searchUsers = createAsyncThunk<interfaces.searchUsersResponse, interfaces.searchUsers>(
    'profile/searchUsers',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.searchUsers(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.searchUsersResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const editProfile = createAsyncThunk<interfaces.editProfileResponse, interfaces.editProfile>(
    'profile/editProfile',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.editProfile(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.searchUsersResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const getProfile = createAsyncThunk<interfaces.getProfileResponse, interfaces.getProfile>(
    'profile/getProfile',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.getProfile(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.getProfileResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const getChannel = createAsyncThunk<interfaces.getChannelResponse, interfaces.getChannel>(
    'profile/getChannel',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.getChannel(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.getChannelResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const followUser = createAsyncThunk<interfaces.followUserResponse, interfaces.followUser>(
    'profile/followUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.followUser(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.followUserResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const RemovefollowUser = createAsyncThunk<interfaces.followUserResponse, interfaces.followUser>(
    'profile/RemovefollowUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.RemovefollowUser(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.followUserResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const unfollowUser = createAsyncThunk<interfaces.followUserResponse, interfaces.followUser>(
    'profile/unfollowUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.unFollowUser(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.followUserResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

type ToastType = 'error' | 'success';

const toastify: (type: ToastType, message: string) => void = (type, message) => {
    toast[type](message,
        {
            duration: 1000,
            position: 'top-right',
        }
    )
};

export const createChannel = createAsyncThunk<interfaces.createChannelResponse, interfaces.createChannel>(
    'auth/createChannel',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.createChannel(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.createChannelResponse>{
                message: 'Internal Server Error',
            })
        }
    }
)

export const editChannel = createAsyncThunk<interfaces.createChannelResponse, interfaces.editChannel>(
    'auth/editChannel',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await profileService.editChannel(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.createChannelResponse>{
                message: 'Internal Server Error',
            })
        }
    }
)


const profileSlice = createSlice({
    name: 'profile',
    initialState: profileState,
    reducers: {
        resetStateProfile: (state) => {
            Object.assign(state, profileState);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(editProfilePic.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(editProfilePic.fulfilled, (state, action: PayloadAction<interfaces.EditProfilePicResponse>) => {
                state.loadingProfile = false;
                if (action.payload.status === 200) toastify('success', action.payload.message)
                else toastify('error', action.payload.message)
            })
            .addCase(editBanner.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(editBanner.fulfilled, (state, action: PayloadAction<interfaces.EditProfilePicResponse>) => {
                state.loadingProfile = false;
                if (action.payload.status === 200) toastify('success', action.payload.message)
                else toastify('error', action.payload.message)
            })
            .addCase(profileSettings.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(profileSettings.fulfilled, (state, action: PayloadAction<interfaces.profileSettingsResponse>) => {
                if (action.payload.status === 200) toastify('success', action.payload.message)
                else toastify('error', action.payload.message)
                state.loadingProfile = false;
            })
            .addCase(searchUsers.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(searchUsers.fulfilled, (state, action: PayloadAction<interfaces.searchUsersResponse>) => {
                state.users = action.payload.users ? action.payload.users : []
                state.loadingProfile = false;
            })
            .addCase(editProfile.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(editProfile.fulfilled, (state) => {
                state.loadingProfile = false;
            })
            .addCase(followUser.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(followUser.fulfilled, (state) => {
                state.loadingProfile = false;
            })
            .addCase(RemovefollowUser.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(RemovefollowUser.fulfilled, (state) => {
                state.loadingProfile = false;
            })
            .addCase(unfollowUser.pending, (state) => {
                state.loadingProfile = true;
            })
            .addCase(unfollowUser.fulfilled, (state) => {
                state.loadingProfile = false;
            })
            .addCase(createChannel.pending, (state) => {
                state.loadingProfile = true
            })
            .addCase(createChannel.fulfilled, (state) => {
                state.loadingProfile = false
            })
            .addCase(editChannel.pending, (state) => {
                state.loadingProfile = true
            })
            .addCase(editChannel.fulfilled, (state) => {
                state.loadingProfile = false
            })
            .addCase(getChannel.pending, (state) => {
                state.loadingProfile = true
            })
            .addCase(getChannel.fulfilled, (state) => {
                state.loadingProfile = false
            })
    }
})

export const { resetStateProfile } = profileSlice.actions
export default profileSlice.reducer;