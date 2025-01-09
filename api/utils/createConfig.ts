import { Config } from "./Config";
import { GlobalDB } from "./DB";

export function createConfig(config: Config) {
    new Config(config);
    if (config.indexedDBConfig)
        new GlobalDB(config.indexedDBConfig, config.encrypt ?? false);
};