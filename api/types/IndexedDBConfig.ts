import { StoreConfig } from "./StoreConfig";

export interface IndexedDBConfig {
    dbName: string;
    version: number;
    stores?: StoreConfig[];
}