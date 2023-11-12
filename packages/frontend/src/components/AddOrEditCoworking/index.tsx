import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Benefits, Coworking } from '@coworking/common/dist/services/coworking';
import { Editor } from '@tinymce/tinymce-react';
import { BACKEND_URL } from '../../constants';
import { feathersClient } from '../../feathersClient';
import { useAppSelector } from '../../redux/hooks';
import * as redux from '../../redux';
import { FormLabel } from '@mui/material';


const benefitOptions = [
  'wi-fi', 'fast-wi-fi', 'ownRooms', 'foods', 'stableElectric', 'starlink', 'generators',
  'projectors', 'freeWater', 'roomsForMeetings', 'comfortablePlaces', 'vipRoms',
] as const;

type InformationModalProps = {
  data?: Coworking;
  isOpen: boolean;
  onRequestClose: () => void;
};

export const AddOrEditCoworking = ({ data, isOpen, onRequestClose }: InformationModalProps) => {
  const user = useAppSelector(redux.storeParts.user.getData);

  const { control, handleSubmit, register, setValue, reset, watch } = useForm<Coworking>({
    defaultValues: {
      ...data,
      collageImages: data?.collageImages || [],
      benefits: data?.benefits || [],
      description: '',
    },
  });

  useEffect(() => {
    reset({
      ...data,
      collageImages: data?.collageImages || [],
      benefits: data?.benefits || [],
    });
  }, [data, reset]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'collageImages',
  });

  const resetAll = () => {
    reset({
      ...data,
      collageImages: data?.collageImages || [],
      benefits: data?.benefits || [],
    });
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, cb: (res: any) => void) => {
    if (event?.target?.files?.length || 0 > 0) {
      const file = event?.target?.files?.[0];
      if (!file) return;
      // Create a FormData object to hold the form data to submit
      const formData = new FormData();

      formData.append('image', file);
      try {
        // Send the FormData to the server via fetch or axios
        const response = await fetch(`${BACKEND_URL}/uploads`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        cb(result);
      } catch (error) {
        console.error('Error:', error);
      }
      // Update the file in the form state
    }
  };

  const onEdit = async (newData: Coworking) => {
    try {
      // Convert benefits object to an array and append to FormData
      const selectedBenefits = Object.entries(newData.benefits)
        .filter(([_, value]) => value && typeof value !== 'boolean')
        .map(([_, value]) => value);
      const dataWithCorrectBenefits = {
        ...data,
        benefits: selectedBenefits,
        description: watch('description'),
      };
  
      // Send the FormData to the server via fetch or axios
      const response = await feathersClient.service('coworkings').update(data?._id, dataWithCorrectBenefits);

      const result = await response;
      resetAll();
      onRequestClose();
      // Handle the server response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onSubmit = async (data: Coworking) => {
    if (!user) return console.error('Unexpected mlyo6');
    if (data._id) return await onEdit(data);

    // Convert benefits object to an array and append to FormData
    const selectedBenefits = Object.entries(data.benefits)
      .filter(([_, value]) => value && typeof value !== 'boolean')
      .map(([_, value]) => value);
    const dataWithCorrectBenefits = {
      ...data,
      ownerId: user._id,
      benefits: selectedBenefits,
      description: watch('description'),
    };

    try {
      // Send the FormData to the server via fetch or axios
      const response = await feathersClient.service('coworkings').create(dataWithCorrectBenefits);

      const result = await response;
      resetAll();
      onRequestClose();
      // Handle the server response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to integrate TinyMCE with react-hook-form
  const handleEditorChange = (content: string, editorName: keyof Coworking) => {
    setValue(editorName, content, { shouldValidate: false });
    console.log(watch('description'))
  };

  const benefitsArray: Benefits[] = watch('benefits');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Information Entry"
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      style={{
        overlay: {
          zIndex: 99,
        },
        content: {
          inset: '70px',
        },
      }}
    >
      <h2>Enter Information</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('location', { required: true })}
        />

        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('title', { required: true })}
        />

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <FormLabel>Main Image</FormLabel>
          <label htmlFor="mainImage" style={{ cursor: 'pointer' }}>
            <Avatar
              src={watch('mainImage') || data?.mainImage}
              variant="square"
              sx={{ width: 100, height: 100 }}
            />
          </label>
          <input
            type="file"
            hidden
            accept="image/*"
            id="mainImage"
            onChange={(e) => handleFileChange(e, (result) => {
              if (!result?.fileUrl) return;
              setValue('mainImage', result.fileUrl, { shouldValidate: true });
            })}
          />
        </div>

        {/* Description - Simple TextField, replace with TinyMCE as needed */}
        <FormLabel>Description</FormLabel>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Editor
              {...field}
              onEditorChange={(content) =>{
                handleEditorChange(content, 'description');
              }}
              onChange={(event) =>{
                handleEditorChange(event.target.getContent(), 'description');
              }}
              // onBlur={(event) => handleEditorChange(event.target.getContent(), 'description')}
              // onPaste={(event) => handleEditorChange(event.clipboardData?.getData('text') || '', 'description')}
              apiKey='dbygja01bqvo7658gyed658fmismga1ikmug4b22ou5qtkmb'
              value={field.value}

              init={{
                height: 500,
                menubar: true,
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                file_picker_types: 'image',
                paste_as_text: true,

                file_picker_callback: (cb, value, meta) => {
                  if (meta.filetype === 'image') {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    input.addEventListener('change', (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const base64 = reader.result as string;
                          cb(base64, { alt: file.name });
                        };
                        reader.readAsDataURL(file);
                      }
                    });

                    input.click();
                  }
                },
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          )}
        />

        {/* Collage Images - Dynamically add or remove text fields */}
        <label>Collage Images:</label>
        <List>
          {fields.map((item, index) => (
            <ListItem key={item.id}>
              {item.file ? <ListItemAvatar>
                <Avatar
                  src={item.file ? item.file : undefined}
                  variant="square"
                  sx={{ width: 100, height: 100 }}
                />
              </ListItemAvatar> :
                <Button variant="contained" component="label">
                  Upload File
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, (result) => {
                      if (!result) return;
                      update(index, { ...fields[index], file: result.fileUrl });
                      setValue(`collageImages.${index}.file`, result.fileUrl, { shouldValidate: true });
                    })}
                  />
                </Button>}
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => remove(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => append({ id: '', file: undefined })}
          >
            Add Image
          </Button>
        </List>

        {/* Limit of Users */}
        <TextField
          label="Limit of Users"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          {...register('limitOfUsers', { min: 1 })}
        />

        {/* Benefits checkboxes */}
        <FormGroup>
          {benefitOptions.map((benefit, index) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...register(`benefits.${index}` as const)}
                  checked={benefitsArray.includes(benefit)}
                  onChange={(e) => {
                    const updatedBenefits = e.target.checked
                      ? [...benefitsArray, benefit]
                      : benefitsArray.filter((b) => b !== benefit);
                    setValue('benefits', updatedBenefits);
                  }}
                />
              }
              label={benefit}
              key={benefit}
            />
          ))}
        </FormGroup>

        {/* Rules - Simple TextField, replace with TinyMCE as needed */}
        <TextField
          label="Rules"
          variant="outlined"
          fullWidth
          multiline
          margin="normal"
          {...register('rules')}
        />

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
