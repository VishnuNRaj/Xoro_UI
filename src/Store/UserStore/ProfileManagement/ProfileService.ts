import config from '@/Configs/config';
import * as interfaces from './interfaces';
import axios from 'axios'


export const editProfilePic: Function = async (data: interfaces.EditProfilePic) => {
    try {
        const formData = new FormData();
        formData.append('Image', data.Image);
        const response = await axios.post(`${config.PROFILE}/edit-profile-pic`, formData, {
            headers: {
                Authorization: `${data.token}`,
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.EditProfilePicResponse>{
            message: 'Internal Server Error'
        }
    }
}

export const editBanner: Function = async (data: interfaces.EditBanner) => {
    try {
        const formData = new FormData();
        formData.append('Image', data.Image);
        const response = await axios.post(`${config.PROFILE}/edit-banner`, formData, {
            headers: {
                Authorization: `${data.token}`,
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.EditProfilePicResponse>{
            message: 'Internal Server Error'
        }
    }
}

export const profileSettings: Function = async (data: interfaces.profileSettings): Promise<interfaces.profileSettingsResponse> => {
    try {
        const response = await axios.post(`${config.PROFILE}/profile-settings`, data, {
            headers: {
                Authorization: `${data.token}`,
            }
        })
        return response.data
    } catch (e) {
        return <interfaces.profileSettingsResponse>{
            message: 'Internal Server Error'
        }
    }
}

export const searchUsers: Function = async (data: interfaces.searchUsers) => {
    try {
        const response = await axios.get(`${config.PROFILE}/search/${data.search}`, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}

export const editProfile: Function = async (data: interfaces.editProfile) => {
    try {
        const response = await axios.post(`${config.PROFILE}/edit-profile/`, data, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}

export const getProfile: Function = async (data: interfaces.getProfile) => {
    try {
        const response = await axios.get(`${config.PROFILE}/${data.ProfileLink}`, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}

export const getChannel = async (data: interfaces.getChannel) => {
    try {
        const response = await axios.get(`${config.PROFILE}/channel/${data.id ? data.id : ""}`, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}

export const followUser: Function = async (data: interfaces.followUser) => {
    try {
        const response = await axios.post(`${config.PROFILE}/follow/${data.UserId}`, null, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}

export const RemovefollowUser: Function = async (data: interfaces.followUser) => {
    try {
        const response = await axios.post(`${config.PROFILE}/remove/${data.UserId}`, null, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}

export const unFollowUser: Function = async (data: interfaces.followUser) => {
    try {
        console.log(data)
        const response = await axios.post(`${config.PROFILE}/unfollow/${data.UserId}`, null, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data;
    } catch (e) {
        return { message: 'Internal Server Error' }
    }
}


export const createChannel: Function = async (data: interfaces.createChannel): Promise<interfaces.createChannelResponse> => {
    try {
        const form = new FormData()
        form.append('Logo', data.Logo)
        form.append('Name', data.Name)
        form.append('Description', data.Description)
        data.Type.forEach((type) => {
            form.append('Type', type)
        })
        const response = await axios.post(`${config.PROFILE}/createChannel`, form, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data
    } catch (e) {
        return {
            message: 'Internal Server Error',
            status: 500
        }
    }
}

export const editChannel: Function = async (data: interfaces.editChannel): Promise<interfaces.createChannelResponse> => {
    try {
        const response = await axios.post(`${config.PROFILE}/edit-channel`, data, {
            headers: {
                'Authorization': data.token,
            }
        })
        return response.data
    } catch (e) {
        return {
            message: 'Internal Server Error',
            status: 500
        }
    }
}