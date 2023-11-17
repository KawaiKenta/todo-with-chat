import React, { FC, useState } from 'react';
import { Task, FetchedTaskParams } from '../../types/task';
import { Box, Card, CardContent } from '@mui/material';
import s from './index.module.css';
import { Modal } from '../Modal';
import { TaskForm } from '../TaskForm';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { status as st, status } from '../../constants';

// タスクを複数 (props でリストを与える) レンダリングするコンポーネント
export const TaskList: FC<{
  tasks: FetchedTaskParams[];
}> = ({ tasks }) => {
  // if (!displayCompletedTask) {
  //   tasks = tasks.filter((task) => task.status !== status.done);
  // }
  return (
    <>
      {tasks.map((params, idx) => {
        const task: Task = {
          id: params.id,
          userId: params.user_id,
          title: params.title,
          content: params.content,
          dueDate:
            // due_date: {Time: '0001-01-01T00:00:00Z', Valid: false}
            // Valid: false のとき null 判定
            params.due_date && params.due_date.Valid
              ? // YYYY-MM-DDTHH::mm:ssZ を YYYY-MM-DD に加工
                new Date(params.due_date.Time).toISOString().split('T')[0]
              : null,
          priority: params.priority,
          status: params.status,
          lastModifiedBy: params.last_modified_by,
        };
        return (
          // 削除済みのタスクは表示しない
          task.status !== status.deleted && (
            <Box key={idx}>{TaskCard(task)}</Box>
          )
        );
      })}
    </>
  );
};

// MUI の CSS を上書き
const customLastChildStyle = {
  paddingTop: 2,
  paddingLeft: 2,
  paddingRight: 2,
  paddingBottom: 2,
  // position: 'relative',
  '&:last-child': {
    paddingBottom: 2,
  },
};

// 1つのタスクカードに対応するコンポーネント
const TaskCard: FC<Task> = (props) => {
  const { title, content, dueDate, priority, status, lastModifiedBy } = props;
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
      <Box
        component="a"
        onClick={() => {
          setModalOpen(true);
        }}
        sx={{ ':hover': { cursor: 'pointer' } }}
      >
        <Card
          sx={{
            width: '100%',
            border: 2,
            borderColor: '#31a899',
            marginBottom: 3,
            padding: 0,
          }}
          variant="outlined"
        >
          <CardContent sx={customLastChildStyle}>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Box
                component="h5"
                marginTop={0}
                marginBottom={0}
                marginRight={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box component="span">{status}</Box>
                {/* 状態に応じたアイコンを表示 */}
                <Box component="span">
                  {status === st.done ? (
                    <TaskAltIcon />
                  ) : status === st.doing ? (
                    <AutorenewIcon />
                  ) : status === st.notStarted ? (
                    <AssignmentOutlinedIcon />
                  ) : (
                    ''
                  )}
                </Box>
              </Box>
              <Box component="h3" margin={0}>
                {title}
              </Box>
              {/* AI による自動生成のタグ */}
              {lastModifiedBy === 'AI' && (
                <Box
                  component="span"
                  sx={{
                    backgroundColor: '#31a899',
                    color: '#fff',
                    border: 2,
                    borderRadius: 3,
                    pt: 0.5,
                    pb: 0.5,
                    pl: 1,
                    pr: 1,
                    ml: 2,
                  }}
                >
                  AI による自動生成
                </Box>
              )}
            </Box>
            <div className={s.taskInfoWrapper}>
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
      </Box>
      {/* モーダル */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title="タスクの編集・削除"
      >
        <TaskForm
          task={props}
          onSubmit={() => {
            console.log('submitted');
          }}
          buttonValue="更新"
          buttonStyles={{
            backgroundColor: '#31a899',
            ':hover': { backgroundColor: '#31a899' },
          }}
        />
      </Modal>
    </>
  );
};
