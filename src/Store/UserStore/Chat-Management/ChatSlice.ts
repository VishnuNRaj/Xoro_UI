import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as interfaces from './interfaces';
import * as chatService from './ChatService';

export const chatInitialState = <interfaces.ChatState>{
    chat: null,
    loadingChat: false,
    Notifications: [],
    RoomId: ""

}

export const getChats = createAsyncThunk<interfaces.getChatsResponse, interfaces.getChats>(
    'chat/getChats',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await chatService.getChats(credentials)
            return response
        } catch (e) {
            return rejectWithValue(<interfaces.getChatsResponse>{
                message: "Internal Server Error",
                status: 500,
            })
        }
    }
)

export const startChat = createAsyncThunk<interfaces.startChatResponse, interfaces.startChat>(
    "chat/startChat",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await chatService.startChat(credentials)
            return response
        } catch (e) {
            return rejectWithValue(<interfaces.startChatResponse>{
                message: "Internal Server Error",
                status: 500,
            })
        }
    }
)

export const getChat = createAsyncThunk<interfaces.getChatResponse, interfaces.getChat>(
    "chat/getChat",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await chatService.getChat(credentials)
            return response
        } catch (e) {
            return rejectWithValue(<interfaces.getChatResponse>{
                message: "Internal Server Error",
                status: 500,
            })
        }
    }
)

export const chatSlice = createSlice({
    name: 'chat',
    initialState: chatInitialState,
    reducers: {
        resetChatState: (state) => {
            Object.assign(state, chatInitialState)
        },
        setChat: (state, action: PayloadAction<interfaces.AllChatState | null>) => {
            console.log(action.payload)
            state.chat = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.
            addCase(startChat.pending, (state) => {
                state.loadingChat = true
            })
            .addCase(startChat.fulfilled, (state, action: PayloadAction<interfaces.startChatResponse>) => {
                state.loadingChat = false
                const chat = action.payload.newChat
                chat.users = action.payload.users.reverse()
                state.chat = chat
            })
            .addCase(getChats.pending, (state) => {
                state.loadingChat = true
            })
            .addCase(getChats.fulfilled, (state) => {
                state.loadingChat = false
            })
            .addCase(getChat.pending, (state) => {
                state.loadingChat = true
            })
            .addCase(getChat.fulfilled, (state) => {
                state.loadingChat = false
            })
    },

})

export const { setChat, resetChatState } = chatSlice.actions
export default chatSlice.reducer