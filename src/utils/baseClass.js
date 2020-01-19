class baseClass {
    constructor() {
        return new Proxy(this, {
            get: (target, p) => {
                let prop = Reflect.get(target, p);
                if (typeof prop  === 'function') {
                    return prop.bind(this);
                }
            }
        });
    }
}

module.exports = baseClass;