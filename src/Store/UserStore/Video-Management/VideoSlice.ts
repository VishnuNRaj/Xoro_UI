import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as videoService from './VideoService'
import * as interfaces from './Interfaces'

export const uploadVideo = createAsyncThunk<interfaces.uploadVideoResponse, interfaces.uploadVideo>(
    'video/uploadVideo',
    async (credentials: interfaces.uploadVideo, { rejectWithValue }) => {
        try {
            const data = await videoService.uploadVideo(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.uploadVideoResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const getVideos = createAsyncThunk<interfaces.getVideosResponse, interfaces.getVideos>(
    'video/getVideos',
    async (credentials: interfaces.getVideos, { rejectWithValue }) => {
        try {
            const data = await videoService.getVideos(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.uploadVideoResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const getVideo = createAsyncThunk<interfaces.getVideoResponse, interfaces.getVideo>(
    'video/getVideo',
    async (credentials: interfaces.getVideo, { rejectWithValue }) => {
        try {
            const data = await videoService.getVideo(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.getVideoResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)


export const videoInitialState: interfaces.videoState = {
    Channel: null,
    loadingVideo: false,
    Videos: []
}


const videoSlice = createSlice({
    name: 'video',
    initialState: videoInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadVideo.pending, (state) => {
                state.loadingVideo = true;
            })
            .addCase(uploadVideo.fulfilled, (state) => {
                state.loadingVideo = false
            })
            .addCase(getVideos.pending, (state) => {
                state.loadingVideo = true
            })
            .addCase(getVideos.fulfilled, (state, action: PayloadAction<interfaces.getVideosResponse>) => {
                if (action.payload.status === 200) {
                    const videos = [...state.Videos, ...action.payload.Videos].filter(
                        (value, index, self) =>
                            index === self.findIndex((v) => v._id === value._id)
                    );
                    state.Videos = videos;

                    state.loadingVideo = false;
                }
            })
            .addCase(getVideo.pending, (state) => {
                state.loadingVideo = true
            })
            .addCase(getVideo.fulfilled, (state) => {
                state.loadingVideo = false;
            })
    },
})

export default videoSlice.reducer