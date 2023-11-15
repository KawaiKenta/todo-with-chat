import React from 'react';
import axios, { AxiosResponse, AxiosError, AxiosPromise } from 'axios';
import { TaskParams } from '../types/task';
import { API_BASE_URL } from '../constants';

// type FetchTasksByUser = () => AxiosPromise<TaskParams[]>;

// あるユーザーのすべてのタスクを取得するメソッド
// export const useFetchTasksByUser =  (
//   id: number
// ) => {
//   const fetchTasksByUser: FetchTasksByUser = async () => {
//     try {
//       const res: AxiosResponse<TaskParams[]> = await axios.get(
//         `${API_BASE_URL}/user/${id}/tasks`
//       );
//       return res;
//     } catch (error) {
//       console.error('Error while fetching samples: ', error);
//       throw error;
//     }
//   };
//   return {fetchTasksByUser}
// };

// axios
//   .get(`${API_BASE_URL}/user/${id}/tasks`)
//   .then((res: AxiosResponse<TaskParams[]>) => {
//     const { data, status } = res;
//     // console.log(status)
//     return data;
//   })
//   .catch((e: AxiosError<{ error: string }>) => {
//     console.log('Error while fetching samples: ', e);
//   });

export const fetchTasksByUser = async (id: number): Promise<TaskParams[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${id}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error while fetching samples: ', error);
    throw error;
  }
};
