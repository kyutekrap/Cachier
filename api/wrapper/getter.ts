import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";
import { ConfigOptions } from "../utils/ConfigOptions";
import { encrypt } from "../utils/encrypt";
import { decrypt } from "../utils/decrypt";

export function getter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    const cachier: CachierType = target._cachier;
    switch(cachier) {
        case "session":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    if (ConfigOptions._encrypt) {
                        result = sessionStorage.getItem(encrypt(target._name));
                        if (result) result = JSON.parse(decrypt(result));
                    } else {
                        result = sessionStorage.getItem(target._name);
                        if (result) result = JSON.parse(result);
                    }
                }
                return result;
            }
            break;

        case "local":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    if (ConfigOptions._encrypt) {
                        result = localStorage.getItem(encrypt(target._name));
                        if (result) result = JSON.parse(decrypt(result));
                    } else {
                        result = localStorage.getItem(target._name);
                        if (result) result = JSON.parse(result);
                    }
                }
                return result;
            }
            break;

        case "indexedDB":
            descriptor.value = async function (...args: any[]) {
                let result = await originalMethod.apply(this, args);
                if (!result) {
                    const db = new IndexedDBUtility();
                    result = db.getAll(target._name).then(response => response);
                }
                return result;
            }
            break;
        default:
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                return result;
            }
            break;
    }
}