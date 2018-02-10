<template>
  <div id="app">
    <MobileInputDate type="daterange" v-model="d" :visible.sync="visible" />
    <button @click="visible=!visible">点击</button>
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
      visible: false,
      d: {
        startDate: '2013-06-23',
        endDate: '2016-06-23',
        oneDate: '2018-1-9'
      }
    };
  },
  created() {
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
