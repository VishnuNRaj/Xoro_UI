import { useEffect, useState, ChangeEvent } from "react";
import { verifyAccount, AddProfilePic } from "@/Store/UserStore/Authentication/AuthSlice";
import { useParams } from "react-router-dom";
import { useToast } from "@/Functions/Cookies";
import { useEssentials } from "@/Hooks/useEssentials";


function useVerify() {
    const { UserId, VerificationLink } = useParams();
    const [Profile, setProfile] = useState<File | null>(null);
    const [RememberMe, setRememberMe] = useState<boolean>(true);
    const [show, setShow] = useState<string>('');
    const [Username, setUsername] = useState<string>('');
    const { dispatch, navigate } = useEssentials()
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file: File = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                return useToast('Please Upload Image Files', "error");
            }
            setProfile(file);
            const reader = new FileReader();
            reader.onload = function (e) {
                const target = e.target as FileReader;
                if (target.result) {
                    setShow(target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (UserId && VerificationLink) {
            dispatch(verifyAccount({ UserId, VerificationLink })).then((state: any) => {
                if (state.payload.user) {
                    const data = state.payload.user;
                    setUsername(data.Username);
                    setShow(data.Profile);
                } else {
                    useToast(state.payload.message, 'error');
                }
            });
        }
    }, [dispatch, UserId, VerificationLink]);

    const updateAll = async () => {
        try {
            const usernameRegex = /^[a-z0-9_.-]+$/;
            if (!usernameRegex.test(Username)) {
                return useToast('Enter Username Properly', "error");
            }
            const data = {
                Username: Username,
                Profile: Profile ? Profile : show,
                UserId: UserId,
                RememberMe: RememberMe
            };
            if (Username && show && UserId) {
                dispatch(AddProfilePic(data)).then((state: any) => {
                    let toastify = 'error';
                    if (state.payload.status === 200) {
                        toastify = 'success';
                    }
                    useToast(state.payload.message, toastify);
                    if (state.payload.status === 200) {
                        return navigate('/');
                    }
                });
            }
        } catch (e) {
            return false;
        }
    };
    return { updateAll, handleChange, RememberMe, setRememberMe, Profile, show, Username, setUsername }
}

export default useVerify