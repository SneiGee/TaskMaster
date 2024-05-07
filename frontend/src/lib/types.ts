

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    taskpriority: TaskPriority;
}

export interface TaskPriority {
    id: number;
    title: string;
    description: string;
    username: string;
}
