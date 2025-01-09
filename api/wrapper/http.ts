import { ConfigOptions } from "../utils/ConfigOptions";
import IndexedDBUtility from "../utils/IndexedDBUtility";
import { btoa64 } from "../utils/btoa64";
import { encrypt } from "../utils/encrypt";
import CryptoJS from 'crypto-js';

export function http(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        let result = await originalMethod.apply(this, args);
        if (!result) {
            switch (ConfigOptions._method) {
                case 'jwt':
                    const headers = btoa64(JSON.stringify(ConfigOptions._defaultHeaders));
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
                                secret = await db.getLast(ConfigOptions._secretKey._name);
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
                    break;

                case 'odata':
                    const url = ConfigOptions._baseUrl + "/" + target._name + "?" + Object.entries(args?.[0]).map(([key, value]) => `${key}=${value}`).join('&');
                    result = await fetch(url, {
                        method: "Get",
                        headers: ConfigOptions._defaultHeaders
                    });
                    result = await result.json();
                    break;

                default:
                    result = await fetch(ConfigOptions._baseUrl, {
                        method: "Post",
                        headers: ConfigOptions._defaultHeaders,
                        body: JSON.stringify(args?.[0] ?? "")
                    });
                    result = await result.json();
                    break;
            }
        }
        return result;
    }
}