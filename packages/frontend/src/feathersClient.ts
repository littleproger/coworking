import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import auth from '@feathersjs/authentication-client';

import { BACKEND_URL } from './constants';


export const feathersClient = feathers();

const restClient = rest(BACKEND_URL);

// Set up Rest client
feathersClient.configure(restClient.fetch(window.fetch));
feathersClient.configure(auth());
