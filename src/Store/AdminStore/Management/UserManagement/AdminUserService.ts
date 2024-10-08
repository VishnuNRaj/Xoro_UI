import axios from "axios"
import * as interfaces from "./Interfaces"
import config from "@/Configs/config"

export const getUsers: Function = async ({ token }: interfaces.GetUsers): Promise<interfaces.GetUsersResponse> => {
    try {
        const response = await axios.get(config.ADMIN + '/get-userdata', {
            headers: {
                Authorization: `${token}`,
            },
            withCredentials: true
        })
        return response.data
    } catch (e) {
        return <interfaces.GetUsersResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const updateUser: Function = async (data: interfaces.UpdateUser): Promise<interfaces.GetUsersResponse> => {
    try {
        const response = await axios.post(`${config.ADMIN}/${data.UserId}/manageUser`, data, {
            headers: {
                Authorization: `${data.token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        return response.data
    } catch (e) {
        return <interfaces.GetUsersResponse>{
            message: 'Internal Server Error',
        }
    }
}