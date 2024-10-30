import { getter, setter, collector, finder, IndexedDB } from '../../../api';

export interface Order {
    orderId: string;
    name: string;
}

export class Orders extends IndexedDB {

    private static data: Order[] | undefined;
    
    @finder
    static async find(orderId: string): Promise<Order | undefined> {
        return Orders.data?.find(d => d.orderId === orderId);
    }

    @getter
    static async get(): Promise<Order[] | undefined> {
        return Orders.data;
    }

    @setter
    static set(data: Order[]): void {
        Orders.data = data;
    }

    @collector
    static clear(): void {
        Orders.data = undefined;
    }
}

export default Orders