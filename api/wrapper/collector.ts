import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";
import { ConfigOptions } from "../utils/ConfigOptions";
import { encrypt } from "../utils/encrypt";

export function collector(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier: CachierType = target._cachier;
        switch (cachier) {
            case "session":
                sessionStorage.removeItem(ConfigOptions._encrypt ? encrypt(target._name) : target._name);
                break;
            case "local":
                localStorage.removeItem(ConfigOptions._encrypt ? encrypt(target._name) : target._name);
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target._name);
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}