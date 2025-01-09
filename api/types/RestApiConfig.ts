import { Constructor } from "./Constructor";

export interface RestApiConfig {
    url: string;
    secretKey?: Constructor<any>;
    method: 'plain' | 'jwt' | 'odata';
    defaultHeaders?: Record<string, string>;
}