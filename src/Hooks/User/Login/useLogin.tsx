import { AuthUser, login } from "@/Store/UserStore/Authentication/AuthSlice";
import { useEffect, useState } from "react";
import { useEssentials } from "../../useEssentials";
import { getCookie, setCookie, useToast } from "@/Functions/Cookies";
import { useFormik } from "formik";
import * as Yup from "yup";
import { encryptUserID } from "@/Functions/Encrypt";
import { toast } from "sonner";

export interface LoginFormInterface {
  Email: string;
  Password: string;
}

export interface ErrorForm {
  Email: string;
  Password: string;
}

export interface LoginValidation {
  status: boolean;
  ErrorForm: ErrorForm;
}

export default function useLogin() {
  const { dispatch, navigate, auth } = useEssentials();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const socialMedia = (data: { type: string; user: LoginFormInterface }) => {
    const { Email, Password } = data.user;
    dispatch(login({ Email, Password, Type: data.type })).then((state: any) => {
      const userId = "";
      if (state.payload.status === 200) {
        toast.success(state.payload.message);
        return navigate("/otp/" + userId);
      }
      if (state.payload.status === 210) {
        setCookie(state.payload.message, "token");
        navigate("/");
      } else toast.warning(state.payload.message);
    });
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      dispatch(AuthUser({ token })).then((state: any) => {
        if (state.payload.user) {
          navigate("/");
        }
      });
    }
  }, [dispatch, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .matches(passwordRegex, "Password must follow all standard characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      userLogin({ Email: values.email, Password: values.password });
    },
  });
  const userLogin = async ({ Email, Password }: LoginFormInterface) => {
    dispatch(login({ Email, Password, Type: "Email" })).then((state: any) => {
      let userId = "";
      let toastify = "error";
      if (state.payload.status === 200) {
        toastify = "success";
        userId = state.payload.user._id
          ? encryptUserID(state.payload.user._id)
          : "";
        navigate("/otp/" + userId);
      }
      if (state.payload.status === 210) {
        setCookie(state.payload.message, "token");
        console.log(getCookie("token"));
        navigate("/");
      }
      state.payload.status !== 210 && useToast(state.payload.message, toastify);
    });
  };
  return {
    formik,
    socialMedia,
    togglePasswordVisibility,
    showPassword,
    userLogin,
    loading: auth.loading,
  };
}
