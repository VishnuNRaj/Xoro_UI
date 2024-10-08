import axios from "axios";
import * as interfaces from "./Interfaces";
import config from "@/Configs/config";


export const addPost: Function = async (data: interfaces.addPost): Promise<interfaces.addPostResponse> => {
    try {
        const form = new FormData();

        form.append('Caption', data.Caption);
        data.Hashtags.forEach((tag, index) => {
            form.append(`HashTags${index}`, tag);
        });
        data.Tags.forEach((tag, index) => {
            form.append(`Tags${index}`, tag);
        });

        data.Images.forEach((media) => {
            form.append(`Media`, media);
        });

        const response = await axios.post(`${config.POST}/add-post`, form, {
            headers: {
                Authorization: `${data.token}`,
            }
        });
        return response.data
    } catch (e) {
        return <interfaces.addPostResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const showPost: Function = async (data: interfaces.showPost): Promise<interfaces.showPostResponse> => {
    try {
        const response = await axios.get(`${config.POST}/`, {
            headers: {
                Authorization: `${data.token}`,
            }
        });
        return response.data
    } catch (e) {
        return <interfaces.showPostResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const getPosts: Function = async (data: interfaces.getPosts): Promise<interfaces.getPostsResponse> => {
    try {
        const response = await axios.get(`${config.POST}/${data.skip}`, {
            headers: {
                Authorization: `${data.token}`,
            }
        });
        return response.data
    } catch (e) {
        return <interfaces.getPostsResponse>{
            message: 'Internal Server Error',
        }
    }
}

export const deletePost: Function = async (data: interfaces.deletePost) => {
    try {
        const response = await axios.get(`${config.POST}/delete/${data.PostId}`, {
            headers: {
                Authorization: `${data.token}`,
            }
        });
        return response.data
    } catch (e) {
        return <interfaces.deletePostResponse>{
            message: 'Internal Server Error',
            status: 500,
        }
    }
}

export const getPost: Function = async (data: interfaces.getPost) => {
    try {
        const response = await axios.get(`${config.POST}/find/${data.id}`, {
            headers: {
                Authorization: `${data.token}`,
            }
        });
        return response.data
    } catch (e) {
        return <interfaces.getPostResponse>{
            message: 'Internal Server Error',
            status: 500,
        }
    }
}

export const LikeDislikeRemove: Function = async ({ postId, type, token, base }: interfaces.likeDislikeRemove) => {
    try {
        const response = await axios.patch(`${config.BASE}/${base}/reactions/${type}/${postId}`, null, {
            headers: {
                Authorization: token
            },
        })
        return response.data
    } catch (e) {
        return {
            message: "Internal Server Error",
            status: 500,
        }
    }
}