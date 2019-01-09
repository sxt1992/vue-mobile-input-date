<template>
    <div id="app">
        <MobileInputDate v-model="d"/>
        <button @click="openDate">通过 全局事件 点击</button><br>
        <button @click="d.visible = !d.visible">通过 组件 点击</button>
    </div>
</template>

<script>
import MobileInputDate from './index.js';

export default {
    name: 'App',
    components: {
        MobileInputDate
    },
    data() {
        return {
            d: {
                visible: false,
                isRange: true,
                startDate: '2013-6-23',
                endDate: '2013-6-23',
                oneDate: '2018-1-9',
                limit: {
                    start: '2010-11-9',
                    end: '2022-6-21'
                }
            }
        };
    },
    watch: {
        'd.startDate'() {
            window.console.log(this.d.startDate, this.d.endDate);
        }
    },
    methods: {
        openDate() {
            // 只有通过Vue.use方式导入才有
            // 通过局部组件方式导入,没有此方法
            // 此方法名和Vue.use时设置的一样
            this.$MobileInputDate && this.$MobileInputDate({
                isRange: true,
                startDate: '',
                endDate: '',
                oneDate: '',
                limit: {
                    start: '2010-10-9',
                    end: '2020-6-21'
                }
            }).then((d) => {
                window.console.log(d);
            });
        }
    }
};
</script>

<style lang="less">
body {
    margin: 0;
    padding: 0;
}
</style>
