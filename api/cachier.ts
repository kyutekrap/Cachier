import IndexedDBUtility from './utils/IndexedDBUtility';

type CachierType = "session" | "local" | "indexedDB";

function Cachier(type: CachierType) {
    return function (constructor: Function) {
        constructor.prototype.__cachier__ = type;
    };
}

function finder(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    const cachier = target.prototype.__cachier__;
    switch(cachier) {
        case "session":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    result = sessionStorage.getItem(target.name);
                    if (result) {
                        result = JSON.parse(result);
                        result = args.reduce((accumulator: { [x: string]: any; }, key: string | number) => {
                            return accumulator && accumulator[key];
                        }, result);
                    }
                }
                return result;
            }
            break;
        case "local":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    result = localStorage.getItem(target.name);
                    if (result) {
                        result = JSON.parse(result);
                        result = args.reduce((accumulator: { [x: string]: any; }, key: string | number) => {
                            return accumulator && accumulator[key];
                        }, result);
                    }
                }
                return result;
            }
            break;
        case "indexedDB":
            descriptor.value = async function (...args: any[]) {
                let result = await originalMethod.apply(this, args);
                if (!result) {
                    const db = new IndexedDBUtility();
                    result = db.get(target.name, args?.[0] ?? "").then(response => response);
                }
                return result;
            }
            break;
        default:
            break;
    }
}

function getter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    const cachier = target.prototype.__cachier__;
    switch(cachier) {
        case "session": 
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    result = sessionStorage.getItem(target.name);
                    if (result) result = JSON.parse(result);
                }
                return result;
            }
            break;
        case "local":
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                if (!result) {
                    result = localStorage.getItem(target.name);
                    if (result) result = JSON.parse(result);
                }
                return result;
            }
            break;
        case "indexedDB":
            descriptor.value = async function (...args: any[]) {
                let result = await originalMethod.apply(this, args);
                if (!result) {
                    const db = new IndexedDBUtility();
                    result = db.getAll(target.name).then(response => response);
                }
                return result;
            }
            break;
        default:
            descriptor.value = function (...args: any[]) {
                let result = originalMethod.apply(this, args);
                return result;
            }
            break;
    }
}

function setter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier = target.prototype.__cachier__;
        switch (cachier) {
            case "session":
                sessionStorage.setItem(target.name, JSON.stringify(args?.[0]));
                break;
            case "local":
                if (typeof window !== 'undefined')
                    localStorage.setItem(target.name, JSON.stringify(args?.[0]));
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target.name).then(() => {
                    db.addData(target.name, args?.[0]).then(() => {
                        return;
                    });
                });
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}

function collector(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier = target.prototype.__cachier__;
        switch (cachier) {
            case "session":
                sessionStorage.removeItem(target.name);
                break;
            case "local":
                if (typeof window !== 'undefined')
                    localStorage.removeItem(target.name);
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target.name).then(() => {
                    return;
                });
                break;
            default:
                break;
        }
        originalMethod.apply(this, args);
    };
}

export {
    Cachier,
    finder,
    getter,
    setter,
    collector
};