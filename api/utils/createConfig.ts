import { Config } from "./Config";
import { GlobalDB } from "./DB";

export default function createConfig(config: Config) {
    new Config(config);
    if (config.indexedDBConfig)
        new GlobalDB(config.indexedDBConfig, false); // config.encrypt
};