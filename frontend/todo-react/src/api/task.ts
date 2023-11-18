import axios from 'axios';
import {
  FetchedTaskParams,
  CreateTaskParams,
  Task,
  UpdateTaskParams,
  DeleteTaskParams,
} from '../types/task';
import { API_BASE_URL } from '../constants';

// 1ユーザーに紐づくすべてのタスクを取得するメソッド
export const fetchTasksByUser = async (
  id: number
): Promise<FetchedTaskParams[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error while fetching samples: ', error);
    throw error;
  }
};

// タスク作成を行うメソッド
export const createTask = async (task: Task) => {
  try {
    const params: CreateTaskParams = {
      user_id: task.userId,
      title: task.title,
      content: task.content,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate ? `${task.dueDate}T00:00:00Z` : undefined,
      last_modified_by: 'user',
    };
    const postData = await axios.post(`${API_BASE_URL}/task/create`, params);
    if (postData.status === 200) {
      console.log('Successfully Created!!');
    }
  } catch (error) {
    console.log('New task post failed: ', error);
  }
};

// タスク編集を行うメソッド
export const updateTask = async (task: Task) => {
  try {
    const params: UpdateTaskParams = {
      id: task.id,
      user_id: task.userId,
      title: task.title,
      content: task.content,
      status: task.status,
      priority: task.priority,
      due_date: task.dueDate ? `${task.dueDate}T00:00:00Z` : undefined,
    };
    const postData = await axios.patch(`${API_BASE_URL}/task/update`, params);
    console.log(params);
    if (postData.status === 200) {
      console.log('Successfully Updated!!');
    }
  } catch (error) {
    console.log('Update was failed: ', error);
  }
};

// タスク削除を行うメソッド
export const deleteTask = async (task: Task) => {
  try {
    const params: DeleteTaskParams = {
      id: task.id,
    };
    const deleteData = await axios.patch(`${API_BASE_URL}/task/delete`, params);
    console.log(params);
    if (deleteData.status == 200) {
      console.log('Successfully Deleted!');
    }
  } catch (error) {
    console.log('Delete was failed: ', error);
  }
}
