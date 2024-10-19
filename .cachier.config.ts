import { IndexedDBConfig, GlobalDB } from "cachier-api";

const dbConfig: IndexedDBConfig = {
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