import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@radix-ui/react-menubar";
import { useRouter } from "next/navigation";
import { CiStickyNote } from "react-icons/ci";
import { Button } from "../ui/button";
import  React, { useEffect, useState }  from "react";

export default function Navbar() {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    const router = useRouter();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null)
        router.push('/login');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
    }, []);

    return (
        <div className="flex justify-between items-center border-b bg-gray-900 border-b-black py-2 px-4 lg:p-4 lg:px-24">
            <button
                className="font-black flex gap-x-2 items-center font-mono text-2xl text-white"
                onClick={() => router.push('/')} // Using Next.js router to navigate
            >
                <p>TaskMaster</p>
                <CiStickyNote />
            </button>
            <div className="mr-12 lg:mr-2">
                {token ? (
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="cursor-pointer">
                                {user}
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                ) : (
                    <Button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="bg-white text-black hover:bg-slate-200"
                    >
                        Login
                    </Button>
                )}
            </div>
        </div>
    );
}