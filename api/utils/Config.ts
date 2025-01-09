import { ConfigOptions } from "./ConfigOptions";
import { IndexedDBConfig } from "../types/IndexedDBConfig";
import { RestApiConfig } from "../types/RestApiConfig";

export class Config extends ConfigOptions {
    encrypt?: boolean;
    salt?: string;
    indexedDBConfig?: IndexedDBConfig;
    restApiConfig?: RestApiConfig;

    constructor(config: Config) {
        super(config);
    }
}