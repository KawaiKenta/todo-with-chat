import { atom } from 'jotai';
import { User } from '../types/user';

// グローバル管理するログインユーザーの情報
export const currentUserAtom = atom<User | undefined>(undefined);
