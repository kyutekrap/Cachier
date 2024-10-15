import dotenv from 'dotenv';
dotenv.config();

class IndexedDBUtility {
    private db: IDBDatabase | null = null;

    constructor() {
        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB.");
        }
    }

    private async openDatabase(store: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const host = process.env.DB_HOST ?? "test";
            if (host === "test") console.log("Create an environment variable 'DB_HOST'.");
            const request = window.indexedDB.open(host, 1);

            request.onerror = (event) => {
                console.log("Your browser doesn't support a stable version of IndexedDB.");
                reject(event);
            };

            request.onsuccess = (_) => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (_) => {
                this.db = request.result;

                if (!this.db.objectStoreNames.contains(store)) {
                    this.db.createObjectStore(store, { keyPath: "id" });
                }
            };
        });
    }

    public async addData(store: string, data: any[]): Promise<void> {
        await this.openDatabase(store);

        if (this.db) {
            const transaction = this.db.transaction(store, "readwrite");
            const objectStore = transaction.objectStore(store);

            return new Promise((resolve, reject) => {
                data.forEach((value) => {
                    const request = objectStore.add(value);

                    request.onerror = (event) => {
                        console.error("Error adding data:", event);
                        reject(event);
                    };

                    request.onsuccess = () => {
                        
                    };
                });

                transaction.oncomplete = () => {
                    resolve();
                };

                transaction.onerror = (event) => {
                    console.error("Transaction failed:", event);
                    reject(event);
                };
            });
        }
    }

    public async getAll(store: string): Promise<any[]> {
        await this.openDatabase(store);

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

    // public async get(store: string, key: string | number): Promise<any> {
    //     await this.openDatabase(store);

    //     return new Promise((resolve, reject) => {
    //         if (this.db) {
    //             const transaction = this.db.transaction(store, "readonly");
    //             const objectStore = transaction.objectStore(store);
    //             const request = objectStore.get(key);

    //             request.onsuccess = () => {
    //                 if (request.result) {
    //                     resolve(request.result);
    //                 } else {
    //                     resolve(null);
    //                 }
    //             };

    //             request.onerror = (event) => {
    //                 console.error("Error retrieving data by key:", event);
    //                 reject(event);
    //             };
    //         } else {
    //             reject(new Error("Database not initialized"));
    //         }
    //     });
    // }

    public async clearStore(store: string): Promise<void> {
        await this.openDatabase(store);

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
}

export default IndexedDBUtility;