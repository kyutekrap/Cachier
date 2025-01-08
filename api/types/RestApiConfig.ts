import { Constructor } from "./Constructor";

export interface RestApiConfig {
    url: string;
    secretKey?: Constructor<any>;
    method: 'plain' | 'jwt';
    defaultHeaders?: Record<string, string>;
}