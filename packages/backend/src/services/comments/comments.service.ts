// Initializes the `coworkings` service on path `/coworkings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Comments } from './comments.class';
import hooks from './comments.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'comments': Comments & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    whitelist:['$regex', '$options', '$and'],
  };

  app.use('/comments', new Comments(options, app));

  const service = app.service('comments');

  service.hooks(hooks);
}
