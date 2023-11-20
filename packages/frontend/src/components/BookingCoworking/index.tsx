import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Alert } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { user as userRedux } from '../../redux/storeParts';
import { useAppSelector } from '../../redux/hooks';
import { feathersClient } from '../../feathersClient';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

type BookingForm = {
  name: string;
  message: string;
  startDate: Dayjs;
  duration: number; // Duration in hours
};

export const BookingDatePicker: React.FC = () => {
  const user = useAppSelector(userRedux.getData);
  const { control, handleSubmit, formState: { errors }, reset } = useForm<BookingForm>({
    defaultValues: {
      name: user!.name || '',
    },
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [snackBarOpened, setSnackBarOpened] = useState(false);
  // const dispatch = useAppDispatch();

  const { coworkingId } = useParams();

  const onSubmit = async (data: BookingForm) => {
    if (!user!._id || !coworkingId) return;
    // Calculate the end time
    const endTime = selectedDate.add(data.duration, 'hour');

    // Create a booking object or perform actions as needed
    const bookingDetails = {
      clientId: user!._id,
      coworkingId:coworkingId,
      name: data.name,
      startTime: data.startDate.toISOString(), // or format as needed
      endTime: endTime.toISOString(), // or format as needed
      message: data.message || '',
      status: 'sent',
    };

    const message = await feathersClient.service('messages').create(bookingDetails)
    if (message) {
      setSnackBarOpened(true)
      reset();
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpened(false);
  };

  return (
    <Box p={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Snackbar
        open={snackBarOpened}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
      >
        <Alert onClose={handleClose} severity="success">
          Booking notification has been successfully sent
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Your Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="startDate"
          control={control}
          defaultValue={selectedDate}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                {...field}
                label="Start Date and Time"
                ampm={false}
                onChange={(newValue) => {
                  field.onChange(newValue);
                  setSelectedDate(newValue || dayjs());
                }}
              />
            </LocalizationProvider>
          )}
        />
        <Controller
          name="duration"
          control={control}
          defaultValue={1} // Default duration (1 hour)
          render={({ field }) => (
            <TextField
              {...field}
              label="Duration (hours)"
              type="number"
              error={!!errors.duration}
              helperText={errors.duration?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="message"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Message"
              error={!!errors.message}
              helperText={errors.message?.message}
              fullWidth
              multiline
              rows={4}
              maxRows={4}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">Book</Button>
      </form>
    </Box>
  );
};
