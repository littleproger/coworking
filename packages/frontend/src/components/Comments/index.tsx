import React, { useCallback, useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, Rating, Avatar } from '@mui/material';
import { feathersClient } from '../../feathersClient';
import { useQuery } from '../../customHooks/useQuery';
import * as redux from '../../redux';
import { useAppSelector } from '../../redux/hooks';

export interface CommentType {
  _id: string;
  author: string;
  avatar: string;
  text: string;
  rating: number;
  coworkingId: string;
  clientId: string;
}

interface CommentProps {
  comment: CommentType;
}

export type SubmitCommentProps = Omit<CommentType, 'coworkingId' | 'clientId' | '_id' | 'avatar'>;

interface CommentFormProps {
  onCommentSubmit: (comment:SubmitCommentProps ) => void;
}

interface CommentsSectionProps {
  coworkingId: string;
}


const Comment = ({ comment }:CommentProps) => {
  const user = useAppSelector(redux.storeParts.user.getData);

  const canDeleteComment = user?._id === comment.clientId;
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={comment.avatar} sx={{ marginRight: 2 }} />
        <Box>
          <Typography variant="subtitle2">{comment.author}</Typography>
          <Typography variant="body2">{comment.text}</Typography>
          <Rating value={comment.rating} readOnly />
        </Box>
      </CardContent>
    </Card>
  );
}

const CommentForm = ({ onCommentSubmit }:CommentFormProps) => {
  const user = useAppSelector(redux.storeParts.user.getData);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState(user?.name || '');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onCommentSubmit({ text: comment, author, rating });
    setComment('');
    setAuthor('');
    setRating(0);
  };

  return (
    <Box component="form" sx={{ marginBottom: 4 }}>
      <TextField
        label="Your Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Your Comment"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Box display="flex" flexDirection="column">
        <Box display='flex' flexDirection="row" alignItems="center" gap={2} sx={{ marginBottom: 2 }}>
          <Typography>Rate:</Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue || 0);
            }}
          />
        </Box>
        <Button variant="contained" onClick={handleSubmit}>Submit Comment</Button>
      </Box>
    </Box>
  );
}

export const CommentsSection = ({ coworkingId }:CommentsSectionProps) => {
  const user = useAppSelector(redux.storeParts.user.getData);
  
  const getComments = useCallback(async () => {
    const response = await feathersClient.service('comments').find({ query:{ coworkingId } });

    if (!response) {
      throw new Error('Network response was not ok AFXQOR5Z ');
    }
    return response.data;
  }, [coworkingId]);

  const getOrders = useCallback(async () => {
    const response = await feathersClient.service('orders').find({ query:{
      clientId: user?._id,
      endTime: { $lt: new Date().toISOString() },
      coworkingId,
      $limit: 1,
    } });

    if (!response) {
      throw new Error('Network response was not ok N6QI9jXD ');
    }
    return [response.total > 0];
  }, [coworkingId]);

  const { data: comments, error: commentsError, isLoading: isLoadingComments, refetch: commentsRefetch } = useQuery<CommentType>(getComments);
  const { data: isHaveOrderBefore, error: orderError, refetch: orderRefetch } = useQuery<boolean>(getOrders);

  const submitComment = async (comment:SubmitCommentProps) => {
    const res = await feathersClient.service('comments').create({
      ...comment,
      coworkingId,
      clientId: user?._id,
      avatar: user?.avatar,
    });
    if (!res) throw new Error('Network response was not ok FqZHDrN0')
    commentsRefetch()
  }

  const canAddComment = (isHaveOrderBefore || [])[0]
  console.log(canAddComment)

  return (
    <Box width="100%" padding="4em" borderTop="1px solid rgba(0,0,0,0.04)">
      <Typography variant="h6" sx={{ marginBottom: 6 }}>Comments:</Typography>
      <Box border="1px solid rgba(0,0,0,0.04)" padding="4em">
        {canAddComment && <CommentForm onCommentSubmit={submitComment} />}
        {comments?.length ? comments.map(comment=>(
          <Comment key={comment._id} comment={comment} />
        )) : <p style={{ color: 'lightgray' }}>Nothing there.</p>}
      </Box>
    </Box>
  );
}


