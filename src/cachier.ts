import IndexedDBUtility from "./dbutil";

type CachierType = "none" | "session" | "local" | "indexedDB";

function Cachier(type: CachierType) {
    return function (constructor: Function) {
        constructor.prototype.__cachier__ = type;
    };
}

function getter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): any {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        let result = originalMethod.apply(this, args);
        if (!result) {
            const cachier = this.constructor.prototype.__cachier__;
            switch (cachier) {
                case "session":
                    result = sessionStorage.getItem(target as string);
                    break;
                case "local":
                    if (typeof window !== 'undefined')
                    result = localStorage.getItem(target as string);
                    break;
                case "indexedDB":
                    const db = new IndexedDBUtility();
                    db.getAll(target as string).then(response => result = response );
                    break;
                default:
                    break;
            }
        }
        return result;
    };
}

function setter(target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const cachier = this.constructor.prototype.__cachier__;
        switch (cachier) {
            case "session":
                sessionStorage.setItem(target as string, JSON.stringify(args));
                break;
            case "local":
                if (typeof window !== 'undefined')
                localStorage.setItem(target as string, JSON.stringify(args));
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target as string).then(_ => {
                    db.addData(target as string, args).then(_ => {
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
        const cachier: CachierType = this.constructor.prototype.__cachier__;
        switch (cachier) {
            case "session":
                sessionStorage.removeItem(target as string);
                break;
            case "local":
                if (typeof window !== 'undefined')
                localStorage.removeItem(target as string);
                break;
            case "indexedDB":
                const db = new IndexedDBUtility();
                db.clearStore(target as string).then(_ => {
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
    getter,
    setter,
    collector
};