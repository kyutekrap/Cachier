import { getter, setter, collector, finder, SessionBank } from '../../../api';

export interface User {
    email: string;
    phone: string;
}

export class GlobalUser extends SessionBank {

    private static data: User | undefined;

    @finder
    static find(key: keyof User): string | undefined {
        return GlobalUser.data?.[key];
    }
    
    @getter
    static get(): User | undefined {
        return GlobalUser.data;
    }

    @setter
    static set(data: User): void {
        GlobalUser.data = data;
    }

    @collector
    static clear(): void {
        GlobalUser.data = undefined;
    }
}

export default GlobalUser