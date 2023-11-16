// API から取得するタスクの型
export type FetchedTaskParams = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  due_date: { Time: string; Valid: boolean } | null;
  priority: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  last_modified_by: string;
};

// React App で利用するタスクの型
export type Task = {
  id: number;
  userId: number;
  title: string;
  content: string;
  dueDate: string | null;
  priority: string;
  status: string;
  lastModifiedBy: string;
};

// 新規作成時に API へ送信するタスクの型
export type CreateTaskParams = {
  user_id: number;
  title: string;
  content: string;
  status: string;
  priority: string;
  dueDate?: { Time: string; Valid: boolean };
  last_modified_by: string;
};
