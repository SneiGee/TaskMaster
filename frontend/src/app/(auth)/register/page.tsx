/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVER_ENDPOINT } from "@/lib/contants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { CiStickyNote } from "react-icons/ci";

export default function register() {
    // const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT;
    
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [viewCPassword, setViewCPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const register = async () => {
        if (password !== cpassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const response = await fetch(`${SERVER_ENDPOINT}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password
                })
            });

            if (response.ok) {
                router.push("/activation-sent");
                toast.success("Registration successful! Check your email to activate your account.");
            } else {
                throw new Error('Registration failed');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Network error";
            toast.error("Registration failed: " + message);
        } finally {
            setIsLoading(false); // End loading
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col min-w-screen justify-center">
            <div className="w-full md:w-2/3 lg:w-3/5 xl:w-1/3 mx-auto lg:border lg:rounded-lg lg:shadow-lg lg:bg-white">
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="fixed top-5 left-5 flex gap-x-2 items-center text-center font-mono text-3xl mb-4 lg:mb-8 font-medium"
                >
                    <p>TaskMaster</p>
                    <CiStickyNote />
                </button>
                <div className="lg:m-16">
                    <div className="text-center text-2xl mb-8 lg:mb-12 font-medium">
                        Create your account
                    </div>
                    <div className="flex flex-col gap-y-6 px-8 lg:px-12">
                        <div className="">
                            <Input
                                onChange={(e) => setFirstname(e.target.value)}
                                id="firstname"
                                type="text"
                                placeholder="First Name"
                            />
                        </div>
                        <div className="">
                            <Input
                                onChange={(e) => setLastname(e.target.value)}
                                id="lastname"
                                type="text"
                                placeholder="Last Name"
                            />
                        </div>
                        <div className="">
                            <Input
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                placeholder="Email"
                            />
                        </div>
                        <div className="flex rounded-md border border-slate-400">
                            <Input
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                type={`${viewPassword ? "text" : "password"}`}
                                placeholder="Password"
                                className="border border-transparent text-base text-body-color placeholder-body-color shadow-one outline-none focus-visible:shadow-none"
                            />
                            {password && (
                                <button
                                    type="button"
                                    onClick={() => setViewPassword(!viewPassword)}
                                    className="rounded-md rounded-l-none bg-white focus:outline-none"
                                    aria-label={viewPassword ? "Hide password" : "Show password"}
                                >
                                    {viewPassword ? (
                                        <AiOutlineEyeInvisible className="mr-3 w-5 h-5 text-gray-600" />
                                    ) : (
                                        <AiOutlineEye className="mr-3 w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="flex rounded-md border border-slate-400">
                            <Input
                                onChange={(e) => setCPassword(e.target.value)}
                                id="cpassword"
                                type={`${viewCPassword ? "text" : "password"}`}
                                placeholder="Confirm Password"
                                className="border border-transparent text-base text-body-color placeholder-body-color shadow-one outline-none focus-visible:shadow-none"
                            />

                            {cpassword && (
                                <button
                                    type="button"
                                    onClick={() => setViewCPassword(!viewCPassword)}
                                    className="rounded-md rounded-l-none bg-white focus:outline-none"
                                    aria-label={viewCPassword ? "Hide password" : "Show password"}
                                >
                                    {viewCPassword ? (
                                        <AiOutlineEyeInvisible className="mr-3 w-5 h-5 text-gray-600" />
                                    ) : (
                                        <AiOutlineEye className="mr-3 w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <Button 
                                onClick={register} 
                                disabled={isLoading || !firstname || !lastname || !email || !password || !cpassword} 
                                className="px-16" 
                                type="submit"
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-500">Already have an account?</div>
                            <button
                                onClick={() => router.push("/login")}
                                className="hover:underline text-blue-600 font-medium"
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}