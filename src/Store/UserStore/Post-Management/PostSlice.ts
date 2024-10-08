import * as interfaces from './Interfaces'
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import * as postService from './PostService'

export const addPost = createAsyncThunk<interfaces.addPostResponse, interfaces.addPost>(
    'post/addPost',
    async (credentials: interfaces.addPost, { rejectWithValue }) => {
        try {
            const data = await postService.addPost(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.addPostResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)

export const showPost = createAsyncThunk<interfaces.showPostResponse, interfaces.showPost>(
    'post/showPost',
    async (credentials: interfaces.showPost, { rejectWithValue }) => {
        try {
            const data = await postService.showPost(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.addPostResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)



export const LikeDislikeRemoveThunk = createAsyncThunk<interfaces.likeDislikeRemoveResponse, interfaces.likeDislikeRemove>(
    "post/LikeDislikeRemoveThunk",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await postService.LikeDislikeRemove(credentials)
            return response;
        } catch (e) {
            return rejectWithValue(<interfaces.likeDislikeRemoveResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)

export const getPosts = createAsyncThunk<interfaces.getPostsResponse, interfaces.getPosts>(
    'post/getPosts',
    async (credentials: interfaces.showPost, { rejectWithValue }) => {
        try {
            const data = await postService.getPosts(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.addPostResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)

export const getPost = createAsyncThunk<interfaces.getPostResponse, interfaces.getPost>(
    'post/getPost',
    async (credentials: interfaces.getPost, { rejectWithValue }) => {
        try {
            const data = await postService.getPost(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.getPostResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)

export const deletePost = createAsyncThunk<interfaces.deletePostResponse, interfaces.deletePost>(
    'post/deletePost',
    async (credentials: interfaces.deletePost, { rejectWithValue }) => {
        try {
            const data = await postService.deletePost(credentials);
            return data;
        } catch (error) {
            return rejectWithValue(<interfaces.addPostResponse>{
                message: 'Internal Server Error',
                status: 500
            })
        }
    }
)

const initialState: interfaces.PostState = {
    loadingPost: false,
    message: '',
    post: []
}
const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        resetPostState: (state) => {
            Object.assign(state, initialState);
        },
        setPosts: (state, action) => {
            state.post = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.
            addCase(addPost.pending, (state) => {
                state.loadingPost = true;
                state.message = '';
            })
            .addCase(addPost.fulfilled, (state, action: PayloadAction<interfaces.addPostResponse>) => {
                state.message = action.payload.message;
                state.loadingPost = false;
            })
            .addCase(showPost.pending, (state) => {
                state.loadingPost = true;
                state.message = '';
            })
            .addCase(showPost.fulfilled, (state, action: PayloadAction<interfaces.showPostResponse>) => {
                state.message = action.payload.message;
                state.loadingPost = false;
                state.post = action.payload.post ? action.payload.post : [];
            })
            .addCase(deletePost.pending, (state) => {
                state.loadingPost = true;
                state.message = '';
            })
            .addCase(deletePost.fulfilled, (state) => {
                state.loadingPost = false;
            })
            .addCase(getPost.pending, (state) => {
                state.loadingPost = true;
                state.message = '';
            })
            .addCase(getPost.fulfilled, (state) => {
                state.loadingPost = false;
            })

    },
})

export const { resetPostState, setPosts } = postSlice.actions
export default postSlice.reducer