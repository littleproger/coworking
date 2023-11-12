// Initializes the `coworkings` service on path `/coworkings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Coworkings } from './coworkings.class';
import hooks from './coworkings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'coworkings': Coworkings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  app.use('/coworkings', new Coworkings(options, app));

  const service = app.service('coworkings');

  service.hooks(hooks);
}
