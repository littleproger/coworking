import type { ObjectId } from 'mongodb';
import { Benefits, Rate } from './coworking';

export type Order = {
  _id?: string;
  clientId: string;
  coworkingId: string;
  ownerId: string;
  startTime: string;
  endTime: string;
  rate?: Rate;
  isPayed?: boolean;
  price?: string;
  orderedBenefits?: Benefits[];
};
