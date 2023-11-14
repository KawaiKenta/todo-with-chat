import { Box, Link } from '@mui/material';
import React, { FC } from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom } from '../../store/atom';

export const Header: FC = () => {
  const [currentUser] = useAtom(currentUserAtom);
  console.log(currentUser);
  return (
    <Box
      sx={{
        backgroundColor: '#31a899',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          width: '90%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
        }}
      >
        <Box>
          <Link href="/" underline="none" color="#fff">
            <Box component="h1" sx={{ margin: 0 }}>
              Chat To Do
            </Box>
            <Box
              component="p"
              sx={{
                margin: '5px 0 0 0',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              Chat アプリと連携した
              <br />
              タスク管理システム
            </Box>
          </Link>
        </Box>
        <Box>
          {currentUser ? (
            <>
              <Box
                component="p"
                sx={{
                  margin: '0 0 5px 0',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                ログインユーザー
              </Box>
              <Box component="h3" sx={{ margin: 0 }}>
                {/* ログインユーザーの名前を読み取って表示 */}
                Taro Yamada
              </Box>
            </>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </Box>
  );
};
