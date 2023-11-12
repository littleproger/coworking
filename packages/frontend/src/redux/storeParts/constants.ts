import { Obj } from './scene';

export const defaultModel: Omit<Obj, '_id' | 'type'> = {
  position: [0, 0.5, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  args: [1, 1, 1],
  wireframe: false,
  materialType: 'meshStandardMaterial',
  color: 'orange',
};

export const defaultAmbientLight = {
  color: 'white',
};
export const defaultSpotLight = {
  position: [0, 1.5, 0],
  penumbra: 0,
  distance: 10,
  angle: 0.35,
  attenuation: 7,
  anglePower: 4,
  intensity: 2,
  color: 'white',
};
export const defaultRectAreaLight = {
  size: [0.5, 0.5],
  intensity: 1,
  position: [0, 1.5, 0],
  lookAt: [0, 0, 0],
  color: 'white',
};
export const defaultPointLight = {
  color: 'white',
  position: [0, 1.5, 0],
  intensity: 1,
  distance: 2,
  decay: 2,
};
export const defaultDirectionalLight = {
  intensity: 1,
  color: 'white',
};
//Effects
export const defaultDepthOfField = {
  focusDistance: 0,
  focalLength: 0.02,
  bokehScale: 2,
  height: 480,
};
export const defaultBloom = {
  luminanceThreshold: 0,
  luminanceSmoothing: 0.9,
  height: 300,
};
export const defaultNoise = {
  opacity: 0.02,
};
export const defaultVignette = {
  eskil: false,
  offset: 0.1,
  darkness: 1.1,
};
export const defaultSepia = {
  intensity: 1.0,
};
export const defaultScanline = {
  density: 2,
};
export const defaultPixelation = {
  granularity: 5,
};