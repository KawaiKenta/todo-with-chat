import React, { FC, useState } from 'react';
import { Task, TaskParams } from '../../types/task';
import { Box, Card, CardContent } from '@mui/material';
import s from './index.module.css';
import { Modal } from '../Modal';

// タスクを複数 (props でリストを与える) レンダリングするコンポーネント
export const TaskList: FC<{ tasks: TaskParams[] }> = ({ tasks }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Modal の onClose 関数
  const handleModalClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    // モーダルの外をクリックしても閉じないように設定
    if (reason === 'backdropClick') return;
    setModalOpen(false);
  };

  return (
    <>
      {tasks.map((params, idx) => {
        const task: Task = {
          id: params.id,
          userId: params.user_id,
          title: params.title,
          content: params.content,
          dueDate: params.due_date,
          priority: params.priority,
          status: params.status,
          lastModifiedBy: params.last_modified_by,
        };
        return (
          <Box
            component="a"
            key={idx}
            onClick={() => {
              setModalOpen(true);
            }}
            sx={{ ':hover': { cursor: 'pointer' } }}
          >
            {TaskCard(task)}
          </Box>
        );
      })}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div>
          <h2>Modal Content</h2>
          <p>This is the content of the modal.</p>
        </div>
      </Modal>
    </>
  );
};

// MUI の CSS を上書き
const customLastChildStyle = {
  paddingTop: 2,
  paddingLeft: 2,
  paddingRight: 2,
  paddingBottom: 2,
  '&:last-child': {
    paddingBottom: 2,
  },
};

// 1つのタスクカードに対応するコンポーネント
const TaskCard: FC<Task> = (props) => {
  const { title, content, dueDate, priority, status } = props;
  return (
    <Card
      sx={{
        width: '100%',
        border: 2,
        borderColor: '#31a899',
        marginBottom: 3,
        padding: 0,
      }}
    >
      <CardContent sx={customLastChildStyle}>
        <Box
          component="h3"
          sx={{
            margin: '0 0 5px',
          }}
        >
          {title}
        </Box>
        <div className={s.taskInfoWrapper}>
          <Box component="h5" marginRight={4}>
            状態: {status}
          </Box>
          <Box component="h5" marginRight={4}>
            優先度: {priority}
          </Box>
          <Box component="h5" marginRight={4}>
            期限: {dueDate ? dueDate : '未設定'}
          </Box>
        </div>
        <Box component="h5" sx={{ margin: 0, marginTop: 1 }}>
          詳細: {content}
        </Box>
      </CardContent>
    </Card>
  );
};
