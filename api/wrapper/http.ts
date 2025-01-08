import { ConfigOptions } from "../utils/ConfigOptions";
import IndexedDBUtility from "../utils/IndexedDBUtility";
import { btoa64 } from "../utils/btoa64";
import { encrypt } from "../utils/encrypt";
import CryptoJS from 'crypto-js';

export function http(_target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        let result = await originalMethod.apply(this, args);
        if (!result) {
            if (ConfigOptions._method === "plain") {
                result = await fetch(ConfigOptions._baseUrl, {
                    method: "Post",
                    headers: ConfigOptions._defaultHeaders ?? {},
                    body: JSON.stringify(args?.[0] ?? "")
                });
                result = await result.json();
            } else {
                const headers = btoa64(JSON.stringify(ConfigOptions._defaultHeaders ?? {}));
                const body = btoa64(JSON.stringify(args?.[0] ?? {}));
                let secret = "";
                if (ConfigOptions._secretKey) {
                    switch (ConfigOptions._secretKey?._cachier) {
                        case "session":
                            secret = sessionStorage.getItem(ConfigOptions._encrypt ? encrypt(ConfigOptions._secretKey._name) : ConfigOptions._secretKey._name) ?? "";
                            break;
                        case "local":
                            secret = localStorage.getItem(ConfigOptions._encrypt ? encrypt(ConfigOptions._secretKey._name) : ConfigOptions._secretKey._name) ?? "";
                            break;
                        case "indexedDB":
                            const db = new IndexedDBUtility();
                            secret = await db.getLast(ConfigOptions._encrypt ? encrypt(ConfigOptions._secretKey._name) : ConfigOptions._secretKey._name);
                            break;
                        default:
                            break;
                    }
                }
                result = await fetch(ConfigOptions._baseUrl, {
                    method: "Get",
                    headers: {
                        "Authorization": btoa64(CryptoJS.HmacSHA256(`${headers}.${body}`, secret).toString(CryptoJS.enc.Hex))
                    }
                });
                result = await result.json();
            }
        }
        return result;
    }
}