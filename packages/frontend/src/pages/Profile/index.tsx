import React, { useCallback, useEffect, useState } from 'react';
import * as redux from '../../redux';

import { Coworking } from '@coworking/common/dist/services/coworking';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack, SvgIconProps, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddOrEditCoworking } from '../../components/AddOrEditCoworking';
import SolidButton from '../../components/SolidButton';
import { UserEditModal } from '../../components/UserEditModal';
import { useQuery } from '../../customHooks/useQuery';
import { feathersClient, feathersSocketClient, listenCreatedMessages } from '../../feathersClient';
import { useAppSelector } from '../../redux/hooks';
import { route } from '../../routes';
import './profile.css';
import { Message } from '@coworking/common/dist/services/messages';
import { User } from '@coworking/common/dist/services/users';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { OrdersModal } from '../../components/OrdersModal';
import CircularProgress from '@mui/material/CircularProgress';

type Modals = {type: 'orders', id: string} | {type: 'editUser'} | {type:'addOrEdit', data?:Coworking} | {type: '', data?:Coworking};

const EditIcon = (props:SvgIconProps) => (
  <svg {...props} style={{ cursor: 'pointer' }} viewBox="0 0 1024 1024" className="profile-icon11">
    <path d="M884 300l-78 78-160-160 78-78q12-12 30-12t30 12l100 100q12 12 12 30t-12 30zM128 736l472-472 160 160-472 472h-160v-160z"></path>
  </svg>
);

const DeleteIcon = (props:any) => (
  <svg style={{ cursor: 'pointer' }} onClick={props.onClick} viewBox="0 0 1024 1024" className="profile-icon13">
    <path d="M810 170v86h-596v-86h148l44-42h212l44 42h148zM256 810v-512h512v512q0 34-26 60t-60 26h-340q-34 0-60-26t-26-60z"></path>
  </svg>
);

type DeclineButton = {
  text: string;
  onClick: () =>void;
}
const DeclineButton = (props: DeclineButton) => {
  return (
    <button onClick={props.onClick} className="profile-button1 button" style={{ cursor: 'pointer', background: 'transparent' }}>
      {props.text}
    </button>
  );
};

type CoworkingItemProps = Coworking & {
  showModal: (it:Modals) => void;
  refetch: () => void;
  onRequestClose: () => void;
  onRequestOpen: () => void;
  modal: Modals;
}
const CoworkingItem = ({ showModal, refetch, onRequestClose, onRequestOpen, modal, ...coworking }: CoworkingItemProps) => {
  if (!coworking._id) return null;
  const removeCoworking = () => {
    feathersClient.service('coworkings').remove(coworking._id);
    refetch();
  };

  return (
    <li className="list-item">
      {modal.type === 'orders' && coworking._id === modal.id && <OrdersModal
        isOpen={coworking._id === modal.id}
        onRequestClose={onRequestClose}
        coworkingId={coworking._id}
      />}
      <span>{coworking.title} <em>{coworking.location}</em></span>
      <div className="profile-container11">
        <VisibilityIcon onClick={onRequestOpen} style={{ cursor: 'pointer' }}/>
        <EditIcon onClick={() => showModal({ type: 'addOrEdit', data:coworking })} style={{ cursor: 'pointer' }}/>
        <DeleteIcon onClick={removeCoworking}/>
      </div>
    </li>
  );
};

// const OrdersItem = () => {
//   return (
//     <li className="list-item">
//       <span>Text</span>
//       <div className="profile-container19">
//         <DeleteIcon/>
//       </div>
//     </li>
//   );
// };

const getTitleForMyNotification = (message:Message, coworking:Coworking) => {
  switch (message.status){
    case 'sent':
      return (
        <span>
          <Typography variant='h6' color="gray">Your booking request has been successfully sent to {coworking.title} </Typography>
          <Typography color="gray">
            On location: <em>{coworking.location}</em>
          </Typography>
          <Typography color='gray'>
            From <em>{message.startTime}</em>
          </Typography>
          <Typography color='gray'>
            To <em>{message.endTime}</em>
          </Typography>
        </span>
      )
    case 'accepted':
      return (
        <span>
          <Typography variant='h6' fontWeight='bold' color='green'>Your booking request of {coworking.title} has been successfully approved </Typography>
          <Typography color='green'>
            On location: <em>{coworking.location}</em>
          </Typography>
          <Typography color='green'>
            From: <em>{message.startTime}</em>
          </Typography>
          <Typography color='green'>
            To: <em>{message.endTime}</em>
          </Typography>
        </span>
      )
    case 'rejected':
      return (
        <span>
          <Typography variant='h6' fontWeight='bold' color='red'>From manager of {coworking.title} </Typography>
          <Typography color='red'>
            On location: <em>{coworking.location}</em>
          </Typography>
          <Typography color='red'>
            From: <em>{message.startTime}</em>
          </Typography>
          <Typography color='red'>
            To: <em>{message.endTime}</em>
          </Typography>
        </span>
      )
  }
}

const RequestItem = ({ message, refetchMessages }: {message:Message, refetchMessages:()=>void}) => {
  const user = useAppSelector(redux.storeParts.user.getData);
  const getClient = useCallback(async ()=> {
    const response = await feathersClient.service('users').find({ query:{
      _id: message?.clientId,
    } });

    if (!response.data.length) {
      throw new Error('Client response was not ok MmbfaEvA');
    }
    return response.data;
  }, [message.clientId]);

  const { data: client } = useQuery<User>(getClient);

  const getCoworking = useCallback(async ()=> {
    const response = await feathersClient.service('coworkings').find({ query:{
      _id: message?.coworkingId,
    } });

    if (!response.data.length) {
      throw new Error('Coworking response was not ok Q6tsL7cX');
    }
    return response.data;
  }, [message.clientId]);

  const { data: coworking } = useQuery<Coworking>(getCoworking);

  if (!client?.length || !coworking?.length) return null;

  const removeRequest = async () => {
    const response = await feathersClient.service('messages').remove(message._id);

    if (!response) {
      throw new Error('Client response was not ok TDgypxlH');
    }
    refetchMessages();
  }

  const acceptRequest = async () => {
    const response = await feathersClient.service('messages').update(message._id, {
      ...message,
      status: 'accepted',
    });

    if (!response) {
      throw new Error('Client response was not ok TDgypxlH');
    }
    refetchMessages();
  }

  const isItMyMessage = user?._id === message.clientId;

  return (
    <li className="profile-li09 list-item">
      <div className="profile-container27">
        {isItMyMessage ? (
          getTitleForMyNotification(message, coworking[0])
        ) : (
          <div>
            <Typography variant='h5' fontWeight="bold" color='#FCA311'>New request</Typography>
            <Typography className="profile-text29">Name: {client[0].name} </Typography>

            {client[0].phone && <Typography className="profile-text31">
              Phone: {client[0].phone}
            </Typography>}
            
            {client[0].email && <Typography className="profile-text33">
              Email: {client[0].email}
            </Typography>}
          </div>
        )}
        {message.message && <Typography>
          Message: {message.message}
        </Typography>}
      </div>
      {!isItMyMessage && <div className="profile-container28">
        <SolidButton
          className="solid-button-root-class-name3"
          onClick={acceptRequest}
        >Accept</SolidButton>
        <DeclineButton text="Decline" onClick={removeRequest}/>
      </div>}
    </li>
  );
};

export const Profile = () => {
  const [searchRequest, setRequest] = useState('');
  const [modal, setModal] = useState<Modals>({ type: '' });
  const navigate = useNavigate();

  const dispatch = redux.hooks.useAppDispatch();
  const user = useAppSelector(redux.storeParts.user.getData);


  const logOut = () => {
    dispatch(redux.storeParts.user.logout());
    navigate(route('/sign-in'));
  };

  const getCoworkings = useCallback(async ()=> {
    const response = await feathersClient.service('coworkings').find({ query:{
      ownerId: user?._id, 
    } });

    if (!response.data.length) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  }, [user?._id]);

  const getMessages = useCallback(async ()=> {
    const response = await feathersClient.service('messages').find({ query:{
      $or: [{ ownerId: user?._id, status: 'sent' }, { clientId: user?._id }],
    } });

    if (!response.data.length) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  }, [user?._id]);

  const { data, error, isLoading, refetch } = useQuery<Coworking>(getCoworkings);
  const { data: messages, error: messagesError, isLoading: messagesIsLoading, refetch: refetchMessages } = useQuery<Message>(getMessages, listenCreatedMessages);


  useEffect(()=>{
    refetch();
    feathersSocketClient.service('messages').on('removed', (message:any) => {
      console.log('Removed message received:', message);
      refetchMessages();
    })
    feathersSocketClient.service('messages').on('updated', (message:any) => {
      console.log('Updated message received:', message);
      refetchMessages();
    })
  }, [feathersSocketClient]);

  const editProfile = () => {
    setModal({ type:'editUser' });
  };

  const searchCoworking = (e:React.SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setRequest(value.trim());
  };

  const regExp = new RegExp(`^(${searchRequest}|.* ${searchRequest}).*`, 'i');
  const coworkings = (data || []).filter(it=> {
    return regExp.test(it.title) || regExp.test(it.location);
  });

  const closeModal = () =>{
    refetch();
    setModal({ type:'', data: undefined });
  };

  return (
    <div className="profile-container">
      <div className="profile-container01">
        <div className="profile-container03">
          <div className="profile-profile1">
            {user?.avatar ? <img
              alt="image"
              src={user?.avatar}
              className="profile-image1"
            /> : <AccountCircleIcon style={{ width:'200px', height:'200px', fill: 'lightGray' }}/>}
            <div className="profile-container04">
              <span className="profile-text12">{user?.name}</span>
              <span className="profile-text13">{user?.position}</span>
            </div>
          </div>
          <div className="profile-container05">
            <span>Email: {user?.email}</span>
            <span>Phone: {user?.phone}</span>
          </div>
          <UserEditModal
            isOpen={modal.type === 'editUser'}
            onRequestClose={closeModal}
          />
          <Stack flexDirection='row' gap={2}>
            <EditIcon onClick={editProfile}/>
            <DeclineButton text="Log out" onClick={logOut}/>
          </Stack>
        </div>
      </div>
      <div className="profile-container06">
        <div className="profile-container07">
          <div className="profile-container08">
            <span>My coworkings</span>
            <SolidButton
              className="solid-button-root-class-name1"
              onClick={()=>setModal({ type:'addOrEdit' })}
            >Add +</SolidButton>
            <AddOrEditCoworking
              isOpen={modal.type === 'addOrEdit'}
              onRequestClose={closeModal}
              data={modal.type === 'addOrEdit' ? modal.data : undefined}
            />
          </div>
          <div className="profile-container09">
            <input
              type="text"
              placeholder="Search coworking"
              className="profile-textinput input"
              onChange={searchCoworking}
            />
          </div>
          <div className="profile-container10">
            <ul className="profile-ul list">
              {isLoading ? (
                <CircularProgress />
              ) : coworkings.length ? coworkings.map(it=>(
                <CoworkingItem
                  {...it}
                  showModal={setModal}
                  refetch={refetch}
                  modal={modal}
                  onRequestClose={closeModal}
                  onRequestOpen={()=>setModal({ type:'orders', id: it._id || '' })}
                />
              )) : <p style={{ color: 'lightgray' }}>Nothing there.</p>}
            </ul>
          </div>
        </div>
        <div className="profile-container24">
          <div className="profile-container25">
            <span className="profile-text27">Notifications</span>
          </div>
          <div className="profile-container26">
            <ul className="profile-ul2 list">
              {messagesIsLoading ? (
                <CircularProgress />
              ) : messages?.length ? messages.reverse().map(message=>(
                <RequestItem key={message._id} message={message} refetchMessages={refetchMessages}/>
              )) : <p style={{ color: 'lightgray' }}>Nothing there.</p>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
