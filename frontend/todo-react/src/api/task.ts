import axios from 'axios';
import { TaskParams } from '../types/task';
import { API_BASE_URL } from '../constants';

// 1ユーザーに紐づくすべてのタスクを取得するメソッド
export const fetchTasksByUser = async (id: number): Promise<TaskParams[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error while fetching samples: ', error);
    throw error;
  }
};
