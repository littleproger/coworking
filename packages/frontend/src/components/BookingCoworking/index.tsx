import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { user as userRedux } from '../../redux/storeParts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type BookingForm = {
  name: string;
  startDate: Dayjs;
  duration: number; // Duration in hours
};

export const BookingDatePicker: React.FC = () => {
  const user = useAppSelector(userRedux.getData);
  const { control, handleSubmit, formState: { errors } } = useForm<BookingForm>({
    defaultValues: {
      name: user!.name || '',
    },
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  // const dispatch = useAppDispatch();

  const onSubmit = (data: BookingForm) => {
    if (!user!._id) return;
    // Calculate the end time
    const endTime = selectedDate.add(data.duration, 'hour');

    // Create a booking object or perform actions as needed
    const bookingDetails = {
      name: data.name,
      startTime: data.startDate.toISOString(), // or format as needed
      endTime: endTime.toISOString(), // or format as needed
      clientId: user!._id,
      // coworkingId:,
    };

    console.log(bookingDetails);
    // Here, handle the submission of the booking (e.g., sending to an API)
  };

  return (
    <Box p={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <Button type="submit" variant="contained" color="primary">Book</Button>
      </form>
    </Box>
  );
};
