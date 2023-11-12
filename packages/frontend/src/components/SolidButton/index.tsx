import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import './solid-button.css';

const Button = styled.button`
  cursor: pointer;
`;

type SolidButtonProps = {
  className?: string;
  onClick?: (e:any)=>void;
} & ButtonHTMLAttributes<HTMLButtonElement>

const SolidButton = (props:SolidButtonProps) => {
  return (
    <Button {...props} className={`solid-button-container solid-button-button ${props.className} `} onClick={props.onClick}>
      {props.children}
    </Button>
  );
};

SolidButton.defaultProps = {
  text: 'Button',
  rootClassName: '',
  onClick: console.log('P0MHU'),
};


export default SolidButton;
