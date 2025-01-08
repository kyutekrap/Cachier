import { CachierType } from "./Cachier";

export interface Constructor<T = any> {
    _cachier: CachierType;
    _name: string;
    new (...args: any[]): T;
}