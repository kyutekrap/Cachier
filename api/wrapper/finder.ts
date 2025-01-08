import IndexedDBUtility from "../utils/IndexedDBUtility";
import { CachierType } from "../types";
import { ConfigOptions } from "../utils/ConfigOptions";
import { encrypt } from "../utils/encrypt";
import { decrypt } from "../utils/decrypt";

export function finder(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    const cachier: CachierType = target._cachier;
    switch(cachier) {
        case "session":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    result = sessionStorage.getItem(ConfigOptions._encrypt ? encrypt(target._name) : target._name);
                    if (result) {
                        result = JSON.parse(ConfigOptions._encrypt ? decrypt(result) : result);
                        result = args.reduce((accumulator: { [x: string]: any; }, key: string | number) => {
                            return accumulator && accumulator[key];
                        }, result);
                    }
                }
                return result;
            }
            break;
        case "local":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    result = localStorage.getItem(ConfigOptions._encrypt ? encrypt(target._name) : target._name);
                    if (result) {
                        result = JSON.parse(ConfigOptions._encrypt ? decrypt(result) : result);
                        result = args.reduce((accumulator: { [x: string]: any; }, key: string | number) => {
                            return accumulator && accumulator[key];
                        }, result);
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
                    result = db.get(ConfigOptions._encrypt ? encrypt(target._name) : target._name, args?.[0] ?? "").then(response => {
                        if (response) return ConfigOptions._encrypt ? decrypt(response) : response;
                    });
                }
                return result;
            }
            break;
        default:
            break;
    }
}