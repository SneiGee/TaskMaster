/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { fetchDelete, fetchGet, fetchPost } from "@/lib/contants";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { IoChevronForwardOutline } from "react-icons/io5";
import { 
    AlertDialog, 
    AlertDialogTrigger, 
    AlertDialogContent, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogCancel,
     AlertDialogAction 
} from "../ui/alert-dialog";
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogTitle, 
    DialogDescription 
} from "../ui/dialog";
import { Trash } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { AiFillStar } from "react-icons/ai";
import { BsFillPersonFill, BsClipboardCheck } from "react-icons/bs";
import { BsCheck2Circle } from "react-icons/bs";
import { GiPin } from "react-icons/gi";
import { MdWork, MdOutlineAdd } from "react-icons/md";
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { TaskPriority } from "@/lib/types";

export default function SidePanel({ onPriorityChange }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const [userTaskPriority, setUserTaskPriority] = useState<TaskPriority[]>([]);
    const [collapsed, setCollapsed] = useState(false);
    const [priorityTitle, setPriorityTitle] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [hoveredPriority, setHoveredPriority] = useState("");

    // const handleNavigate = (priority: any) => {
    //     router.push(`/todo/${priority.title}`, { id: priority.id });
    // };

    const getPriority = async () => {
        try {
            const priorities = await fetchGet('/task-priority');
            setUserTaskPriority(priorities);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const createPriority = async () => {
        if (!priorityTitle) {
            toast.error("Please enter a title for the Task Priority.");
            return;
        }
        try {
            await fetchPost('/task-priority', { title: priorityTitle });
            toast.success("Task Priority created");
            onPriorityChange((prev: any) => !prev);
            setPriorityTitle('');
            getPriority();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const deletePriority = async (id: number) => {
        try {
            await fetchDelete(`/task-priority/${id}`);
            toast.success("Task Priority deleted");
            getPriority();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getPriority();
    }, []);


    return (
        <div className="hidden lg:block">
            <Sidebar collapsed={collapsed}>
                <Menu>
                    <MenuItem>
                        <div
                            onClick={() => {
                                setCollapsed(!collapsed);
                            }}
                        >
                            <div
                                className={`flex transition-all duration-300 justify-${collapsed ? "center" : "end"
                                    } flex-1`}
                            >
                                <IoChevronForwardOutline
                                    className={`transition-all duration-300 ${collapsed ? "rotate-0" : "rotate-180"
                                        }`}
                                />
                            </div>
                        </div>
                    </MenuItem>
                    {!collapsed && (
                        <div className="text-sm text-gray-400 ml-6 font-bold my-2">
                            Priorities
                        </div>
                    )}
                    <div
                        className={`w-full ${pathname === "/" ? "bg-blue-100" : ""
                            }`}
                        onClick={() => router.push("/")}
                    >
                        <MenuItem icon={<BsClipboardCheck className="text-gray-800" />}>
                            <div className="font-medium text-gray-700">All Tasks</div>
                        </MenuItem>
                    </div>
                    {userTaskPriority.length > 0 &&
                        userTaskPriority.map((priority) => {
                            return (
                                <div
                                    key={priority.id}
                                    className={`w-full ${pathname === `/todo/${priority.title}`
                                            ? "bg-blue-100"
                                            : ""
                                        }`}
                                    onMouseEnter={() => setHoveredPriority(priority.title)}
                                    onMouseLeave={() => setHoveredPriority("")}
                                    onClick={() => router.push(`/todo/${priority.title}`)}
                                >
                                    <MenuItem
                                        icon={
                                            priority.title === "High Priority" ? (
                                                <AiFillStar className="text-yellow-500" />
                                            ) : priority.title === "Normal Priority" ? (
                                                <MdWork className="text-amber-950" />
                                            ) : priority.title === "Low Priority" ? (
                                                <BsFillPersonFill className="text-blue-500" />
                                            ) : (
                                                <GiPin className="text-red-700" />
                                            )
                                        }
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium text-gray-700">
                                                {priority.title}
                                            </div>
                                            {hoveredPriority === priority.title &&
                                                priority.title !== "High Priority" &&
                                                priority.title !== "Normal Priority" &&
                                                priority.title !== "Low Priority" && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Trash className="w-3 h-3 hover:text-red-800" />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Are you absolutely sure?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will
                                                                    permanently delete your priority
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deletePriority(priority.id)}
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                        </div>
                                    </MenuItem>
                                </div>
                            );
                        })}
                    <div
                        className={`w-full ${pathname === "/completed" ? "bg-blue-100" : ""
                            }`}
                        onClick={() => {
                            if (pathname !== "/completed") router.push("/completed");
                        }}
                    >
                        <MenuItem icon={<BsCheck2Circle className="text-green-600" />}>
                            <div className="font-medium text-gray-700">Completed Tasks</div>
                        </MenuItem>
                    </div>

                    <hr className="my-6" />
                    <Dialog
                        open={openDialog}
                        onOpenChange={() => setOpenDialog((prev) => !prev)}
                    >
                        <DialogTrigger asChild>
                            <MenuItem
                                icon={<MdOutlineAdd className="text-blue-600 text-xl" />}
                            >
                                <span className="font-normal text-blue-600 cursor-pointer">
                                    New Priority
                                </span>
                            </MenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Priority</DialogTitle>
                                <DialogDescription>
                                    To better organize your tasks, create priority according to
                                    your preferences.
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                <Input
                                    id="title"
                                    placeholder="Category title"
                                    className="mt-5"
                                    onChange={(e) => setPriorityTitle(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setOpenDialog(false);
                                        createPriority();
                                    }}
                                    className="w-full"
                                >
                                    Create
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Menu>
            </Sidebar>
        </div>
    );
};
 