import type { ObjectId } from 'mongodb';
import { Benefits, Rate } from './coworking';

export type Message= {
  _id: string;
  clientId: string;
  coworkingId: string;
  ownerId: string;
  startTime: string;
  endTime: string;
  price?: string;
  message?: string;
  rejected?: true;
};
