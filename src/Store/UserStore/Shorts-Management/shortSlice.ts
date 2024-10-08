import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as videoService from './shortService'
import * as interfaces from './interfaces'

export const uploadShorts = createAsyncThunk<interfaces.uploadShortsResponse, interfaces.uploadShorts>(
    'video/uploadShorts',
    async (credentials: interfaces.uploadShorts, { rejectWithValue }) => {
        try {
            const data = await videoService.uploadShorts(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.uploadShortsResponse>{
                message: 'Internal Server Error'
            })
        }
    }
)

export const getShorts = createAsyncThunk<interfaces.getShortsResponse, interfaces.getShorts>(
    'video/getShorts',
    async (credentials: interfaces.getShorts, { rejectWithValue }) => {
        try {
            const data = await videoService.getShorts(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.getShortsResponse>{
                message: 'Internal Server Error',
                status: 201,
                shorts: [],
                total: 0
            })
        }
    }
)

export const getShortsVideo = createAsyncThunk<interfaces.getShortsVideoResponse, interfaces.getShortsVideo>(
    'video/getShortsVideo',
    async (credentials: interfaces.getShortsVideo, { rejectWithValue }) => {
        try {
            const data = await videoService.getShortsVideo(credentials)
            return data
        } catch (e) {
            return rejectWithValue(<interfaces.getShortsVideoResponse>{
                message: 'Internal Server Error',
                status: 201,
            })
        }
    }
)

export const videoInitialState: interfaces.shortState = {
    loadingShorts: false,
    Shorts: []
}


const shortSlice = createSlice({
    name: 'shorts',
    initialState: videoInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadShorts.pending, (state) => {
                state.loadingShorts = true
            })
            .addCase(uploadShorts.fulfilled, (state) => {
                state.loadingShorts = false
            })
    },
})

export default shortSlice.reducer