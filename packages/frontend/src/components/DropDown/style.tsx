import styled from 'styled-components';
import { ArrowDown } from '../../Icons';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
export const Title = styled.div<{ shown: boolean }>`
  width: 100%;
  height: 30px;
  padding: 5px 10px;
  background: #dddddd;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const Arrow = styled(ArrowDown)<{shown:boolean}>`
  width: 15px;
  height: 15px;
  transform: ${({ shown })=> shown ? 'rotateY(0deg)' : 'rotateZ(180deg)'};
`; 
export const ChildWrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative;
  padding-top: 10px;
`;