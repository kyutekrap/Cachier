import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";
import { ConfigOptions } from "../utils/ConfigOptions";
import { encrypt } from "../utils/encrypt";

export function setter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier: CachierType = target._cachier;
        switch (cachier) {
            case "session":
                if (ConfigOptions._encrypt) {
                    sessionStorage.setItem(encrypt(target._name), encrypt(JSON.stringify(args?.[0])));
                } else {
                    sessionStorage.setItem(target._name, JSON.stringify(args?.[0]));
                }
                break;
            case "local":
                if (ConfigOptions._encrypt) {
                    localStorage.setItem(encrypt(target._name), encrypt(JSON.stringify(args?.[0])));
                } else {
                    localStorage.setItem(target._name, JSON.stringify(args?.[0]));
                }
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target._name).then(() => {
                    db.addData(target._name, args?.[0]);
                });
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}