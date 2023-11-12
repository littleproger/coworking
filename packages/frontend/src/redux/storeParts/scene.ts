import { createSlice } from '@reduxjs/toolkit';


import type { RootState } from '../store';
import { defaultModel, defaultAmbientLight } from './constants';
import { getDefaultEffect, getDefaultLight } from '../../utils/helpers';

export type Arr3ForR3F = [x: number, y: number, z: number];
export type Arr2ForR3F = [x: number, y: number];

export type Id = { _id: string };
export type Geometries =
  'box'
  | 'circle'
  | 'cylinder'
  | 'dodecahedron'
  | 'icosahedron'
  | 'octahedron'
  | 'plane'
  | 'sphere'
  | 'tetrahedron'
  | 'torus';
export type Materials =
  'meshBasicMaterial'
  | 'meshDepthMaterial'
  | 'meshDistanceMaterial'
  | 'meshLambertMaterial'
  | 'meshMatcapMaterial'
  | 'meshNormalMaterial'
  | 'meshPhongMaterial'
  | 'meshPhysicalMaterial'
  | 'meshStandardMaterial'
  | 'meshToonMaterial'
  | 'pointsMaterial'
  | 'rawShaderMaterial'
  | 'shaderMaterial'
  | 'shadowMaterial'
  | 'spriteMaterial';
export type Lights =
  { type: 'spotLight', position: Arr3ForR3F, color: string, penumbra:number, distance: number, angle: number, attenuation: number, anglePower: number, intensity: number, }
  | { type: 'ambientLight', color: string }
  | { type: 'rectAreaLight', width: number, height: number, intensity: number, position: Arr3ForR3F, lookAt: Arr3ForR3F, color: string }
  | { type: 'pointLight', position: Arr3ForR3F, color: string, intensity: number, distance: number, decay: number }
  | { type: 'directionalLight', intensity: number, color: string };
export type Effects = 
  {type:'depthOfField', focusDistance:number, focalLength:number, bokehScale:number, height:number}
  |{type:'bloom', luminanceThreshold:number, luminanceSmoothing:number, height:number}
  |{type:'noise', opacity:number}
  |{type:'vignette', eskil:number, offset:number, darkness:number}
  |{type:'sepia', intensity:number}
  |{type:'scanline', density:number}
  |{type:'pixelation', granularity:number}
  |{type:'glitch'}
export type GeometryArguments = { args: Arr3ForR3F | Arr2ForR3F }
export type MaterialArguments = { color: string }
type XYZ = 'x' | 'y' | 'z';
type X = { [x: string]: number };
type Y = { [y: string]: number };
type Z = { [z: string]: number };
export type PayloadTypeWithXYZ = X | Y | Z
export type PayloadWithAxisType = { axis: XYZ; value: number };
export type PayloadWithoutAxisType = { value: Arr3ForR3F };

export type Obj = {
  _id: string;
  type: Geometries,
  position: Arr3ForR3F,
  rotation: Arr3ForR3F,
  scale: Arr3ForR3F,
  args: Arr3ForR3F | Arr2ForR3F,
  materialType: Materials,
  color: MaterialArguments['color'],
  wireframe: boolean;
}
export type LightWithID = Lights & Id
export type EffectWithID = Effects & Id

export type IState = {
  models: {
    [_id: string]: Obj & MaterialArguments
  };
  lights: {
    [_id: string]: LightWithID
  }
  effects:{
    [type: string]: EffectWithID
  }
  selectedObj: string | null;
};

const setBy = (model: Obj, type: keyof Omit<Obj, '_id' | 'selectedObj' | 'args' | 'wireframe'>, typeAxis: XYZ, value: number) => {
  switch (typeAxis) {
    case 'x':
      return { ...model, [type]: [value, model[type][1], model[type][2]] };
    case 'y':
      return { ...model, [type]: [model[type][0], value, model[type][2]] };
    case 'z':
      return { ...model, [type]: [model[type][0], model[type][1], value] };
  }
};

const initialState: IState = {
  selectedObj: null,
  models: {
    'model-0': {
      _id: 'model-0',
      type: 'box',
      ...defaultModel,
    },
  },
  lights: {
    'light-0': {
      _id: '0',
      type: 'ambientLight',
      ...defaultAmbientLight,
    },
  },
  effects:{
    
  },
};

const deleteById = (key: string, { [key]: deletedKey, ...others }) => others;
export const slice = createSlice({
  name: 'scene',
  initialState: initialState as IState,
  reducers: {
    // set: (state, action: { payload: IState[] | null }) => {
    //   state = action.payload ? action.payload : {};

    //   return state;
    // },
    setSelectedObj: (state, action: { payload: string }) => {
      return { ...state, selectedObj: action.payload };
    },
    updatePosition: (state, action: { payload: PayloadWithAxisType | PayloadWithoutAxisType }) => {
      let newState: IState;
      if (!state.selectedObj) return;
      const id = state.selectedObj;
      const model = state.models[id];
      if (!model) return state;
      if ('axis' in action.payload) {
        newState = { ...state, models: { ...state.models, [id]: setBy(model, 'position', action.payload.axis, action.payload.value) } };
      } else {
        newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], position: action.payload.value } } };
      }
      return newState || state;
    },
    updateRotation: (state, action: { payload: PayloadWithAxisType | PayloadWithoutAxisType }) => {
      let newState: IState;
      if (!state.selectedObj) return;
      const id = state.selectedObj;
      const model = state.models[id];
      if (!model) return state;
      if ('axis' in action.payload) {
        newState = { ...state, models: { ...state.models, [id]: setBy(model, 'rotation', action.payload.axis, action.payload.value) } };
      } else {
        newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], rotation: action.payload.value } } };
      }

      return newState || state;
    },
    updateScale: (state, action: { payload: PayloadWithAxisType | PayloadWithoutAxisType }) => {
      let newState: IState;
      if (!state.selectedObj) return;
      const id = state.selectedObj;
      const model = state.models[id];
      if ('axis' in action.payload) {
        newState = { ...state, models: { ...state.models, [id]: setBy(model, 'scale', action.payload.axis, action.payload.value) } };
      } else {
        newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], scale: action.payload.value } } };
      }

      return newState || state;
    },
    setArgs: (state, action: { payload: { value: Obj['args'] } }) => {
      if (!action.payload.value || !state.selectedObj) return;
      const id = state.selectedObj;
      const newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], args: action.payload.value } } };


      return newState || state;
    },
    setWireframes: (state) => {
      if (!state.selectedObj) return;
      const id = state.selectedObj;
      const newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], wireframe: !state.models[id].wireframe } } };


      return newState || state;
    },
    setMaterial: (state, action: { payload: { value: Obj['materialType'] } }) => {
      if (!state.selectedObj || !action.payload.value) return;
      const id = state.selectedObj;
      const newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], materialType: action.payload.value } } };

      return newState || state;
    },
    setColor: (state, action: { payload: { value: Obj['color'] } }) => {
      if (!state.selectedObj || !action.payload.value) return;
      const id = state.selectedObj;
      const newState = { ...state, models: { ...state.models, [id]: { ...state.models[id], color: action.payload.value } } };

      return newState || state;
    },
    //Lights
    updateLight: (state, action: { payload: { key: keyof LightWithID, value: any } }) => {
      if (!state.selectedObj || !action.payload.value) return;
      const id = state.selectedObj;
      const newState = { ...state, lights: { ...state.lights, [id]: { ...state.lights[id], [action.payload.key]: action.payload.value } } };

      return newState || state;
    },
    patch: (state, action: { payload: Geometries }) => {
      if (state === null) {
        return state;
      }

      const newModels = { ...state.models };
      const newId = Object.keys(state.models).length + 1;
      newModels[`model-${newId}`] = { ...defaultModel, _id: String(`model-${newId}`), type: action.payload };
      state = {
        ...state,
        models: newModels,
      };

      return state;
    },
    patchLight: (state, action: { payload: Lights['type'] }) => {
      if (state === null) {
        return state;
      }

      const newLights: IState['lights'] = { ...state.lights };
      const newId = Object.keys(state.lights).length + 1;
      const defaultLight = getDefaultLight(action.payload);
      newLights[`light-${newId}`] = { ...defaultLight, _id: String(`light-${newId}`), type: action.payload } as LightWithID;
      state = {
        ...state,
        lights: newLights,
      };

      return state;
    },
    patchEffect: (state, action: { payload: Effects['type'] }) => {
      if (state === null || !state.effects || (state.effects && state.effects.hasOwnProperty(action.payload))) {
        return state;
      }

      const newEffects: IState['effects'] = { ...state.effects };
      const defaultEffects = getDefaultEffect(action.payload);
      newEffects[action.payload] = { ...defaultEffects, _id: action.payload, type: action.payload } as EffectWithID;
      state = {
        ...state,
        effects: newEffects,
      };

      return state;
    },
    updateEffect: (state, action: { payload: { key: keyof EffectWithID, value: any } }) => {
      if (!state.selectedObj || !action.payload.value) return;
      const id = state.selectedObj;
      const newState = { ...state, effects: { ...state.effects, [id]: { ...state.effects[id], [action.payload.key]: action.payload.value } } };

      return newState || state;
    },
    remove: (state, action: { payload: string }) => {
      const id = action.payload;
      if (!id) return;
      const isModel = id.match('model');
      const isLight = id.match('light');
      const typeOfSelected = isModel ? 'models' : (isLight ? 'lights' : 'effects');
      const modelsWithRemovedModel = deleteById(id, state[typeOfSelected]);
      return { ...state, selectedObj: null, [typeOfSelected]: modelsWithRemovedModel };
    },
  },
});

export const {
  patch,
  updatePosition,
  updateRotation,
  updateScale,
  setSelectedObj,
  setWireframes,
  setMaterial,
  setArgs,
  setColor,
  patchLight,
  updateLight,
  patchEffect,
  updateEffect,
  remove,
} = slice.actions;

export const get = (state: RootState) => state.scene;

export const reducer = slice.reducer;
