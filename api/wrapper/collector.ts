import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";

export function collector(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier: CachierType = target.__cachier__;
        switch (cachier) {
            case "session":
                sessionStorage.removeItem(target.name);
                break;
            case "local":
                if (typeof window !== 'undefined')
                    localStorage.removeItem(target.name);
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target.name).then(() => {
                    return;
                });
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}