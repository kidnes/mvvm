console.log('hello');

import Wvue from './mvvm/Wvue';

new Wvue({
    el: '#app',
    data: {
        count: 0
    },
    methods: {
        count: 0,
        onAdd() {
            this.count++;
        },
        onDel() {
            this.count--;
        }
    }
});
