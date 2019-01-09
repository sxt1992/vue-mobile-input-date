import MobileInputDate from './MobileInputDate.vue';

const install = function(Vue, {name = 'MobileInputDate'} = {}) {
    var instance;
    const MID = Vue.extend(MobileInputDate);
    Vue.prototype[`$${name}`] = ({isRange, startDate, endDate, oneDate, limit}) => new Promise((resolve) => {
        if (!instance) {
            instance = new MID({
                el: document.createElement('div')
            });
        }
        // instance即组件对象
        instance.isRange = !!isRange;
        instance.startDate = startDate;
        instance.endDate = endDate;
        instance.oneDate = oneDate;
        if (limit) {
            limit.start && (instance.limit.start = limit.start);
            limit.end && (instance.limit.end = limit.end);
        }

        instance.resolve = resolve;

        instance.isComponent = false;
        instance.initValue();
        document.body.appendChild(instance.$el);
        instance.visible = true;
    });
    Vue.component(name, MobileInputDate);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

const API = {
    version: process.env.VERSION || '1.0.0',
    install
};

export default {
    ...API,
    ...MobileInputDate
};
