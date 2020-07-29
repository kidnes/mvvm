import Watcher from './Watcher';

class Compiler {
    private $el: any;
    private $vm: any;
    constructor (el: string, vm: any) {
        this.$vm = vm;
        this.$el = document.querySelector(el);

        const fragment = this.node2fragment();
        
        this.compileNode(fragment);

        this.$el.appendChild(fragment);
    }

    node2fragment() {
        const fragment = document.createDocumentFragment();
        let child;
        while (child = this.$el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compileNode(node: any) {
        const nodes = node.childNodes
        Array.from(nodes).forEach((node: any) => {
            if (this.isElement(node)) {
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                this.compileText(node)
            }
            node.childNodes.length > 0 && this.compileNode(node)
        });
    }

    compileText(node: any) {
        const reg = /\{\{(.*?)\}\}/g
        const string = node.textContent.match(reg)
        // 取出大括号中的内容，并且处理
        // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
        // 以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
        this.text(node, RegExp.$1)
    }
    // 因为是大括号里面的内容，所以沿用之前的逻辑，都加上watcher
    text(node: any, key: string) {
        new Watcher(this.$vm, key, () => {
            node.textContent = this.$vm[key]
        })
        // 第一次初始化界面， 不然如果不进行赋值操作，
        // 就不会触发watcher里面的回调函数
        node.textContent = this.$vm[key]
    }

    compileElement(node: any) {
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach((arr: any) => {
            if (arr.name.indexOf('v-') > -1) {
                this[`${arr.name.substring(2)}`](node, arr.value);
            }
            if (arr.name.indexOf('@') > -1) {
                // console.log(node, arr.value)
                this.eventHandle(node, arr.name.substring(1), arr.value)
            }
        });
    }

    // 对@xxx事件的处理
    eventHandle(node: any, eventName: string, methodName: string) {
        node.addEventListener(eventName, () => {
            this.$vm.$methods[methodName].call(this.$vm)
        })
    }

    model(node: any, key: string) {
        new Watcher(this.$vm, key, () => {
            node.value = this.$vm[key]
        })
        node.value = this.$vm[key]
        node.addEventListener('input', (e: any) => {
            this.$vm[key] = e.target.value
        })
    }

    isElement(node: any) {
        return node.nodeType === 1;
    }
    isInterpolation(node: any) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}

export default Compiler;
