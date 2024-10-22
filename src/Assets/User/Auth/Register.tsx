import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react";
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
import useRegister from "@/Hooks/User/Register/useRegister";
import Preloader from "@/Assets/Preloader";

export default function RegisterComponent() {
    const { formik, showPassword, socialMedia, togglePasswordVisibility, loading } = useRegister();

    return (
        <div className="min-h-screen px-1 bg-gray-200 dark:bg-transparent relative flex items-center flex-col font-semibold justify-center">
            {loading && <Preloader />}
            <Card className="w-full bg-blue-light dark:bg-background dark:bg-opacity-70 mb-2 animate-slideInFromLeft max-w-lg">
                <CardHeader className="space-y-3">
                    <div className="mx-auto text-center w-1/2">
                        <div className="w-full">
                            <img src={"/Logo.png"} className='w-24 h-24 rounded-full border-violet shadow-lg bg-white justify-center mt-4 shadow-red-700 inline-block' alt="" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl dark:text-white font-bold text-center">
                        Welcome to Xoro
                    </CardTitle>
                </CardHeader>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300" htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="Name"
                                placeholder="John Doe"
                                className="pl-3 dark:text-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.Name}
                            />
                            {formik.touched.Name && formik.errors.Name ? (
                                <p className="text-accent ml-4 mt-1 text-sm">{formik.errors.Name}</p>
                            ) : null}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300" htmlFor="email">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className={`absolute left-3 ${formik.touched.Email && formik.errors.Email ? "top-1/3" : "top-1/2"} transform -translate-y-1/2 text-gray-500 dark:text-gray-200`} />
                                <Input
                                    id="email"
                                    name="Email"
                                    placeholder="m@example.com"
                                    type="email"
                                    className="pl-10 dark:text-white"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Email}
                                />
                                {formik.touched.Email && formik.errors.Email ? (
                                    <p className="text-accent ml-4 mt-1 text-sm">{formik.errors.Email}</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300" htmlFor="phone">
                                Phone
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-200" />
                                <Input
                                    id="phone"
                                    name="Phone"
                                    placeholder="+123456789"
                                    type="tel"
                                    className="pl-10 dark:text-white"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Phone || ''}
                                />
                                {formik.touched.Phone && formik.errors.Phone ? (
                                    <p className="text-accent ml-4 mt-1 text-sm">{formik.errors.Phone}</p>
                                ) : null}
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300" htmlFor="password">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className={`absolute left-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-200 ${formik.errors.Password && formik.touched.Password ? "top-[17px]" : "top-1/2"}`} />
                                <Input
                                    id="password"
                                    name="Password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10 dark:text-white"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Password}
                                />
                                {formik.touched.Password && formik.errors.Password ? (
                                    <p className="text-accent mt-1 ml-4 text-sm">{formik.errors.Password}</p>
                                ) : null}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={`absolute right-0 h-full px-3 py-2 hover:bg-transparent ${formik.errors.Password && formik.touched.Password ? "top-[-10px]" : "top-0"}`}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className={`h-4 w-4 text-gray-500 dark:text-gray-200`} />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <Label className="dark:text-gray-300" htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="ConfirmPassword"
                                type={showPassword ? "text" : "password"}
                                className="pl-3 dark:text-white"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.ConfirmPassword}
                            />
                            {formik.touched.ConfirmPassword && formik.errors.ConfirmPassword ? (
                                <p className="text-accent ml-4 mt-1 text-sm">{formik.errors.ConfirmPassword}</p>
                            ) : null}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full font-semibold hover:bg-primary-dark text-white">
                            Register
                        </Button>
                        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary underline hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                            >
                                Login
                            </Link>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <Google socialMedia={socialMedia} />
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
