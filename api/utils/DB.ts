import { IndexedDbConfig } from './IndexedDBConfig';
import { IndexedDBSetup } from './IndexedDBSetup';

export class GlobalDB {

    private static data: IDBDatabase | undefined;
    
    static get(): IDBDatabase | undefined {
        return GlobalDB.data;
    }

    static set(data: IndexedDbConfig): void {
        IndexedDBSetup(data).then(response => GlobalDB.data = response);
    }
}