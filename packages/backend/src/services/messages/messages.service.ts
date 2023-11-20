// Initializes the `coworkings` service on path `/coworkings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Messages } from './messages.class';
import hooks from './messages.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'messages': Messages & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  app.use('/messages', new Messages(options, app));

  const service = app.service('messages');

  service.hooks(hooks);
}
