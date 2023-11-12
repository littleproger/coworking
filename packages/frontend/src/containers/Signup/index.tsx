import { FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Sign } from './Sign';
import * as redux from '../../redux';
import { route } from '../../routes';
import * as st from './style';

export const Signup: FC = () => {
  const authenticated = redux.hooks.useAppSelector(redux.storeParts.user.getAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authenticated || window.location.pathname !== '/sign-in') {
      return;
    }

    if ((location.state as any)?.shouldReturnBack === true) {
      return void navigate(-1);
    }

    navigate(route('/home'));
  }, [authenticated, navigate, location]);

  if (authenticated) return null;

  return (
    <st.Wrapper>
      
      <Sign/>

    </st.Wrapper>
  );
};
