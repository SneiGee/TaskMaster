"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { CiStickyNote } from "react-icons/ci";
import { toast } from "react-hot-toast";
import { SERVER_ENDPOINT } from "@/lib/contants";

interface LoginProps {
  redirected?: string;
  logout?: string;
}

export default function Login({ redirected, logout }: LoginProps) {
  // const SERVER_ENDPOINT = SERVER_ENDPOINT;

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.email);
        router.push("/");
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      // Check if err is an instance of Error and then access message
      const message = err instanceof Error ? err.message : "Network error";
      toast.error("Ooh Login failed: " + message);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (redirected) {
      toast.error("Please login to continue");
    } else if (logout) {
      toast.success("Logged out successfully");
    }
  }, [redirected, logout]);

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
          <div className="text-center text-2xl mb-8 lg:mb-12 font-medium">Log in to your account</div>
          <div className="flex flex-col gap-y-6 px-8 lg:px-12">
            <Input onChange={(e) => setEmail(e.target.value)} id="email" type="text" placeholder="Email" />
            <div className="flex rounded-md border border-slate-400">
              <Input onChange={(e) => setPassword(e.target.value)} id="password" type={viewPassword ? "text" : "password"} placeholder="Password" className="border-transparent text-base text-body-color placeholder-body-color shadow-one outline-none focus-visible:shadow-none" />
              {password && (
                <button 
                  type="button" 
                  onClick={() => setViewPassword(!viewPassword)} 
                  className="rounded-md rounded-l-none bg-white"
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
            <div className="flex justify-center">
              <Button onClick={login} disabled={isLoading} className="col-start-2 px-16" type="submit">
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">Need an account?</div>
              <button onClick={() => router.push("/register")} className="hover:underline text-blue-600 font-medium">Sign up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
