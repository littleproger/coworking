import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import { Services } from '@coworking/common';
import { createPopper } from '@popperjs/core';
import { FC, useEffect, useRef, useState } from 'react';
import SolidButton from '../../../components/SolidButton';
import './sign.css';

import { feathersClient } from '../../../feathersClient';
import * as redux from '../../../redux';

const ImageWrapper = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  img{
    object-fit: cover;
    flex: 1;
  }
`;

export interface IProps {
  signType: 'signIn' | 'signUp';
  onChangeType: (type:'signUp' | 'signIn') => void
}


export const Sign:FC = () => {
  const [signType, setSignType] = useState<'signUp' | 'signIn'>('signUp');

  const [data, setData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState<{ [key: string]: string }>({});

  const dispatch = redux.hooks.useAppDispatch();
  const referenceRef = useRef(null);
  const popperRef = useRef(null);
  const referenceRefPasswd = useRef(null);
  const popperRefPasswd = useRef(null);

  const validateData = () => {
    const isValidatedEmail = data.email.toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const isValidatedPasswd = data.password.match(/^[0-9 a-z A-Z]{5,10}$/);

    if (!isValidatedPasswd) setError({ ...error, password: 'Пароль повинен бути в межах від 5 до 10' });
    if (!isValidatedEmail) setError({ ...error, email: 'Перевірте правильність емейлу!' });

    return (isValidatedEmail && isValidatedPasswd);
  };
  const signIn = async (): Promise<Services.users._> => {
    const { accessToken, user } = await feathersClient.service('authentication').create({
      strategy: 'local',
      email: data.email,
      password: data.password,
    });

    localStorage.setItem('feathers-jwt', accessToken);

    return user;
  };

  const signUp = async (): Promise<Services.users._> => {
    const res = await feathersClient.service('users').create({
      name: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'user',
    });

    const { accessToken, user } = await feathersClient.service('authentication').create({
      strategy: 'local',
      email: data.email,
      password: data.password,
    });

    localStorage.setItem('feathers-jwt', accessToken);

    return user;
  };
  const handleSign = (type: IProps['signType']) => async(e:any) => {
    e.preventDefault();

    if (!validateData()) return;
    const isSignUp = type === 'signUp';

    try {
      const user = await (isSignUp ? signUp() : signIn());

      dispatch(redux.storeParts.user.authenticate({ data: user }));
    } catch (e: any) {
      if (e) {
        setError({ ...error, email: e.message });
      }
      console.error(e);
    }
  };
  const handleChangeData = (event: any) => {
    const target = event.target;
    if (!target) return;

    const name = target.name;
    const value = target.value;

    setData({ ...data, [name]: value });
    setError({ ...error, [name]: '' });
  };

  useEffect(() => {
    referenceRef.current && popperRef.current && createPopper(referenceRef.current, popperRef.current, {
      strategy: 'absolute',
      placement: 'top',
    });
    referenceRefPasswd.current && popperRefPasswd.current && createPopper(referenceRefPasswd.current, popperRefPasswd.current, {
      strategy: 'absolute',
      placement: 'top',
    });
  }, [error]);

  const handleSetSignUp = () => {
    setSignType('signUp');
  };
  const handleSetSignIn = () => {
    setSignType('signIn');
  };

  const isSignUp = signType === 'signUp';
  return (
    <div className="sign-container">
      <Helmet>
        <title>Sign - Travel Agency</title>
        <meta property="og:title" content="Sign - Travel Agency" />
      </Helmet>
      <ImageWrapper>
        <img
          alt="image"
          src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?ixid=M3w5MTMyMXwwfDF8c2VhcmNofDR8fG9mZmljZXxlbnwwfHx8fDE2OTcwNTc5MTB8MA&amp;ixlib=rb-4.0.3&amp;w=800"
        />
      </ImageWrapper>
      <div className="sign-container1">
        <span className="sign-text">
          <span>{isSignUp ? 'Sign up' : 'Sign in'}</span>
          <br></br>
        </span>
        <div className="sign-container2">
          <form className="sign-form">
            {isSignUp && <div className="sign-container3">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Enter a full name"
                className="sign-textinput input"
                onChange={handleChangeData}
                name="fullName"
              />
            </div>}
            <div className="sign-container4">
              <label>Email</label>
              <input
                type="text"
                placeholder="Enter an email"
                className="sign-textinput1 input"
                onChange={handleChangeData}
                name="email"
              />
            </div>
            {isSignUp && <div className="sign-container5">
              <label>Phone</label>
              <input
                type="text"
                placeholder="Enter a phone"
                className="sign-textinput2 input"
                onChange={handleChangeData}
                name="phone"
              />
            </div>}
            <div className="sign-container6">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter a password"
                className="sign-textinput3 input"
                onChange={handleChangeData}
                name="password"
              />
            </div>
          </form>
        </div>
        <SolidButton
          className="solid-button-root-class-name"
          onClick={handleSign(signType)}
        >{isSignUp ? 'Sign up' : 'Sign in'}</SolidButton>
        <div className="sign-container7">
          <span className="sign-text07">{
            isSignUp ? 'Do you already have an account?' : 'Don\'t have an account yet?'
          }</span>
          <strong className="sign-text08 pointer" onClick={isSignUp ? handleSetSignIn : handleSetSignUp}>
            <span>Sign {isSignUp ? 'in' : 'up'}</span>
            <br></br>
          </strong>
        </div>
      </div>
    </div>
  );
};

