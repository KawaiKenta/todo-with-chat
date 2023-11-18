import React, { FC } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button, TextField, MenuItem, Box, SxProps } from '@mui/material';
import { Task } from '../../types/task';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { status, priority } from '../../constants';
import dayjs from 'dayjs';

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
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: task });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column">
        {/* タイトル */}
        <Controller
          name="title"
          control={control}
          rules={{ required: 'タイトルは必須です。' }}
          defaultValue=""
          render={({ field }) => {
            return (
              <TextField
                {...field}
                id="title"
                label="タイトル"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            );
          }}
        />
        {/* 状態 */}
        <Controller
          name="status"
          control={control}
          defaultValue=""
          rules={{ required: '状態は必須です' }}
          render={({ field }) => {
            return (
              <>
                <TextField
                  id="status"
                  {...field}
                  select
                  sx={{ mt: 2 }}
                  fullWidth
                  label="状態"
                  variant="outlined"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value={status.notStarted}>
                    {status.notStarted}
                  </MenuItem>
                  <MenuItem value={status.doing}>{status.doing}</MenuItem>
                  <MenuItem value={status.done}>{status.done}</MenuItem>
                </TextField>
              </>
            );
          }}
        />
        {/* 優先度 */}
        <Controller
          name="priority"
          control={control}
          defaultValue=""
          rules={{ required: '優先度は必須です' }}
          render={({ field }) => {
            return (
              <TextField
                {...field}
                select
                sx={{ mt: 2 }}
                fullWidth
                id="priority"
                label="優先度"
                variant="outlined"
                error={!!errors.priority}
                helperText={errors.priority?.message}
              >
                <MenuItem value={priority.high}>{priority.high}</MenuItem>
                <MenuItem value={priority.middle}>{priority.middle}</MenuItem>
                <MenuItem value={priority.low}>{priority.low}</MenuItem>
              </TextField>
            );
          }}
        ></Controller>
        {/* 期限 */}
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => {
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  label="期限"
                  defaultValue={undefined}
                  format="YYYY-MM-DD"
                  sx={{ mt: 2 }}
                  value={task ? dayjs(task.dueDate) : undefined}
                />
                {/* <DatePicker
                  {...field}
                  format='YYYY-MM-DD'
                  defaultValue={undefined}
                  sx={{ mt: 2 }}
                  value={task ? dayjs(task.dueDate) : undefined}
                  renderInput={(
                    params: JSX.IntrinsicAttributes & TextFieldProps
                  ) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: dayjs().format('YYYY-MM-DD'),
                      }}
                      label="dueDate"
                    />
                  )}
                /> */}
              </LocalizationProvider>
            );
          }}
        />
        {/* 詳細 */}
        <Controller
          name="content"
          control={control}
          defaultValue=""
          render={({ field }) => {
            return (
              <TextField
                {...field}
                multiline
                fullWidth
                sx={{ mt: 2, mb: 4 }}
                rows={2}
                id="content"
                label="詳細"
                variant="outlined"
              />
            );
          }}
        />
        <Button type="submit" variant="contained" sx={buttonStyles} onClick={() => {window.location.reload()}}>
          {buttonValue}
        </Button>
      </Box>
    </form>
  );
};
