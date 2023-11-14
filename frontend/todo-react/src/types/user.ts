// API から取得するユーザーの型
export type UserParams = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

// React App で使用するユーザーの型
export type User = {
  id?: number;
  name?: string;
  email?: string;
};
