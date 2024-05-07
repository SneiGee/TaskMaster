"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVER_ENDPOINT } from "@/lib/contants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ActivateAccount() {
    // const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT;

    const [activationCode, setActivationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleActivation = async () => {
        if (activationCode.length !== 6) {
            toast.error("Please enter a valid 6-digit activation code.");
            return;
        }
        setIsLoading(true);
        try {
            const url = new URL(`${SERVER_ENDPOINT}/auth/activate-account`);
            url.searchParams.append('token', activationCode);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ code: activationCode }),
            });
            if (response.ok) {
                toast.success("Your account has been successfully activated!");
                router.push('/login'); 
            } else if (response.status === 410) { // 410 Gone is often used for expired resources
                const data = await response.json();
                toast.error(data.message || "Activation code expired. A new code has been sent to your email.");
            } else if (response.status === 409) {
                toast.error("This account is already activated. Please log in.");
                router.push('/login'); // Redirect to login page
            } else {
                throw new Error('Activation failed. Please try again.');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Network error";
            toast.error("An error occurred during activation: " + message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Activate your Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter the activation code sent to your email.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="activation-code" className="sr-only">
                                Activation Code
                            </label>
                            <Input
                                id="activation-code"
                                name="code"
                                type="text"
                                autoComplete="off"
                                required
                                placeholder="Enter your activation code"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="button"
                            onClick={handleActivation}
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isLoading ? 'Activating...' : 'Activate Account'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}