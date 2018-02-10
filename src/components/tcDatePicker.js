import MobileInputDate from './MobileInputDate.vue';

export default function(Vue) {
  var instance;
  const MobileInputDate = Vue.extend(MobileInputDate);
  Vue.prototype.$tcDatePicker = baseElem => new Promise((resolve, reject) => {
    if (!instance) {
      instance = new MobileInputDate({
        el: document.createElement('div')
      });
    }
    // instance即组件对象
    instance.baseElem = baseElem;
    instance.confirm = () => resolve();
    document.body.appendChild(instance.$el);
    instance.showPopWin = true;
  });
};
