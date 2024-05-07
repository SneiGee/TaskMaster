/* eslint-disable no-unused-vars */
"use client";
import "./sidebar.css";
import React, { useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import { fetchDelete, fetchGet, fetchPost } from "@/lib/contants";
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
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useState } from "react";
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

export default function Sidebar() {
    const router = useRouter();
    const [userTaskPriority, setUserTaskPriority] = useState<TaskPriority[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [priorityTitle, setPriorityTitle] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleIsOpen = () => {
        setOpen(!isOpen);
    };

    const closeSideBar = () => {
        setOpen(false);
    };

    return (
        <Menu right isOpen={isOpen} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}>
            <div
                onClick={() => {
                    if (location.pathname !== "/") router.push("/");
                    closeSideBar();
                }}
                className={`w-full flex items-center gap-x-2`}
                >
                <BsClipboardCheck className="inline mr-2 text-gray-800 text-xl pb-0.5" />
                <div className="menu-item inline font-medium text-gray-700">
                    All Tasks
                </div>
            </div>
            {userTaskPriority.map((priority) => (
                <div key={priority.id} className="w-full flex justify-between items-center gap-x-2">
                    <div className="inline" onClick={() => router.push(`/todo/${priority.title}`)}>
                        {priority.title === 'High Priority' ? <AiFillStar className="inline mr-2 text-yellow-500 text-xl pb-0.5" /> :
                            priority.title === 'Normal Priority' ? <MdWork className="text-amber-950 text-xl" /> :
                                priority.title === 'Low Priority' ? <BsFillPersonFill className="text-blue-500 text-xl" /> :
                                    <GiPin className="text-red-700 text-xl" />}
                        <span>{priority.title}</span>
                    </div>
                    {priority.title !== 'High Priority' && priority.title !== 'Normal Priority' && priority.title !== 'Low Priority' && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button><Trash className="text-red-800" /></button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deletePriority(priority.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            ))}
            <div
                onClick={() => {
                    router.push("/completed");
                    closeSideBar();
                }}
                className={`w-full flex items-center gap-x-2`}
            >
                <BsCheck2Circle className="inline mr-2 text-green-600 text-xl pb-0.5" />
                <div className="menu-item inline font-medium text-gray-700">
                    Completed Tasks
                </div>
            </div>
            <hr className="my-6" />
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-x-2">
                        <MdOutlineAdd className="text-blue-600 text-xl" />
                        <span>New Task Priority</span>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Priority</DialogTitle>
                        <DialogDescription>Enter a name for your new priority.</DialogDescription>
                    </DialogHeader>
                    <Input value={priorityTitle} onChange={(e) => setPriorityTitle(e.target.value)} placeholder="Priority title" className="mt-5" />
                    <DialogFooter>
                        <Button onClick={createPriority} className="w-full">Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Menu>
    );
}
