// Initializes the `coworkings` service on path `/coworkings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Orders } from './orders.class';
import hooks from './orders.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'orders': Orders & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  app.use('/orders', new Orders(options, app));

  const service = app.service('orders');

  service.hooks(hooks);
}
