import { setter } from '../../../api';
import { CachierType } from '../../../api/types';

export class GlobalToken {

    static _cachier: CachierType = "session";
    static _name = "GlobalToken";
    static _data = "";

    @setter
    static set(data: string): void {
        GlobalToken._data = data;
    }
}

export default GlobalToken