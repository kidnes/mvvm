import Dep from './Dep';

class Watcher {
    private $vm: any;
    private $key: any;
    private $cb: any;

    constructor(vm: any, key: any, cb: any) {
        this.$vm = vm;
        this.$key = key;
        this.$cb = cb;
        // 用一个全局变量来指代当前watch
        Dep.target = this;
        console.log('Watcher-------')
        // 实际是访问了this.name，触发了当前变量的get，
        // 当前变量的get会收集当前Dep.target指向的watcher,即当前watcher
        this.$vm[this.$key];
        Dep.target = null;
    }
    update() {
        // 执行
        this.$cb.call(this.$vm, this.$vm[this.$key])
    }
}

export default Watcher;
