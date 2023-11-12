// UserEditModal.tsx

import { Avatar, Box, Button, TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@coworking/common/dist/services/users';
import * as redux from '../../redux';
import * as yup from 'yup';
import { feathersClient } from '../../feathersClient';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { BACKEND_URL } from '../../constants';
import SolidButton from '../SolidButton';


// Validation schema
const schema = yup.object({
  email: yup.string().email('Must be a valid email').required('Email is required'),
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  phone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Must be a valid phone number').required('Phone number is required'),
  avatar: yup.string(),
}).required();

interface UserEditModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onRequestClose }) => {
  const defaultValues = useAppSelector(redux.storeParts.user.getData);
  const dispatch = useAppDispatch();
  if (!defaultValues) return null;
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm<Omit<User, '_id'>>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const submitData = async (data:User) =>{
    const res: User = await feathersClient.service('users').patch(defaultValues._id, data);
    console.log(res);
    dispatch(redux.storeParts.user.setUserData(res));
    onRequestClose();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(`${BACKEND_URL}/uploads`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {

          // Set the avatar URL in the form to the returned file URL
          setValue('avatar', result.fileUrl, { shouldValidate: true });
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay:{
          zIndex: 99,
        },
        content:{
          inset: '70px',
        },
      }}>
      <Box p={3}>
        <input
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="avatar-upload"
        />
        <label htmlFor="avatar-upload">
          <Avatar
            src={getValues().avatar || defaultValues.avatar}
            alt={defaultValues.name}
            sx={{ width: 56, height: 56, mb: 2, cursor: 'pointer' }}
          />
        </label>
        <form onSubmit={handleSubmit(submitData)}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Position"
                variant="outlined"
                error={!!errors.position}
                helperText={errors.position?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                variant="outlined"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
                margin="normal"
              />
            )}
          />
          <SolidButton
            className="solid-button-root-class-name3"
            type="submit"
            style={{ marginTop: '30px', padding: '10px 20px', display: 'inline-block' }}
          >Save changes</SolidButton>
        </form>
      </Box>
    </Modal>
  );
};
