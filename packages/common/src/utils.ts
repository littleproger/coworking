import { ObjectId } from 'mongodb';
export type WithId<T extends string = '_id', K = ObjectId> = Record<T, K>;