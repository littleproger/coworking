import { Application } from '../declarations';
import users from './users/users.service';
import coworkings from './coworkings/coworkings.service';
import uploads from './uploads/uploads.service';
import messages from './messages/messages.service';
import orders from './orders/orders.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(coworkings);
  app.configure(uploads);
  app.configure(messages);
  app.configure(orders);
}
