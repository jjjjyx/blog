
import Vue from 'vue';
import App from './p.vue';

const VueApp = Vue.extend(App);
const app = new VueApp({
  el: '.my-app',
});
