import { getCookie, useToast } from '@/Functions/Cookies';
import useCategory from '@/Hooks/useCategory';
import { useEssentials } from '@/Hooks/useEssentials';
import { useSocket } from '@/Hooks/useSocket';
import { getChannelBase } from '@/Store/UserStore/CommonManagements/CommonService';
import { editChannel } from '@/Store/UserStore/ProfileManagement/ProfileService';
import { Channel } from '@/Store/UserStore/Video-Management/Interfaces';
import React, { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client';
import { toast } from 'sonner'

interface stateProps {
    Name: string;
    Description: string;
    Type: string[];
    Logo: string | null;
}
let fileData: File | null = null

export default function useEditChannel() {
    const socket = useSocket()
    const { navigate, dispatch, profile } = useEssentials()
    const [soc, setSoc] = useState<Socket | null>(null)
    const { category, getAllCategory } = useCategory()
    useEffect(() => {
        getAllCategory()
        setSoc(socket)
        getChannel()
    }, [])

    useEffect(() => {
        if (soc) {
            soc.on("getChannel", (data) => {
                console.log(data)
            })
        }
    }, [soc])
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { loadingProfile } = profile
    const [state, setState] = useState<stateProps>({
        Name: '',
        Description: '',
        Type: [],
        Logo: null
    })
    const getChannel = async () => {
        const token: string | undefined = getCookie("token")
        if (token) {
            const response = await getChannelBase({ token })
            if (response.status !== 200) {
                toast.error(response.message)
            } else {
                const channel: Channel = response.channel
                console.log(channel)
                setState({
                    Name: channel.Name,
                    Description: channel.Description,
                    Logo: channel.Logo,
                    Type: channel.Type
                })
            }
        }
    }
    const create = () => {
        const { Name, Logo, Description, Type } = state
        if (!Name || !Logo) {
            useToast('Enter Channel Details Properly', 'error')
        }
        const token: string | undefined = getCookie('token')
        if (token) {
            dispatch(editChannel({ Name, Logo: fileData ? Logo : null, Description, Type, token })).then((state: any) => {
                if (state.payload.status === 202) {
                    navigate('/login')
                }
                toast[state.payload.status === 200 ? "success" : "error"](state.payload.message)
            })
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const handleCheckboxChange = (data: string) => {
        setState((prevState) => {
            const updatedType = prevState.Type.includes(data)
                ? prevState.Type.filter((val) => val !== data)
                : [...prevState.Type, data];
            return { ...prevState, Type: updatedType };
        });
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0].type.split('/')[0] !== 'image') {
            useToast('Select a proper image', 'error');
            return;
        }
        if (files && files[0]) {
            const file = files[0];
            fileData = file;
            const reader = new FileReader();
            reader.onloadend = () => {
                setState({ ...state, Logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    return { handleChange, handleFileChange, inputRef, create, handleCheckboxChange, loadingProfile, category, state, setState }
}