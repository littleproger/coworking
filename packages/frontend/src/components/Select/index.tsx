import { FC, useState } from 'react';
import * as st from './style';

export interface ISelectProps {
  onClick:(type:any)=>void;
  options: string[];
  title: string;
  value?:string;
}

export const Select:FC<ISelectProps> = (props) => {
  const {
    options,
    onClick,
    title,
    value,
  } = props;
  const [shown, setShown] = useState(false);

  return (
    <st.Wrapper>
      <st.Button shown={shown} onClick={() => setShown(!shown)}>{value || title}</st.Button>
      {shown && (
        <st.List shown={shown}>
          {options.map((option) => {
            return <st.Option key={option} onClick={() => {onClick(option as any); setShown(false);}}>{option}</st.Option>;
          })}
        </st.List>
      )}
    </st.Wrapper>
  );
};