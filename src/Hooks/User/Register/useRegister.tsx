import { getCookie } from "@/Functions/Cookies";
import { useEssentials } from "../../useEssentials";
import { useEffect, useState } from "react";
import { AuthUser, register } from "@/Store/UserStore/Authentication/AuthSlice";
import { useFormik } from "formik";
import * as Yup from "yup";

export interface RegisterForm {
    Name: string;
    Email: string;
    Password: string;
    ConfirmPassword: string;
    Phone: number | null;
    Profile?: string;
    type?: string;
}

export default function useRegister() {
    const { navigate, dispatch, auth } = useEssentials();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const token: string | undefined = getCookie('token');
        if (token) {
            dispatch(AuthUser({ token })).then((state: any) => {
                if (state.payload.user) {
                    navigate('/');
                }
            });
        }
    }, []);

    const { loading, message } = auth;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const formik = useFormik<RegisterForm>({
        initialValues: {
            Name: "",
            Email: "",
            Password: "",
            ConfirmPassword: "",
            Phone: null
        },
        validationSchema: Yup.object({
            Name: Yup.string().required('Name is required'),
            Email: Yup.string().email('Invalid email address').required('Email is required'),
            Password: Yup.string()
                .matches(
                    passwordRegex,
                    "Password must follow all standard characters"
                )
                .required("Password is required"),
            ConfirmPassword: Yup.string()
                .oneOf([Yup.ref('Password')], 'Passwords must match')
                .required('Confirm Password is required'),
            Phone: Yup.number().required('Phone number is required').lessThan(11)
        }),
        onSubmit: (values, { resetForm }) => {
            const { Name, Email, Password, Phone } = values;
            dispatch(register({ Name, Email, Password, Phone, Type: 'Email' })).then((state: any) => {
                if (state.payload.status === 200) {
                    resetForm();
                }
            });
        }
    });

    const socialMedia = (data: { type: string; user: RegisterForm; }) => {
        const { Email, Name, Password, Profile } = data.user;
        dispatch(register({ Name, Email, Password, Phone: null, Type: data.type, Profile })).then((state: any) => {
            if (state.payload.status === 200) {
                formik.resetForm();
            }
        });
    };

    return { formik, socialMedia, loading, message, showPassword, togglePasswordVisibility };
}
