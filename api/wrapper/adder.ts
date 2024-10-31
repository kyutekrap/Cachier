import { CachierType } from "../types";
import IndexedDBUtility from "../utils/IndexedDBUtility";

export function adder(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier: CachierType = target.__cachier__;
        switch (cachier) {
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.addData(target.name, args).then(() => {
                    return;
                });
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}