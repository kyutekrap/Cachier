import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";

export function setter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier: CachierType = target.__cachier__;
        switch (cachier) {
            case "session":
                sessionStorage.setItem(target.name, JSON.stringify(args?.[0]));
                break;
            case "local":
                if (typeof window !== 'undefined')
                    localStorage.setItem(target.name, JSON.stringify(args?.[0]));
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target.name).then(() => {
                    db.addData(target.name, args?.[0]).then(() => {
                        return;
                    });
                });
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}