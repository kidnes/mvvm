class Dep {
    public static target: any = null;
    private dep: any;

    constructor() {
        this.dep = [];
    }
    addDep(dep: any) {
        this.dep.push(dep);
    }
    notify() {
        // 通知所有的watcher执行更新
        this.dep.forEach((watcher: any) => {
            watcher.update();
        });
    }
}

export default Dep;
