import type { ObjectId } from 'mongodb';
import { Benefits, Rate } from './coworking';

export type _= {
  _id?: string;
  clientId: string;
  coworkingId: string;
  startTime: string;
  endTime: string;
  rate?: Rate;
  isPayed: boolean;
  price: string;
  orderedBenefits: Benefits[];
};
