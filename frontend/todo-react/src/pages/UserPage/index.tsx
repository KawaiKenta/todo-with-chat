import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FetchedTaskParams, Task } from '../../types/task';
import { TaskList } from '../../components/TaskList';
import { Modal } from '../../components/Modal';
import { TaskForm } from '../../components/TaskForm';
import { createTask, fetchTasksByUser } from '../../api/task';
import NotFound from '../../components/NotFound';
import dayjs from 'dayjs';
import { status } from '../../constants';

const UserPage: FC = () => {
  // URLからユーザIDを取得
  const userIdParam = useParams<{ userId: string }>().userId;

  // ユーザIDを数値に変換 (数値でない場合には 0 で初期化)
  const userId: number = !isNaN(Number(userIdParam)) ? Number(userIdParam) : 0;
  // console.log(userId);

  // const [currentUser] = useAtom(currentUserAtom);

  const [newTaskModalOpen, setNewTaskModalOpen] = useState<boolean>(false);
  const [fetchedTasks, setFetchedTasks] = useState<FetchedTaskParams[]>([]);
  // deleted 以外
  // const [displayTasks, setDisplayTasks] = useState<FetchedTaskParams[]>([]);
  // deleted, completed 以外
  // const [filteredTasks, setFilterdTasks] = useState<FetchedTaskParams[]>([]);
  const [displayCompletedTask, setDisplayCompletedTask] =
    useState<boolean>(false);

  // API からユーザーに紐づいたタスクを読み取り
  useEffect(() => {
    (async () => {
      const fetchedData = await fetchTasksByUser(userId);
      setFetchedTasks(fetchedData);
      // console.log(fetchedData.filter((task) => task.status !== status.done));
      // const displayData = fetchedData.filter(
      //   (task) => task.status !== status.deleted
      // );
      // const filteredData = fetchedData.filter(
      //   (task) => task.status !== status.done
      // );
      // setDisplayTasks(displayData);
      // setFilterdTasks(filteredData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const fetchedTasks = userId ? useFetchTasksByUser(Number(userId)) : undefined;
  // console.log(fetchedTasks);

  const RenderedComponent = () => {
    // userId が数値であるかを判定
    // aaa や 123bb などがはじかれる
    if (userId !== 0) {
      return (
        <>
          <TaskList tasks={fetchedTasks} />
        </>
      );
      // if (displayCompletedTask) {
      //   return <>{fetchedTasks && <TaskList tasks={fetchedTasks} />}</>;
      // } else {
      //   return <>{fetchedTasks && <TaskList tasks={filteredTasks} />}</>;
      // }
    } else {
      // データを正しく取得できない場合のエラーを入れる
      return <NotFound />;
    }
  };

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
  const handleNewTaskFormSubmit = (task: Task) => {
    // 日付がある場合、YYYY-MM-DD に変更する
    task.dueDate = task.dueDate
      ? dayjs(task.dueDate).format('YYYY-MM-DD')
      : null;
    // ユーザー id を設定
    task.id = userId;
    createTask(task);
    setNewTaskModalOpen(false);
  };
  return (
    <Box sx={{ width: '90%', margin: '10px auto' }}>
      <>
        <Box mb={2} mr={10} display="flex" alignItems="center">
          <Box component="h1" color="#000000df" fontSize="28px">
            タスク一覧
          </Box>
          <Box ml={10}>
            {displayCompletedTask ? (
              <Button
                variant="contained"
                sx={{
                  mr: 4,
                  backgroundColor: '#31a899',
                  ':hover': { backgroundColor: '#31a899' },
                }}
                onClick={() => {
                  setDisplayCompletedTask(false);
                }}
              >
                完了済みのタスクを非表示
              </Button>
            ) : (
              <Button variant="contained" disabled sx={{ mr: 4 }}>
                完了済みのタスクを非表示
              </Button>
            )}
            {displayCompletedTask ? (
              <Button variant="contained" disabled>
                完了済みのタスクを表示
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#31a899',
                  ':hover': { backgroundColor: '#31a899' },
                }}
                onClick={() => {
                  setDisplayCompletedTask(true);
                }}
              >
                完了済みのタスクを表示
              </Button>
            )}
          </Box>
        </Box>
        {/* タスクリストのレンダリング */}
        {RenderedComponent()}
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
          <TaskForm
            onSubmit={handleNewTaskFormSubmit}
            buttonValue="作成"
            buttonStyles={{
              backgroundColor: '#31a899',
              ':hover': { backgroundColor: '#31a899' },
            }}
          />
        </Modal>
      </>
    </Box>
  );
};

export default UserPage;
