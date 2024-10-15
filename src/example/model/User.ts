import { Cachier, getter, setter, collector } from '../../cachier';

interface UserModel {
    email: string;
    phone: string;
}

@Cachier("session")
class GlobalUser {

    private static data: UserModel | undefined;
    
    @getter
    static get(): UserModel | undefined {
        return GlobalUser.data;
    }

    @setter
    static set(data: UserModel): void {
        GlobalUser.data = data;
    }

    @collector
    static clear(): void {
        GlobalUser.data = undefined;
    }
}

export default GlobalUser;