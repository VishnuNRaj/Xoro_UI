import config from '@/Configs/config'
import * as interfaces from './interfaces'
import axios from 'axios'

export const getChats: Function = async (data: interfaces.getChats):Promise<interfaces.getChatsResponse> => {
    try {
        const response = await axios.get(`${config.CHAT}/`,{
            headers:{
                Authorization:data.token
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.getChatsResponse>{
            message:"Internal Server Error",
            status:500
        }
    }
}

export const startChat: Function = async (data: interfaces.startChat):Promise<interfaces.startChatResponse> => {
    try {
        const response = await axios.post(`${config.CHAT}/`,data,{
            headers:{
                Authorization:data.token
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.startChatResponse>{
            message:"Internal Server Error",
            status:500
        }
    }
}

export const getChat: Function = async (data: interfaces.getChat):Promise<interfaces.getChatResponse> => {
    try {
        const response = await axios.get(`${config.CHAT}/${data.RoomId}`,{
            headers:{
                Authorization:data.token
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.getChatResponse>{
            message:"Internal Server Error",
            status:500
        }
    }
}