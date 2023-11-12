import * as cnst from '../redux/storeParts/constants';
import { Effects, Lights } from '../redux/storeParts/scene';
import { css } from 'styled-components';

export const getRefElement = <T>(
  element?: React.RefObject<Element> | T,
): Element | T | undefined | null => {
  if (element && 'current' in element) {
    return element.current;
  }

  return element;
};
export const getDefaultLight = (type:Lights['type']) => {
  switch (type){
    case 'spotLight':
      return cnst.defaultSpotLight;
    case 'ambientLight':
      return cnst.defaultAmbientLight;
    case 'pointLight':
      return cnst.defaultPointLight;
    case 'directionalLight':
      return cnst.defaultDirectionalLight;
    case 'rectAreaLight':
      return cnst.defaultRectAreaLight;
  }
};
export const getDefaultEffect = (type:Effects['type']) => {
  switch (type){
    case 'depthOfField':
      return cnst.defaultDepthOfField;
    case 'bloom':
      return cnst.defaultBloom;
    case 'noise':
      return cnst.defaultNoise;
    case 'vignette':
      return cnst.defaultVignette;
    case 'sepia':
      return cnst.defaultSepia;
    case 'scanline':
      return cnst.defaultScanline;
    case 'pixelation':
      return cnst.defaultPixelation;
  }
};
export const customScroll = css`
    ::-webkit-scrollbar {
      width: 8px;
    background: #E6E6E6;
    border-radius: 16px;
  }
    ::-webkit-scrollbar-thumb {
      background: rgba(170,170,170,.8);
    border-radius: 17px;
  }
    ::-webkit-scrollbar-thumb:hover {
      rgba(170, 170, 170, 1);
  }
    `;