import type { ObjectId } from 'mongodb';

export type User = {
  _id?: string;
  email: string;
  name: string;
  position: string;
  phone: string;
  avatar?: string;
};
