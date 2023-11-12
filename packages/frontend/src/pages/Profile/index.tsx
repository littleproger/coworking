import React, { useCallback, useEffect, useState } from 'react';
import * as redux from '../../redux';

import { Coworking } from '@coworking/common/dist/services/coworking';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { SvgIconProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AddOrEditCoworking } from '../../components/AddOrEditCoworking';
import SolidButton from '../../components/SolidButton';
import { UserEditModal } from '../../components/UserEditModal';
import { useQuery } from '../../customHooks/useQuery';
import { feathersClient } from '../../feathersClient';
import { useAppSelector } from '../../redux/hooks';
import { route } from '../../routes';
import './profile.css';

type Modals = {type: 'editUser'} | {type:'addOrEdit', data?:Coworking}|{type: '', data?:Coworking};

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
    <button onClick={props.onClick} className="profile-button1 button" style={{ cursor: 'pointer' }}>
      {props.text}
    </button>
  );
};

type CoworkingItem = Coworking & {
  showModal: (it:Modals) => void;
  refetch: () => void;
}
const CoworkingItem = ({ showModal, refetch, ...coworking }: CoworkingItem) => {
  const removeCoworking = () => {
    feathersClient.service('coworkings').remove(coworking._id);
    refetch();
  };

  return (
    <li className="list-item">
      <span>{coworking.title} <em>{coworking.location}</em></span>
      <div className="profile-container11">
        <EditIcon onClick={() => showModal({ type: 'addOrEdit', data:coworking })} style={{ cursor: 'pointer' }}/>
        <DeleteIcon onClick={removeCoworking}/>
      </div>
    </li>
  );
};

const OrdersItem = () => {
  return (
    <li className="list-item">
      <span>Text</span>
      <div className="profile-container19">
        <DeleteIcon/>
      </div>
    </li>
  );
};

const RequestItem = () => {
  return (
    <li className="profile-li09 list-item">
      <div className="profile-container27">
        <span>
          <span className="profile-text29">Name Surname </span>
          <br className="profile-text30"></br>
          <span className="profile-text31">
                      Phone: +3809712345678
          </span>
          <br className="profile-text32"></br>
          <span className="profile-text33">
                      Email: smth@gmail.com
          </span>
          <br></br>
        </span>
        <span>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit, arcu
                    mus nullam curae mauris pellentesque, nec laoreet convallis
                    dignissim tortor risus.
        </span>
      </div>
      <div className="profile-container28">
        <SolidButton
          className="solid-button-root-class-name3"
        >Accept</SolidButton>
        <DeclineButton text="Decline" onClick={console.log}/>
      </div>
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

  const { data, error, isLoading, refetch } = useQuery<Coworking[]>(getCoworkings);

  useEffect(()=>{
    refetch();
  }, []);

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
          <EditIcon onClick={editProfile}/>
          <UserEditModal
            isOpen={modal.type === 'editUser'}
            onRequestClose={closeModal}
          />
          <DeclineButton text="Log out" onClick={logOut}/>
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
                <p>Loading ...</p>
              ) : coworkings.length ? coworkings.map(it=>(
                <CoworkingItem {...it} showModal={setModal} refetch={refetch}/>
              )) : <p style={{ color: 'lightgray' }}>Nothing there.</p>}
            </ul>
          </div>
          <div className="profile-container15">
            <div className="profile-container16">
              <div className="profile-container17">
                <span>Active by today</span>
                <SolidButton
                  className="solid-button-root-class-name4"
                >See all orders</SolidButton>
              </div>
              <div className="profile-container18">
                <ul className="profile-ul1 list">
                  <OrdersItem />
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-container24">
          <div className="profile-container25">
            <span className="profile-text27">Requests</span>
          </div>
          <div className="profile-container26">
            <ul className="profile-ul2 list">
              <RequestItem />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
