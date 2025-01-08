import { getter, setter, collector, finder, adder, remover, CachierType } from 'cachier-api';

export interface Order {
    orderId: string;
    name: string;
}

export class Orders {

    static _cachier: CachierType = "indexedDB";
    static _name: string = "Orders";
    static _data: Order[] | undefined;
    
    @finder
    static async find(orderId: string): Promise<Order | undefined> {
        return Orders._data?.find(d => d.orderId === orderId);
    }

    @getter
    static async get(): Promise<Order[] | undefined> {
        return Orders._data;
    }

    @setter
    static set(data: Order[]): void {
        Orders._data = data;
    }

    @collector
    static clear(): void {
        Orders._data = undefined;
    }

    @adder
    static add(order: Order): void {
        if (Orders._data) Orders._data.push(order);
    }

    @remover
    static remove(orderId: string): void {
        if (Orders._data) Orders._data.filter(d => d.orderId !== orderId);
    }
}

export default Orders