/* globals FB, firebase */
import Vue from 'vue'
import App from './App'
import Login from './components/login'
import Index from './components/index'
import AddData from './components/AddData'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
let config = {
  apiKey: 'AIzaSyDVwE2n3_YH-j5OLm-OJKx18fhkzM50-f4',
  authDomain: 'assignment-a022c.firebaseapp.com',
  databaseURL: 'https://assignment-a022c.firebaseio.com',
  storageBucket: 'assignment-a022c.appspot.com',
  messagingSenderId: '358496802319'
}
firebase.initializeApp(config)

FB.init({
  appId: '1272762292765553',
  xfbml: true,
  version: 'v2.8'
})
const router = new VueRouter({
  routes: [
    { path: '/', component: Index },
    { path: '/ping', component: AddData },
    { path: '/login', component: Login },
    { path: '*', redirect: '/' }
  ]
})
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
