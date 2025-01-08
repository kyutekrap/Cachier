import { getter, setter, collector, finder, http } from '../../../api';
import { CachierType } from '../../../api/types';

export interface User {
    email: string;
    phone: string;
}

export interface GlobalUserPayload {
    apiKey: "GlobalUser";
}

export class GlobalUser {

    static _cachier: CachierType = "session";
    static _name = "GlobalUser";
    static _data: User | undefined;
    static _apiKey = "GlobalUser";

    @finder
    static find(key: keyof User): string | undefined {
        return GlobalUser._data?.[key];
    }
    
    @getter
    static get(): User | undefined {
        return GlobalUser._data;
    }

    @setter
    static set(data: User): void {
        GlobalUser._data = data;
    }

    @collector
    static clear(): void {
        GlobalUser._data = undefined;
    }

    @http
    static async fetch(payload: GlobalUserPayload): Promise<User | undefined> {
        return GlobalUser._data;
    }
}

export default GlobalUser