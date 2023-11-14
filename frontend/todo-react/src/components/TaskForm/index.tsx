import React, { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  SxProps,
} from '@mui/material';
import { Task } from '../../types/task';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type TaskFormProps = {
  task?: Task;
  onSubmit: SubmitHandler<Task>;
  buttonValue: string;
  buttonStyles?: SxProps;
};

// タスク編集・新規作成用のフォーム
export const TaskForm: FC<TaskFormProps> = (props) => {
  const { task, onSubmit, buttonValue = '更新', buttonStyles } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: task });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column">
        <FormControl margin="normal">
          <TextField
            label="タイトル"
            id="title"
            {...register('title', { required: 'タイトルは必須です' })}
            variant="outlined"
          />
          {errors.title && <span>{errors.title.message}</span>}
        </FormControl>
        <FormControl margin="normal">
          <InputLabel id="status">状態</InputLabel>
          <Select
            {...register('status', { required: '状態は必須です' })}
            variant="outlined"
          >
            <MenuItem value="未着手">未着手</MenuItem>
            <MenuItem value="着手中">着手中</MenuItem>
            <MenuItem value="完了">完了</MenuItem>
          </Select>
          {errors.status && <span>{errors.status.message}</span>}
        </FormControl>
        <FormControl margin="normal">
          <InputLabel id="priority">優先度</InputLabel>
          <Select
            {...register('priority', { required: '優先度は必須です' })}
            variant="outlined"
          >
            <MenuItem value="高">高</MenuItem>
            <MenuItem value="中">中</MenuItem>
            <MenuItem value="低">低</MenuItem>
          </Select>
          {errors.priority && <span>{errors.priority.message}</span>}
        </FormControl>
        <FormControl margin="normal">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="期限"
              format="YYYY-MM-DD"
              // renderInput={(params) => (
              //   <TextField {...params} variant="outlined" />
              // )}
              // {...register('dueDate')}
            />
          </LocalizationProvider>
        </FormControl>
        <FormControl margin="normal">
          <TextField
            id="content"
            label="詳細"
            {...register('content')}
            variant="outlined"
            multiline
            rows={4}
          />
        </FormControl>
        <Button type="submit" variant="contained" sx={buttonStyles}>
          {buttonValue}
        </Button>
      </Box>
    </form>
  );
};
