import type { ObjectId } from 'mongodb';

export type Rate = 0 | 1 | 2| 3 | 4 | 5;
export type Benefits = 'wi-fi' | 'fast-wi-fi' | 'ownRooms' | 'foods' | 'stableElectric' | 'starlink' | 'generators'
                        | 'projectors' | 'freeWater' | 'roomsForMeetings' | 'comfortablePlaces' | 'vipRoms';
export type Prices = Partial<Record<Benefits, string>>;
export type ImageField = {
  id: string; // React Hook Form uses this internally
  file: string | undefined; // This will store the FileList
};

export type Coworking= {
  _id?: string;
  ownerId: string;
  location: string;
  rate: Rate;
  title: string;
  mainImage: string;
  shortDescription: string;
  //TinyMCE
  description: string;
  collageImages: ImageField[];
  limitOfUsers: number;
  benefits: Benefits[];
  //TinyMCE
  rules: string;
  provedBenefits?: boolean;
  prices: Prices;
};

