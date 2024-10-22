import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { createChannel } from '@/Store/UserStore/ProfileManagement/ProfileSlice';
import { getCookie, useToast } from '@/Functions/Cookies';
import useCategory from '@/Hooks/useCategory';
import { useEssentials } from '@/Hooks/useEssentials';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

interface stateProps {
    Name: string;
    Description: string;
    Type: string[];
    Logo: File | null;
}

export default function useCreateChannel({ setOpen }: Props) {
    const { navigate, dispatch, profile } = useEssentials()
    const { category, getAllCategory } = useCategory()
    useEffect(() => {
        getAllCategory()
    }, [])
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { loadingProfile } = profile
    const [state, setState] = useState<stateProps>({
        Name: '',
        Description: '',
        Type: [],
        Logo: null
    })

    const create = () => {
        const { Name, Logo, Description, Type } = state
        if (!Name || !Logo) {
            useToast('Enter Channel Details Properly', 'error')
        }
        const token: string | undefined = getCookie('token')
        if (token && Logo) {
            dispatch(createChannel({ Name, Logo, Description, Type, token })).then((state: any) => {
                if (state.payload.status === 202) {
                    navigate('/login')
                }
                useToast(state.payload.message, 'success')
                if (state.payload.status == 200) setOpen(false)

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
    return { handleChange, handleCheckboxChange, create, loadingProfile, category, inputRef,state,setState }
}