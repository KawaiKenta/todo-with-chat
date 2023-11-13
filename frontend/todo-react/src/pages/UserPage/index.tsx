import React, { FC } from 'react';
import { useParams } from 'react-router';
import NotFound from '../../components/NotFound';
import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../../store/atom';

// const currentUserParams: UserParams =

const RenderedComponent = (userId: string) => {
  // userId が数値であるかを判定
  // aaa や 123bb などがはじかれる
  if (!isNaN(Number(userId))) {
    return (
      <>
        {/* <h1>ユーザーページ</h1> */}
        <h2>ユーザーID: {userId}</h2>
        {/* userId を数値として使用する場合 */}
        {/* parseInt(userId, 10) */}
      </>
    );
  } else {
    // データを正しく取得できない場合のエラーを入れる
    return <NotFound />;
  }
};

const UserPage: FC = () => {
  const [currentUser] = useAtom(currentUserAtom);
  console.log(currentUser);
  // URLからユーザIDを取得
  const { userId } = useParams<{ userId: string }>();
  console.log();

  return (
    <Box sx={{ width: '90%', margin: '10px auto' }}>
      <Box component="h1" color="#000000df" fontSize="28px">
        タスク一覧
      </Box>
      {userId && RenderedComponent(userId)}
    </Box>
  );
};

export default UserPage;
