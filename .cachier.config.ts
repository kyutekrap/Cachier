import { IndexedDbConfig } from "./api/utils/IndexedDBConfig";
import { GlobalDB } from "./api/utils/DB";

const dbConfig: IndexedDbConfig = {
    dbName: 'MyAppDatabase',
    version: 1,
    stores: [
        {
            name: 'Users',
            keyPath: 'id',
            autoIncrement: true,
            indices: [
                { name: 'email', keyPath: 'email', unique: true }
            ]
        },
        {
            name: 'Orders',
            keyPath: 'orderId',
            autoIncrement: false
        }
    ]
};

GlobalDB.set(dbConfig);