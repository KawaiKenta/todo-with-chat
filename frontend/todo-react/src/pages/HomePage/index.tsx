import { Box, Button } from '@mui/material';
import React, { FC } from 'react';
import { User } from '../../types/user';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../../store/atom';

const sampleUserNames: string[] = ['ユーザー1', 'ユーザー2', 'ユーザー3'];

// 指定された id をもつユーザー情報をAPIから取得する関数 (別ファイルへ分離)
const getUser = (userId: number): User => {
  return {
    id: userId,
    name: `ユーザー${userId}`,
    email: `sample${userId}@mail.com`,
  };
};

const HomePage: FC = () => {
  const [, setCurrentUser] = useAtom(currentUserAtom);
  // console.log(currentUser);
  return (
    <Box sx={{ width: '90%', margin: '10px auto' }}>
      <Box component="h1" color="#000000df" fontSize="28px">
        アプリ紹介
      </Box>
      <Box component="p" color="#000000df" margin="20px 0 0">
        Chat To Do は、Slack などの Chat
        アプリと連携したタスク管理システムです。
      </Box>
      <Box component="p" color="#000000df" margin="10px 0 0">
        Chat アプリでの会話をもとに、AI がタスクを自動生成する機能をもちます。
      </Box>
      <Box component="p" color="#000000df" margin="10px 0 0">
        もちろん、自分でタスクを作成することもできます。
      </Box>
      <Box component="h1" color="#000000df" fontSize="28px" marginTop={4}>
        ユーザー選択
      </Box>
      <Box
        sx={{
          margin: '20px 0 40px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {sampleUserNames.map<React.ReactNode>((userName, idx) => {
          return (
            <Button
              key={idx}
              variant="contained"
              sx={{
                border: '2px solid #31a899',
                borderRadius: 3,
                backgroundColor: '#ffffff',
                color: '#31a899',
                fontWeight: 'bold',
                minWidth: '25%',
                marginRight: 1,
                '&:hover': {
                  backgroundColor: '#31a899',
                  color: '#ffffff',
                },
              }}
              href={`/user/${idx + 1}`}
              onClick={() => {
                setCurrentUser(getUser(idx + 1));
              }}
            >
              {userName}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default HomePage;
