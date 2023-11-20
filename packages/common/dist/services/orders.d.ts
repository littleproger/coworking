import { Benefits, Coworking, Rate } from './coworking';
import { User } from './users';
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
} & {
    coworking: Coworking;
    client: User;
};
//# sourceMappingURL=orders.d.ts.map