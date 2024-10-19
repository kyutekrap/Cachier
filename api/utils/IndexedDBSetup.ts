import { IndexedDbConfig } from "./IndexedDBConfig";

export const IndexedDBSetup = (config: IndexedDbConfig): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(config.dbName, config.version);
    
        request.onupgradeneeded = () => {
            const db = request.result;
    
            config.stores.forEach((storeConfig) => {
            if (!db.objectStoreNames.contains(storeConfig.name)) {
                    const store = db.createObjectStore(storeConfig.name, {
                        keyPath: storeConfig.keyPath,
                        autoIncrement: storeConfig.autoIncrement || false,
                });
    
                storeConfig.indices?.forEach((index) => {
                    store.createIndex(index.name, index.keyPath, {
                        unique: index.unique || false,
                    });
                });
            }
            });
        };
    
        request.onsuccess = () => {
            resolve(request.result);
        };
    
        request.onerror = () => {
            reject(`Error opening database: ${request.error}`);
        };
    });
};