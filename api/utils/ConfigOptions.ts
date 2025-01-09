import { Config } from "./Config";
import { Constructor } from "../types/Constructor";

export class ConfigOptions {

    static _encrypt: boolean = false;
    static _salt: string = "";
    static _baseUrl: string = "";
    static _apiKey: string = "";
    static _method: "plain" | "jwt" | "odata" = "plain";
    static _defaultHeaders: Record<string, string> = {};
    static _secretKey: Constructor<any> | undefined;
    static _dbName: string = "";

    constructor(config: Config) {
        ConfigOptions._encrypt = config.encrypt ?? false;
        ConfigOptions._salt = (config.salt ?? "").padEnd(32, '0');
        ConfigOptions._baseUrl = config.restApiConfig?.url ?? "";
        ConfigOptions._method = config.restApiConfig?.method ?? "plain";
        ConfigOptions._defaultHeaders = config.restApiConfig?.defaultHeaders ?? {};
        ConfigOptions._secretKey = config.restApiConfig?.secretKey;
        ConfigOptions._dbName = config.indexedDBConfig?.dbName ?? "";
    }
}