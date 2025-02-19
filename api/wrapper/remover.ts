import { CachierType } from "../types";
import IndexedDBUtility from "../utils/IndexedDBUtility";

export function remover(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier: CachierType = target._cachier;
        switch (cachier) {
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.deleteItem(target._name, args?.[0]);
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}