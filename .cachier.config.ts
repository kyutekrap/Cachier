import { IndexedDBConfig, GlobalDB } from './api';

const dbConfig: IndexedDBConfig = {
    dbName: 'MyAppDatabase',
    version: 1,
    stores: [
        {
            name: '_Users',
            keyPath: 'id',
            autoIncrement: true,
            indices: [
                { name: 'email', keyPath: 'email', unique: true }
            ]
        },
        {
            name: '_Orders',
            keyPath: 'orderId',
            autoIncrement: false
        }
    ]
};

GlobalDB.set(dbConfig);