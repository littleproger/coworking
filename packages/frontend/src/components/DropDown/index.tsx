import { FC, useState } from 'react';
import { ArrowDown } from '../../Icons';
import * as st from './style';

export interface ISelectProps {
  children: any;
  title: string;
}

export const DropDown:FC<ISelectProps> = (props) => {
  const {
    children,
    title,
  } = props;
  const [shown, setShown] = useState(false);

  return (
    <st.Wrapper>
      <st.Title shown={shown} onClick={() => setShown(!shown)}>{title}<st.Arrow shown={shown}/></st.Title>
      {shown && (
        <st.ChildWrapper>{children}</st.ChildWrapper>
      )}
    </st.Wrapper>
  );
};