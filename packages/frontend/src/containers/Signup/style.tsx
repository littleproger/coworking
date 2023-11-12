import styled from 'styled-components';


const easeIn = () => `
  animation: 0.5s enter linear;

  @keyframes enter{
    0%{
      opacity: 0;
    }100%{
      opacity: 1;
    }
  }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
 
  background-size: cover;
  *{
    font-family: 'Poppins', sans-serif;
  }
`;

export const Inner = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoginBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  ${easeIn}
`;

export const Card = styled.div<{isFront: boolean}>`
  width: 500px;
  min-height: 400px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transition: all .5s linear;
  transition: all .5s linear;
  border-radius: 15px;
  ${({ isFront })=> !isFront ? `
    -webkit-transform: rotateY(180deg);
    transform: rotateY(180deg);
  ` : ''}
`;
const Face = styled.div<{isFront: boolean}>`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background-color:whitesmoke;  
  border-radius:10px;
  transition: all .5s linear;
  border-radius: 15px;
  background: #121212;
	border: 1px solid #373737;
	border-radius: 10px;
	overflow: hidden;
`;
export const Front = styled(Face)`
  z-index:1;
  box-shadow: ${({ isFront }) => isFront ? ' 3px 3px 5px #aaaaaa32' : '0 0 0 #aaaaaa32' };
`;

export const Back = styled(Face)`
  overflow:hidden;
  z-index:-1;
  display: block;
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
  box-sizing: border-box;
  box-shadow: ${({ isFront }) => !isFront ? ' 5px 5px 5px #aaaaaa32' : '0 0 0 #aaaaaa32' };
  &:before{
    content: "";
	  position: absolute;
	  width: 100%;
	  height: 100%;
	  z-index: -1;
    background-size:100% 100%;
	  -webkit-transform: rotateY(180deg);
	  -moz-transform: rotateY(180deg);
	  -ms-transform: rotateY(180deg);
	  -o-transform: rotateY(180deg);
	  transform: rotateY(180deg);
  }
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background: #121212;
  overflow: hidden;
  border-bottom: 1px solid #373737;
  *{
    transition: all 0.5s;
  }
`;

export const Button = styled.button<{isSelected: boolean}>`
  width: 50%;
  height: 100%;
  border: none;
  text-align: center;
  font-weight: 900;
  font-size: 20px;
  line-height: 39px;
  letter-spacing: 0px;
  color: rgb(140, 140, 140);
  background: none;
  cursor: pointer;
  position: relative;
  ${({ isSelected }) => isSelected && `
    color: #d81a82;
	  font-weight: 700;
  `}
  &:after{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 5px;
    width: 50%;
    background: #d81a82;
    border-radius: 99px 99px 0 0;
    ${({ isSelected }) => isSelected ? 'content: ""' : ''};
  }
  &:hover{
    background: #2c2c2c;
  }
`;
