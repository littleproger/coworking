export declare type Rate = 0 | 1 | 2 | 3 | 4 | 5;
export declare type Benefits = 'wi-fi' | 'fast-wi-fi' | 'ownRooms' | 'foods' | 'stableElectric' | 'starlink' | 'generators' | 'projectors' | 'freeWater' | 'roomsForMeetings' | 'comfortablePlaces' | 'vipRoms';
export declare type Prices = Partial<Record<Benefits, string>>;
export declare type ImageField = {
    id: string;
    file: string | undefined;
};
export declare type Coworking = {
    _id?: string;
    ownerId: string;
    location: string;
    rate: Rate;
    title: string;
    mainImage: string;
    description: string;
    collageImages: ImageField[];
    limitOfUsers: number;
    benefits: Benefits[];
    rules: string;
    provedBenefits?: boolean;
    prices: Prices;
};
//# sourceMappingURL=coworking.d.ts.map