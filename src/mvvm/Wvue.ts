import Compiler from './Compiler';
import Dep from './Dep';

class Wvue {
    private $data: any;
    private $methods: any;
    constructor(options: any) {
        this._init(options);
    }

    _init(options: any) {
        this.$data = options.data;
        this.$methods = options.methods;

        this._observer();

        new Compiler(options.el, this);
    }

    _observer() {
        Object.keys(this.$data).forEach(key => {
            this._defineProperty(this.$data, key, this.$data[key]);
            this._defineProxy(key);
        });
    }

    _defineProperty(obj: any, key: string, value: any) {
        const dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                console.log('get:', obj, key, value);
                Dep.target !== null && dep.addDep(Dep.target);
                return value;
            },
            set(newValue: any) {
                console.log('set:', obj, key, value, newValue);
                value = newValue;
                dep.notify();
            }
        });
    }

    _defineProxy(key:string) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key];
            },
            set(newValue: any) {
                this.$data[key] = newValue;
            }
        })
    }
}

export default Wvue;
