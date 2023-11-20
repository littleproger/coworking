import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { feathersClient, feathersSocketClient } from './feathersClient';
import { Signup } from './containers/Signup';
import * as pages from './pages';
import * as redux from './redux';
import { route } from './routes';
import './app.css';
import { WithHeader } from './containers/WithHeader';

const App = () => {
  const authenticated = redux.hooks.useAppSelector(redux.storeParts.user.getAuthenticated);
  const dispatch = redux.hooks.useAppDispatch();

  useEffect(() => {
    feathersClient.reAuthenticate()
      .then(async ({ user }) => {

        dispatch(redux.storeParts.user.authenticate({ data: user }));
      })
      .catch((err) => {
        if (localStorage.getItem('feathers-jwt')) {
          console.error('reAuthenticate =>', err);
        }
        console.error('err', err);
        dispatch(redux.storeParts.user.logout());
      });
    feathersSocketClient.reAuthenticate();
  }, [dispatch]);

  useEffect(() => {
    const path = route('/sign-in');
    const authStatus = localStorage.getItem('feathers-jwt');
    if (!authenticated && !authStatus && window.location.pathname !== path) {
      window.location.pathname = path;
    }
  }, [authenticated]);

  const innerContent = authenticated === null
    ? null
    : (
      <Routes>
        <Route path={route('/sign-in')} element={<Signup />} />
        <Route path={route('/home')} element={<WithHeader><pages.Home /></WithHeader>} />
        <Route path={route('/profile')} element={<WithHeader><pages.Profile/></WithHeader>} />
        <Route path={route('/coworkings/:coworkingId')} element={<WithHeader><pages.Coworking/></WithHeader>} />
        <Route path="*" element={<pages.NotFound/>} />
      </Routes>
    );

  return (
    <Router>
      {innerContent}
    </Router>
  );
};

export default App;
