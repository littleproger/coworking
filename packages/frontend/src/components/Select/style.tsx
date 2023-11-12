import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 200px;
  height: 30px;
  margin: 10px 0;
`;
export const Button = styled.div<{shown: boolean}>`
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  background: #dddddd;
  border-radius: ${({ shown })=> shown ? '5px 5px 0 0' : '5px'};
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
`;
export const List = styled.ul<{shown: boolean}>`
  /* bottom: 0; */
  width: 100%;
  position: absolute;
  z-index: 5;
  border-top: 2px solid gray;
  background: #dddddd;
  border-radius: ${({ shown })=> shown ? '0 0 5px 5px' : '5px'};
  color: black;
  overflow: hidden;
`;
export const Option = styled.li`
  height: 30px;
  padding: 2px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover{
    background: #ebebeb;
  }
`;