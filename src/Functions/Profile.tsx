import { editProfilePic } from '@/Store/UserStore/ProfileManagement/ProfileSlice';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { User } from '@/Store/UserStore/Authentication/Interfaces';
import { AppDispatch } from '@/Store/Store';
import { editBanner } from '@/Store/UserStore/ProfileManagement/ProfileSlice';
import { Button } from '@/components/ui/button';


export const handleImages = async (e: React.ChangeEvent<HTMLInputElement>, profile: { Image: File | null; Show: string; }, setProfile: React.Dispatch<React.SetStateAction<{ Image: File | null; Show: string; }>>, user: User | null, dispatch: AppDispatch) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type. Please upload an image.');
            return;
        }

        const handleUpdate = async (t: string | number) => {
            toast.loading("Uploading please wait  ...", { id: 1 })
            toast.dismiss(t)
            const res = await updateImage(file, dispatch)
            if (res) {
                toast.success("Updated successfully", {
                    id: 1
                })
            } else {
                toast.error("Update failed", {
                    id: 1
                })
                setProfile({ ...profile, Show: user ? user.Profile : '' });
            }
        }
        const handleDismiss = (t: string | number) => {
            setProfile({ ...profile, Show: user ? user.Profile : '' });
            toast.dismiss(t)
        }
        reader.onloadend = async () => {
            if (typeof reader.result === 'string') {
                setProfile({ ...profile, Show: reader.result });
                toast.custom((t) => (
                    <div className='w-auto flex items-center justify-center p-2 px-3 rounded-md bg-background gap-2 text-white' >
                        <div className="grid gap-1">
                            <div className="flex items-center">
                                <p className="text-sm font-medium">Update Profile Picture</p>
                            </div>
                        </div>
                        <div className="mt-2 flex space-x-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleUpdate(t)}
                                className="px-3"
                            >
                                Yes
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDismiss(t)}
                                className="px-3"
                            >
                                No
                            </Button>
                        </div>
                    </div>
                ), {
                    duration: Infinity,
                });
            }
        };
        reader.readAsDataURL(file);
    }
};

export const updateImage = async (profile: File, dispatch: AppDispatch): Promise<boolean> => {
    const token = Cookies.get('token');
    if (token) {
        if (profile) {
            dispatch(editProfilePic({ token, Image: profile })).then((response: any) => {
                return response.payload.status === 200
            })
        }
        return false;
    }
    return false;
};
export const updateBanner = async (banner: File, dispatch: AppDispatch): Promise<boolean> => {
    const token = Cookies.get('token');
    if (token) {
        if (banner) {
            dispatch(editBanner({ token, Image: banner })).then((response: any) => {
                return response.payload.status === 200
            })
        }
        return false;
    }
    return false;
};

export const handleBanner = async (e: React.ChangeEvent<HTMLInputElement>, banner: { Image: File | null; Show: string; }, setBanner: React.Dispatch<React.SetStateAction<{ Image: File | null; Show: string; }>>, user: User | null, dispatch: AppDispatch) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type. Please upload an image.');
            return;
        }
        const handleUpdate = async (t: string | number) => {
            toast.loading("Uploading please wait  ...", { id: 1 })
            toast.dismiss(t)
            const res = await updateBanner(file, dispatch)
            if (res) {
                toast.success("Updated successfully", {
                    id: 1
                })
            } else {
                toast.error("Update failed", {
                    id: 1
                })
                setBanner({ ...banner, Show: user ? user.Banner : '' });
            }
        }
        const handleDismiss = (t: string | number) => {
            setBanner({ ...banner, Show: user ? user.Profile : '' });
            toast.dismiss(t)
        }
        reader.onloadend = async () => {
            if (typeof reader.result === 'string') {
                setBanner({ ...banner, Show: reader.result });
                toast.custom((t) => (
                    <div className='w-auto flex items-center justify-center p-2 px-3 rounded-md bg-background gap-2 text-white' >
                        <div className="grid gap-1">
                            <div className="flex items-center">
                                <p className="text-sm font-medium">Update Profile Picture</p>
                            </div>
                        </div>
                        <div className="mt-2 flex space-x-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleUpdate(t)}
                                className="px-3"
                            >
                                Yes
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDismiss(t)}
                                className="px-3"
                            >
                                No
                            </Button>
                        </div>
                    </div>
                ), {
                    duration: Infinity,
                });
            }
        };
        reader.readAsDataURL(file);
    }
};

