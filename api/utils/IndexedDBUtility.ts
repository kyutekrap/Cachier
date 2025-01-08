import { ConfigOptions } from "./ConfigOptions";
import { GlobalDB } from "./DB";
import { encrypt } from "./encrypt";

class IndexedDBUtility {

    private db: IDBDatabase | undefined;
    private promise: Promise<void>;

    constructor() {
        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB.");
        }

        this.promise = GlobalDB.get().then(res => { this.db = res; });
    }

    public async addData(store: string, data: any[]): Promise<void> {
        await this.promise;
        return new Promise((resolve, reject) => {
            if (this.db) {
                const transaction = this.db.transaction(store, "readwrite");
                const objectStore = transaction.objectStore(store);

                data.forEach((value: any) => {

                    if (ConfigOptions._encrypt) {
                        if (typeof value === 'object') {
                            for (const [prop, propValue] of Object.entries(value)) {
                                value[prop] = encrypt(propValue as string);
                            }
                        } else {
                            value = encrypt(value);
                        }
                    }

                    const request = objectStore.put(value);
                    request.onerror = (event) => {
                        console.error("Error adding data:", event);
                        reject(event);
                    };
                });

                transaction.oncomplete = () => {
                    resolve();
                };

                transaction.onerror = (event) => {
                    console.error("Transaction failed:", event);
                    reject(event);
                };
            } else {
                reject(new Error("Database not initialized"));
            }
        });
    }

    public async getAll(store: string): Promise<any[]> {
        await this.promise;
        return new Promise((resolve, reject) => {
            if (this.db) {
                const transaction = this.db.transaction(store, "readonly");
                const objectStore = transaction.objectStore(store);
                const request = objectStore.getAll();

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = (event) => {
                    console.error("Error retrieving all data:", event);
                    reject(event);
                };
            } else {
                reject(new Error("Database not initialized"));
            }
        });
    }

    public async get(store: string, key: string | number): Promise<any> {
        await this.promise;
        return new Promise((resolve, reject) => {
            if (this.db) {
                const transaction = this.db.transaction(store, "readonly");
                const objectStore = transaction.objectStore(store);
                const request = objectStore.get(key);

                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = (event) => {
                    console.error("Error retrieving data by key:", event);
                    reject(event);
                };
            } else {
                reject(new Error("Database not initialized"));
            }
        });
    }

    public async getLast(store: string): Promise<any> {
        await this.promise;
        return new Promise((resolve, reject) => {
            if (this.db) {
                const transaction = this.db.transaction(store, "readonly");
                const objectStore = transaction.objectStore(store);
                const request = objectStore.openCursor(null, 'prev');

                request.onsuccess = (event: Event) => {
                    const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                    
                    if (cursor) {
                        resolve(cursor.value);
                    } else {
                        resolve(null);
                    }
                };
    
                request.onerror = () => {
                    reject('Error reading from store');
                };
            } else {
                reject(new Error("Database not initialized"));
            }
        });
    }

    public async clearStore(store: string): Promise<void> {
        await this.promise;
        return new Promise((resolve, reject) => {
            if (this.db) {
                const transaction = this.db.transaction(store, "readwrite");
                const objectStore = transaction.objectStore(store);
                const request = objectStore.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = (event) => {
                    console.error(`Error clearing the ${store} store:`, event);
                    reject(event);
                };
            } else {
                reject(new Error("Database not initialized"));
            }
        });
    }

    public async deleteItem(store: string, key: string | number): Promise<any> {
        await this.promise;
        return new Promise((resolve, reject) => {
            if (this.db) {
                const transaction = this.db.transaction(store, "readwrite");
                const objectStore = transaction.objectStore(store);
                const request = objectStore.delete(key);

                request.onsuccess = () => {
                    if (request.result) {
                        resolve(request.result);
                    } else {
                        resolve(null);
                    }
                };

                request.onerror = (event) => {
                    console.error("Error retrieving data by key:", event);
                    reject(event);
                };
            } else {
                reject(new Error("Database not initialized"));
            }
        });
    }
}

export default IndexedDBUtility;