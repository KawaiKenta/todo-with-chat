import React, { FC, useState } from 'react';
import { useParams } from 'react-router';
import NotFound from '../../components/NotFound';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../../store/atom';
import { TaskParams } from '../../types/task';
import { TaskList } from '../../components/TaskList';
import { Modal } from '../../components/Modal';
import { TaskForm } from '../../components/TaskForm';

// サンプルデータ (API からデータを取得する処理を追加する)
const sampleTaskParams: TaskParams[] = [
  {
    id: 1,
    user_id: 1,
    title: '月次報告書の作成',
    content: '先月の業績や課題をまとめて報告書を作成',
    due_date: '2023-12-31',
    priority: '中',
    status: '未着手',
    last_modified_by: 'user',
  },
  {
    id: 2,
    user_id: 1,
    title: 'クライアントミーティングの準備',
    content: '次回のクライアントミーティングに向けて資料の準備',
    due_date: '2024-01-05',
    priority: '高',
    status: '未着手',
    last_modified_by: 'user',
  },
  {
    id: 3,
    user_id: 1,
    title: 'プロジェクト進捗の調査',
    content: 'プロジェクトの進捗状況を確認し、課題点を洗い出す',
    due_date: null,
    priority: '中',
    status: '完了',
    last_modified_by: 'AI',
  },
  {
    id: 4,
    user_id: 1,
    title: '新プロジェクトのキックオフミーティング',
    content: '新しいプロジェクトの計画や目標を確認するためのミーティングに参加',
    due_date: '2023-12-31',
    priority: '中',
    status: '着手中',
    last_modified_by: 'user',
  },
  {
    id: 5,
    user_id: 1,
    title: 'クライアント契約交渉',
    content: '新規クライアントとの契約交渉を行い、条件や提案を調整',
    due_date: null,
    priority: '低',
    status: '完了',
    last_modified_by: 'AI',
  },
  {
    id: 6,
    user_id: 1,
    title: 'クライアントからの質問回答',
    content: 'クライアントからの質問に対する回答をまとめる',
    due_date: '2023-12-18',
    priority: '中',
    status: '削除済み',
    last_modified_by: 'user',
  },
];

// const currentUserParams: UserParams =

const RenderedComponent = (userId: string) => {
  // userId が数値であるかを判定
  // aaa や 123bb などがはじかれる
  if (!isNaN(Number(userId))) {
    return (
      <>
        {/* <h1>ユーザーページ</h1> */}
        {/* <h2>ユーザーID: {userId}</h2> */}
        {/* userId を数値として使用する場合 */}
        {/* parseInt(userId, 10) */}
        <TaskList tasks={sampleTaskParams} />
      </>
    );
  } else {
    // データを正しく取得できない場合のエラーを入れる
    return <NotFound />;
  }
};

const UserPage: FC = () => {
  const [currentUser] = useAtom(currentUserAtom);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);

  // Modal の onClose 関数
  const handleNewTaskModalClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    // モーダルの外をクリックしても閉じないように設定
    if (reason === 'backdropClick') return;
    setNewTaskModalOpen(false);
  };

  // Modal の onSubmit 関数
  const handleNewTaskFormSubmit = () => {
    console.log('submitted');
    setNewTaskModalOpen(false);
  };

  console.log(currentUser);
  // URLからユーザIDを取得
  const { userId } = useParams<{ userId: string }>();
  // console.log();

  return (
    <Box sx={{ width: '90%', margin: '10px auto' }}>
      <>
        <Box component="h1" color="#000000df" fontSize="28px">
          タスク一覧
        </Box>
        {userId && RenderedComponent(userId)}
        {/* 新規タスクボタン */}
        <Fab
          sx={{
            position: 'fixed',
            bottom: 4,
            right: 4,
            marginRight: 2,
            marginBottom: 2,
            backgroundColor: '#31a899',
            ':hover': {
              backgroundColor: '#31a899',
            },
          }}
          onClick={() => {
            setNewTaskModalOpen(true);
          }}
        >
          <AddIcon
            sx={{
              color: '#fff',
            }}
          />
        </Fab>
        {/* 新規タスクモーダル */}
        <Modal
          open={newTaskModalOpen}
          onClose={handleNewTaskModalClose}
          title="タスクの作成"
        >
          <TaskForm onSubmit={handleNewTaskFormSubmit} buttonValue="作成" />
        </Modal>
      </>
    </Box>
  );
};

export default UserPage;
