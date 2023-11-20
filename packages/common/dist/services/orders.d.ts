import { Benefits, Rate } from './coworking';
export declare type Order = {
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
//# sourceMappingURL=orders.d.ts.map