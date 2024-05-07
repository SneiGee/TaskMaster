"use client";
import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { cn } from "../lib/utils";
import { FcOk } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { BiChevronsRight } from "react-icons/bi";
import { useEffect, useState } from "react";
import { fetchDelete, fetchGet, fetchPost, fetchPut } from "@/lib/contants";
import SidePanel from "@/components/sidepanel/sidepanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AiOutlineClockCircle, AiTwotoneCalendar } from "react-icons/ai";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { BsCheck2, BsCheck2Circle } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import { Task, TaskPriority } from "@/lib/types";

export default function Home() {
  const today = new Date();
  const beforeToday = { before: today };
  const router = useRouter();
  
  const [pending, setPending] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [task, setTask] = useState<any>({});
  const [priorities, setPriorities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedPriorityTitle, setSelectedPriorityTitle] = useState("");

  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDate, setUpdateDate] = useState<Date | undefined>(undefined);
  const [updateDescription, setUpdateDescription] = useState("");
  const [updatePriority, setUpdatePriority] = useState("");
  const [updatePriorityTitle, setUpdatePriorityTitle] = useState("");

  const [priorityChange, setPriorityChange] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [updateCalendarOpen, setUpdateCalendarOpen] = useState(false);
  const [updatePriorityOpen, setUpdatePriorityOpen] = useState(false);

  // Fetch Tasks
  const getTasks = async () => {
    try {
      const data = await fetchGet('/task');
      setTasks(data.filter((task: any) => !task.isCompleted));
    } catch (error: any) {
      toast.error('Failed to fetch tasks: ' + error.message);
    }
  }

  // Fetch a specific task
  const getTask = async (id: string) => {
    try {
      const data = await fetchGet(`/task/${id}`);
      setTask(data);
    } catch (error: any) {
      toast.error('Failed to fetch task: ' + error.message);
    }
  };

  // Get priorities
  const getPriority = async () => {
    try {
      const data = await fetchGet('/task-priority');
      console.log(data);
      setPriorities(data);
    } catch (error: any) {
      console.error('Failed to fetch priorities:', error.message);
      toast.error('Failed to fetch priorities: ' + error.message);
      setPriorities([]);
    }
  };

  // Add Task
  const addTask = async () => {
    if (!title || !date) {
      toast.error('Title and date are required.');
      return;
    }

    const data = {
      title,
      dueDate: date,
      description,
      category: selectedPriority ? {
        id: selectedPriority,
        name: selectedPriorityTitle,
      } : undefined,
    };

    try {
      await fetchPost('/task', data);
      toast.success('Task added');
      setTitle('');
      setDate(undefined);
      setDescription('');
      setSelectedPriority('');
      setSelectedPriorityTitle('');
      getTasks();
    } catch (error: any) {
      toast.error('Failed to add task: ' + error.message);
    }
  }

  // Complete task
  const completeTask = async (id: string) => {
    try {
      await fetchPut(`/task/${id}/markcomplete`, {});
      toast.success('Task marked as completed');
      getTasks();
    } catch (error: any) {
      toast.error('Failed to mark task as completed: ' + error.message);
    }
  };

  // Update task
  const updateTask = async (id: string) => {
    try {
      const updatedTask = {
        title: updateTitle || task.title,
        dueDate: updateDate ? updateDate : task.dueDate,
        description: updateDescription || task.description,
        taskPriority: updatePriority ? {
          id: updatePriority ? updatePriority : task.id,
          name: updatePriorityTitle ? updatePriorityTitle : task.taskPriority.title,
        } : undefined
      };

      await fetchPut(`/task/${id}`, updatedTask);
      toast.success('Task updated successfully!');
      setTask({});

      setUpdateTitle("");
      setUpdateDate(undefined);
      setUpdateDescription("");
      setUpdatePriority("");
      getTasks();
    } catch (error: any) {
      toast.error('Failed to update task: ' + error.message);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await fetchDelete(`/task/${id}`);
      toast.success('Task deleted successfully!');
      getTasks();
    } catch (error: any) {
      toast.error('Failed to delete task: ' + error.message);
    }
  };

  // Filter priorities based on search term
  const filteredPriorities = priorities.filter(priority =>
    priority.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getTasks();
    getPriority();
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    // if (location.state === "login") {
    //   toast.success("Logged in successfully");
    // }
    // if (location.state === "categoryDeleted") {
    //   toast.success("Category deleted");
    // }
  }, []);

  useEffect(() => {
    getPriority();
  }, [priorityChange]);

  return (
    <div className="flex flex-col h-screen max-w-screen">

      <Navbar />
      <div className="flex flex-1 relative">
        <SidePanel onPriorityChange={setPriorityChange} />
        <div className="flex flex-col w-full">
          <div className="bg-gray-50 pt-4 lg:pt-8 px-4 lg:px-12 flex gap-x-2 items-center">
            <p className="text-lg lg:text-2xl">All Tasks</p>
            <BiChevronsRight className="text-md lg:text-xl" />
          </div>
          <div className="grid grid-cols-1 gap-x-24 pt-4 lg:pt-8 px-2 lg:px-12 bg-gray-50 flex-1">
            <div>
              <div className="lg:flex lg:flex-col gap-y-2 m-4 p-2 shadow-md my-6 pt-5 rounded-md bg-white">
                <div className="px-4 lg:px-10 lg:flex gap-x-4 items-center">
                  <input
                    type="text"
                    value={title}
                    placeholder="Add new task"
                    className="w-full outline-none ring-0 border-none"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="flex gap-x-4 items-center justify-between mt-4 lg:mt-0">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full lg:w-[280px] text-sm justify-center text-left font-normal ${
                            !date && "text-muted-foreground"
                          }`}
                        >
                          <AiTwotoneCalendar className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          defaultMonth={today}
                          mode="single"
                          disabled={beforeToday}
                          selected={date}
                          onSelect={(newDate) => {
                            if (newDate) {
                              setDate(newDate);
                              setCalendarOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => addTask()}
                    >
                      <BsCheck2 className="text-3xl text-blue-600 hover:text-blue-500" />
                    </button>
                  </div>
                </div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full px-4 lg:px-10 outline-none ring-0"
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger></AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col lg:flex-row justify-between gap-x-4 gap-y-3 items-center">
                        <input
                          placeholder="Add description (optional)"
                          value={description}
                          className="w-full outline-none ring-0 border-none col-span-3 lg:mr-4"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex justify-center">
                          <Popover
                            open={priorityOpen}
                            onOpenChange={setPriorityOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={priorityOpen}
                                className="w-full lg:w-[200px] justify-between font-normal"
                              >
                                {selectedPriority
                                  ? priorities.find(
                                      (priorities) =>
                                        priorities.id === selectedPriority
                                    )?.title
                                  : "Select priority (optional)"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] lg:w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search priorities..." 
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <CommandEmpty>No priority found</CommandEmpty>
                                {priorities && priorities.length > 0 && (
                                  <CommandGroup>
                                    {priorities.map((priority) => (
                                      <CommandItem
                                        key={priority.id}
                                        value={selectedPriority ? priorities.find(p => p.id === selectedPriority)?.title : ""}
                                        onSelect={() => {
                                          setSelectedPriority(priority.id);
                                          setSelectedPriorityTitle(priority.title);
                                          setPriorityOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn("mr-2 h-4 w-4", selectedPriority === priority.id ? "opacity-100" : "opacity-0")}
                                        />
                                        {priority.title}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="flex flex-col gap-y-2 p-4">
                {pending.length > 0 ? (
                  pending.map((item: Task) => {
                    const currentDate = new Date(item.dueDate);
                    currentDate.setDate(currentDate.getDate() + 1);
                    const isExpired = currentDate < new Date(); // Check if the date is expired
                    return (
                      <div key={item.id}>
                        <div
                          className={`${
                            task && task.id === item.id ? "hidden" : "block"
                          } w-full shadow-md py-3 rounded-sm bg-white px-4 lg:px-10`}
                        >
                          <div className=" flex justify-between items-center gap-x-3">
                            <div>
                              <p
                                className={`text-lg ${
                                  isExpired ? "line-through italic" : ""
                                } lg:text-xl text-left whitespace-normal break-all overflow-hidden`}
                              >
                                {item.title}
                              </p>
                              <div className="text-sm text-gray-500 flex items-center gap-x-1">
                                {isExpired ? (
                                  <span className="text-red-700 italic">
                                    Expired
                                  </span>
                                ) : (
                                  <>
                                    <AiOutlineClockCircle />
                                    {currentDate.toISOString().slice(0, 10)}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-x-2 lg:gap-x-4 text-gray-500">
                              <button
                                type="button"
                                onClick={() => getTask(item.id.toString())}
                              >
                                <CiEdit className="text-md lg:text-2xl hover:text-blue-600" />
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button type="button">
                                    <RiDeleteBin6Line className="text-md lg:text-2xl hover:text-red-800" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your task
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteTask(item.id.toString())}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button type="button">
                                    <BsCheck2Circle className="text-md lg:text-2xl hover:text-green-600" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Task Completed?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      mark your task as completed
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => completeTask(item.id.toString())}
                                    >
                                      Done
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          {(item.description || item.taskpriority) && (
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full outline-none ring-0"
                            >
                              <AccordionItem value="item-1">
                                <AccordionTrigger></AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-row justify-between gap-x-4 gap-y-3 items-start">
                                    <div className=" whitespace-normal break-all overflow-hidden">
                                      {item.description ??
                                        "No description added"}
                                    </div>
                                    {item.taskpriority && (
                                      <div
                                        className={`flex justify-center gap-x-1 border ${
                                          item.taskpriority.title === "High Priority"
                                            ? "border-yellow-500"
                                            : item.taskpriority.title === "Normal Priority"
                                            ? "border-amber-950"
                                            : item.taskpriority.title === "Low Priority"
                                            ? "border-blue-500"
                                            : "border-red-700"
                                        } py-0.5 px-2 rounded-md items-center`}
                                      >
                                        <div
                                          className={`h-2 w-2 ${
                                            item.taskpriority.title === "High Priority"
                                              ? "bg-yellow-500"
                                              : item.taskpriority.title === "Normal Priority"
                                              ? "bg-amber-950"
                                              : item.taskpriority.title ===
                                                "Low Priority"
                                              ? "bg-blue-500"
                                              : "bg-red-700"
                                          } rounded-full`}
                                        ></div>
                                        <div
                                          className={`${
                                            item.taskpriority.title === "High Priority"
                                              ? "text-yellow-500"
                                              : item.taskpriority.title === "Normal Priority"
                                              ? "text-amber-950"
                                              : item.taskpriority.title ===
                                                "Low Priority"
                                              ? "text-blue-500"
                                              : "text-red-700"
                                          } text-sm`}
                                        >
                                          {item.taskpriority.title}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                        </div>
                        <div
                          className={`${
                            task && task.id === item.id ? "block" : "hidden"
                          }`}
                        >
                          <div className="lg:flex lg:flex-col gap-y-2 p-2 shadow-md pt-5 rounded-md bg-white">
                            <div className="px-4 lg:px-10 lg:flex gap-x-4 items-center">
                              <input
                                type="text"
                                value={updateTitle ? updateTitle : task.title}
                                className="w-full outline-none ring-0 border-none"
                                onChange={(e) => setUpdateTitle(e.target.value)}
                              />
                              <div className="flex gap-x-4 items-center justify-between mt-4 lg:mt-0">
                                <Popover
                                  open={updateCalendarOpen}
                                  onOpenChange={() =>
                                    setUpdateCalendarOpen(true)
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={`w-full lg:w-[280px] text-sm justify-center text-left font-normal ${
                                        !task.dueDate &&
                                        "text-muted-foreground"
                                      }`}
                                    >
                                      <AiTwotoneCalendar className="mr-2 h-4 w-4" />
                                      {updateDate ? (
                                        format(updateDate, "PPP")
                                      ) : task.dueDate ? (
                                        format(parseISO(task.dueDate), "PPP")
                                      ) : (
                                        <span>Pick a Date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      defaultMonth={today}
                                      mode="single"
                                      disabled={beforeToday}
                                      selected={updateDate}
                                      onSelect={(newDate) => {
                                        if (newDate) {
                                          setUpdateDate(newDate);
                                          setUpdateCalendarOpen(false);
                                        }
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <button
                                  type="button"
                                  className="cursor-pointer"
                                  onClick={() => updateTask(item.id.toString())}
                                >
                                  <BsCheck2 className="text-3xl text-blue-600 hover:text-blue-500" />
                                </button>
                                <button
                                  type="button"
                                  className="cursor-pointer"
                                  onClick={() => setTask({})}
                                >
                                  <RxCross1 className="text-2xl text-red-700 hover:text-blue-500" />
                                </button>
                              </div>
                            </div>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full px-4 lg:px-10 outline-none ring-0"
                            >
                              <AccordionItem value="item-1">
                                <AccordionTrigger></AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-col lg:flex-row justify-between gap-x-4 gap-y-3 items-center">
                                    <input
                                      placeholder="Update description"
                                      value={
                                        updateDescription
                                          ? updateDescription
                                          : task.description
                                      }
                                      className="w-full outline-none ring-0 border-none col-span-3 lg:mr-4"
                                      onChange={(e) =>
                                        setUpdateDescription(e.target.value)
                                      }
                                    />
                                    <div className="flex justify-center">
                                      <Popover
                                        open={updatePriorityOpen}
                                        onOpenChange={setUpdatePriorityOpen}
                                      >
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={updatePriorityOpen}
                                            className="w-full lg:w-[200px] justify-between font-normal"
                                          >
                                            {updatePriority
                                              ? updatePriorityTitle
                                              : task.priority
                                              ? task.priority.title
                                              : "Change priority"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] lg:w-[200px] p-0">
                                          <Command>
                                            <CommandInput placeholder="Search categories..." />
                                            <CommandEmpty>
                                              No category found
                                            </CommandEmpty>
                                            <CommandGroup>
                                              {priorities.map((priority) => (
                                                <CommandItem
                                                  key={priority.id}
                                                  value={
                                                    selectedPriority
                                                      ? priorities.find(
                                                          (priority) =>
                                                            priority.id ===
                                                            selectedPriority
                                                        )?.title
                                                      : ""
                                                  }
                                                  onSelect={() => {
                                                    setUpdatePriority(
                                                      priority.id
                                                    );
                                                    setUpdatePriorityTitle(
                                                      priority.title
                                                    );
                                                    setUpdatePriorityOpen(
                                                      false
                                                    );
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      selectedPriority ===
                                                        priority.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                  {priority.title}
                                                </CommandItem>
                                              ))}
                                            </CommandGroup>
                                          </Command>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="shadow-md py-6 rounded-sm bg-white px-10 flex gap-x-4 items-center">
                    <FcOk className="text-2xl" />
                    <div>No Pending Tasks!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
