import Vue from 'vue'
import App from './App'
import Mobile from './Mobile'

var width = document.documentElement.clientWidth;
new Vue({
  el: '#app',
  components: { App },
  render: h => h(width > 500 ? App : Mobile)
})
