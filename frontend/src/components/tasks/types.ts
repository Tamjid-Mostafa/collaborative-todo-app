export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "stale" | "completed" | "in-progress";
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  username: string;
}
