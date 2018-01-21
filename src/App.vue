<template>
  <div id="app">
    <MobileInputDate type="daterange6" v-model="d" />
    <button @click="d.visible=!d.visible">点击</button>
  </div>
</template>

<script>
import MobileInputDate from './components/MobileInputDate';

export default {
  name: 'App',
  components: {
    MobileInputDate
  },
  data() {
    return {
      d: {
        visible: false,
        startDate: '2013-06-23',
        endDate: '2016-06-23',
        oneDate: '2018-1-9'
      }
    };
  },
  created() {
    window.t = this;
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
