import { MongoClient } from 'mongodb';
import { Application } from './declarations';

export default function (app: Application): void {
  const connection = process.env.MONGODB_URL as string;
  const database = connection.substr(connection.lastIndexOf('/') + 1).split('?')[0];
  const mongoClient = MongoClient.connect(connection)
    .then(client => client.db(database));

  app.set('mongoClient', mongoClient);
}
