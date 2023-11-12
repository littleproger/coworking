// Initializes the `users` service on path `/users`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Users } from './users.class';
import hooks from './users.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'users': Users & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  app.use('/users', new Users(options, app));

  const service = app.service('users');

  service.hooks(hooks);
}