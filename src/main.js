import Vue from 'vue';
import App from './App.vue';
import './assets/styles/index.css';
import api from './lib/api/api';

Vue.config.productionTip = false;
Vue.prototype.$http = api;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
