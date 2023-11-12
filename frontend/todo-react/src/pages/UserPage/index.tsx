import React, { FC } from 'react';
import { useParams } from 'react-router';
import NotFound from '../../components/NotFound';

const RenderedComponent = (userId: string) => {
  // userId が数値であるかを判定
  // aaa や 123bb などがはじかれる
  if (!isNaN(Number(userId))) {
    return (
      <>
        <h1>ユーザーページ</h1>
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
  // URLからユーザIDを取得
  const { userId } = useParams<{ userId: string }>();

  return <>{userId && RenderedComponent(userId)}</>;
};

export default UserPage;
