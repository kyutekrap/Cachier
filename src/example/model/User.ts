import { Cachier, getter, setter, collector, finder } from 'cachier-api';

export interface User {
    email: string;
    phone: string;
}

@Cachier("session")
export class GlobalUser {

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