import axios from 'axios';
import * as interfaces from './Interfaces';
import config from '@/Configs/config';


export const uploadVideo = async ({
    Caption,
    Description,
    Duration,
    Hashtags,
    RelatedTags,
    Restriction,
    Settings,
    Thumbnail,
    Video,
    token,
}: interfaces.uploadVideo): Promise<interfaces.uploadVideoResponse> => {
    try {
        const form = new FormData();
        form.append('Thumbnail', Thumbnail)
        form.append('Caption', Caption);
        form.append('Description', Description);
        form.append('Duration', Duration);
        Hashtags.forEach((tag) => {
            form.append('Hashtags[]', tag);
        });
        form.append('RelatedTags', RelatedTags);
        form.append('Restriction', Restriction.toString());
        form.append('Settings[CommentsOn]', Settings.CommentsOn.toString());
        form.append('Settings[PremiumContent]', Settings.PremiumContent.toString());
        form.append('Settings[ListedContent]', Settings.ListedContent.toString());
        form.append('Video', Video)

        const response = await axios.post(`${config.VIDEO}/upload`, form, {
            headers: {
                'Authorization': `${token}`
            }
        })
        return response.data
    } catch (e) {
        console.error('Error uploading video:', e);
        return {
            status: 500,
            message: 'Internal Server Error'
        };
    }
};

export const getVideos = async ({ token, random, skip }: interfaces.getVideos) => {
    try {
        const response = await axios.get(`${config.VIDEO}/${skip}?random=${random}`, {
            headers: {
                'Authorization': `${token}`
            },
        })
        return response.data
    } catch (e) {
        console.error('Error Getting video:', e);
        return {
            status: 500,
            message: 'Internal Server Error'
        };
    }
}

export const getVideo = async ({ token, VideoLink }: interfaces.getVideo) => {
    try {
        const response = await axios.get(`${config.VIDEO}/video/${VideoLink}`, {
            headers: {
                'Authorization': `${token}`
            },
        })
        return response.data
    } catch (e) {
        console.error('Error Getting video:', e);
        return {
            status: 500,
            message: 'Internal Server Error'
        };
    }
}