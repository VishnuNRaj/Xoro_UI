import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Google from "./Google";
import useLogin from "@/Hooks/User/Login/useLogin";
import Preloader from "@/Assets/Preloader";

export default function LoginComponent() {
  const {
    formik,
    showPassword,
    socialMedia,
    togglePasswordVisibility,
    loading,
  } = useLogin();

  return (
    <div className="min-h-screen px-1 bg-gray-200 dark:bg-transparent relative flex items-center flex-col font-semibold justify-center">
      {loading && <Preloader />}
      <Card className="w-full bg-blue-light dark:bg-background dark:bg-opacity-70  animate-slideInFromLeft max-w-md">
        <CardHeader className="space-y-3">
          <div className="mx-auto text-center w-1/2">
            <div className="w-full">
              <img
                src={"/Logo.png"}
                className="w-24 h-24 rounded-full border-violet shadow-lg bg-white justify-center mt-4 shadow-red-700 inline-block"
                alt=""
              />
            </div>
          </div>
          <CardTitle className="text-2xl dark:text-white font-bold text-center">
            Welcome to Xoro
          </CardTitle>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="dark:text-gray-300" htmlFor="email">
                Email
              </Label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 ${
                    formik.touched.email && formik.errors.email
                      ? "top-1/3"
                      : "top-1/2"
                  } transform -translate-y-1/2 text-gray-500 dark:text-gray-200`}
                />
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  type="email"
                  className="pl-10 dark:text-white"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-accent ml-4 mt-1 text-sm">
                    {formik.errors.email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="dark:text-gray-300" htmlFor="password">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-200 ${
                    formik.errors.password && formik.touched.password
                      ? "top-[17px]"
                      : "top-1/2"
                  }`}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 dark:text-white"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <p className="text-accent mt-1 ml-4 text-sm">
                    {formik.errors.password}
                  </p>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`absolute right-0 h-full px-3 py-2 hover:bg-transparent ${
                    formik.errors.password && formik.touched.password
                      ? "top-[-10px]"
                      : "top-0"
                  }`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff
                      className={`h-4 w-4 text-gray-500 dark:text-gray-200`}
                    />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full font-semibold hover:bg-primary-dark text-white"
            >
              Login
            </Button>
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary underline hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
              >
                Sign up
              </Link>
            </div>
            <div className="w-full flex items-center justify-center ">
              <Google socialMedia={socialMedia} />
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
