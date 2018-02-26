<template>
    <div id="app">
        <MobileInputDate v-model="d"/>
        <button @click="openDate">点击1-全局事件</button><br>
        <button @click="d.visible = !d.visible">点击2-组件</button>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            d: {
                visible: false,
                isRange: false,
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
    methods: {
        openDate() {
            this.$MobileInputDate({
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
