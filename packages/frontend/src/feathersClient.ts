import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import auth from '@feathersjs/authentication-client';
import { BACKEND_URL } from './constants';

// Initialize the Feathers client
export const feathersClient = feathers();

// Configure REST client
const restClient = rest(BACKEND_URL);
feathersClient.configure(restClient.fetch(window.fetch));
feathersClient.configure(auth());

export const feathersSocketClient = feathers();

// Configure Socket.io client
const socket = io(BACKEND_URL);
feathersSocketClient.configure(socketio(socket));
feathersSocketClient.configure(auth());

export const listenCreatedMessages = (setNewData:(smth:any) => void) => feathersSocketClient.service('messages').on('created', (message:any) => {
  console.log('New message received:', message);
  setNewData(message)
  return message;
});

