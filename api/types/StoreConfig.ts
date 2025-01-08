export interface StoreConfig {
    name: string;
    keyPath: string;
    autoIncrement?: boolean;
    indices?: {
        name: string;
        keyPath: string | string[];
        unique?: boolean;
    }[];
}