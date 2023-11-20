import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';
import { Message } from '@coworking/common/dist/services/messages';

export default function(app: Application): void {
  if (typeof app.channel !== 'function') {
    return;
  }

  app.on('connection', connectionHandler);
  app.on('login', loginHandler);

  setupPublishing(app);
  
  function connectionHandler(connection: any): void {
    if (connection) {
      app.channel('anonymous').join(connection);
    }
  }
  
  function loginHandler(authResult: any, { connection }: any): void {
    if (connection && connection.user) {
      app.channel('anonymous').leave(connection);
      app.channel('authenticated').join(connection);
  
      const userId = connection.user._id;
      app.channel(`userIds/${userId}`).join(connection);
    }
  }


  // function createNotification(message: Message) {
  //   return {
  //     type: 'message',
  //     text: `Нове повідомлення від ${message.clientId}: ${message.message}`,
  //     coworkingId: message.coworkingId,
  //     timestamp: new Date().toISOString(),
  //   };
  // }
  
  function setupPublishing(app: Application) {
    app.publish((data: any, hook: HookContext) => {
      const user = hook.params.user;
      return user ? app.channel(`userIds/${user._id}`) : app.channel('authenticated');
    });
  
    app.service('messages').publish('created', (message:Message) => {
      if (!message.ownerId) return;
      //TODO Change texts for more readable
      return app.channel(`userIds/${message.ownerId}`).send(message);
    });
    app.service('messages').publish('removed', (message:Message) => {
      const { _id, ownerId, ...messageWithoutOwnerId } = message;
      // app.service('messages').create({
      //   ...messageWithoutOwnerId,
      //   message: 'Reservation rejected',
      // });
      //TODO Change texts for more readable
      return app.channel(`userIds/${message.clientId}`).send(message);
    });
    // app.service('messages').publish('removed', (message) => {
    //   console.log('removed', message);
    //   return app.channel(`userIds/${message.clientId}`).send(message);
    // });
  }
}
