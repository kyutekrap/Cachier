import { IndexedDBConfig } from "../types/IndexedDBConfig";
import { StoreConfig } from "../types/StoreConfig";
import { ConfigOptions } from "./ConfigOptions";
import { encrypt } from "./encrypt";

export class GlobalDB {

    private static data: IDBDatabase | undefined;
    
    static async get(): Promise<IDBDatabase | undefined> {
        if (GlobalDB.data) return GlobalDB.data;
        await GlobalDB.set();
        return GlobalDB.data;
    }

    static async set(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(ConfigOptions._dbName);
        
            request.onupgradeneeded = () => {

            };
        
            request.onsuccess = (event) => {
                const dbRequest = event.target as IDBOpenDBRequest;
                GlobalDB.data = dbRequest.result;
                resolve();
            };
        
            request.onerror = (event) => {
                const error = (event.target as IDBRequest).error;
                console.error('Error opening database:', error);
                reject(error);
            };
        });
    }

    static async remove(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(dbName);
    
            deleteRequest.onsuccess = () => {
                resolve();
            };
    
            deleteRequest.onerror = (event) => {
                const error = (event.target as IDBRequest).error;
                console.error(`Error deleting database:`, error);
                reject(error);
            };
        });
    }

    constructor(config: IndexedDBConfig, toEncrypt: boolean) {
        new Promise<void>((resolve, reject) => {
            if (typeof config.dbName === "string") {
                const request = indexedDB.open(config.dbName, config.version);

                request.onupgradeneeded = () => {
                    const db = request.result;

                    const stores = toEncrypt ? (config.stores || []).map(s => {
                        return {
                            ...s,
                            name: encrypt(s.name)
                        }
                    }) : (config.stores || []);
            
                    stores.forEach((storeConfig: StoreConfig) => {
                        if (!db.objectStoreNames.contains(storeConfig.name)) {
                            const store = db.createObjectStore(storeConfig.name, {
                                keyPath: storeConfig.keyPath,
                                autoIncrement: storeConfig.autoIncrement || false
                            });
                            storeConfig.indices?.forEach((index) => {
                                store.createIndex(index.name, index.keyPath, {
                                    unique: index.unique || false,
                                });
                            });
                        }
                    });

                    for (let i = 0; i < db.objectStoreNames.length; i++) {
                        const storeName = toEncrypt ? encrypt(db.objectStoreNames[i]) : db.objectStoreNames[i];
                        if (!stores?.map(s => s.name)?.includes(storeName)) db.deleteObjectStore(storeName);
                    }
                };

                request.onsuccess = async (event) => {
                    const dbRequest = event.target as IDBOpenDBRequest;
                    GlobalDB.data = dbRequest.result;
                    
                    const dbNames: IDBDatabaseInfo[] = await indexedDB.databases();
                    dbNames.forEach((dbName) => {
                        if (dbName.name !== config.dbName) {
                            const deleteRequest = indexedDB.deleteDatabase(dbName.name ?? "");
                            deleteRequest.onerror = (event) => {
                                console.error('Error deleting database:', (event.target as IDBOpenDBRequest).error);
                            };
                        }
                    });

                    resolve();
                };
            
                request.onerror = (event) => {
                    const error = (event.target as IDBOpenDBRequest).error;
                    console.error('Error opening database:', error);
                    reject(error);
                };
            }
        });
    }
}