import { getter, setter, collector, finder, IndexedDB, adder, remover } from 'cachier-api';

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

    @adder
    static add(order: Order): void {
        if (Orders.data) Orders.data.push(order);
    }

    @remover
    static remove(orderId: string): void {
        if (Orders.data) Orders.data.filter(d => d.orderId !== orderId);
    }
}

export default Orders