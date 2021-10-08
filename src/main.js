import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import 'babel-polyfill'
import VueJsonp from 'vue-jsonp'
import md5 from 'js-md5';
import Vue2OrgTree from 'vue2-org-tree'
import defaultSettings from '@/settings'
import { getToken } from '@/utils/auth'
import Vant from 'vant'
import 'vant/lib/index.css';
import { Toast,Notify,Dialog,ImagePreview,ActionSheet } from 'vant';
import Meta from 'vue-meta'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
const { systemType } = defaultSettings
Vue.use(Vant)
Vue.use(VueJsonp)
Vue.use(Element, {
  size: Cookies.get('size'+systemType) || 'medium' // set element-ui default size
})
Vue.use(Element)
Vue.use(Vue2OrgTree)
Vue.use(ActionSheet);

Vue.use(Meta)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.Toast = Toast;
Vue.prototype.Notify = Notify;
Vue.prototype.Dialog = Dialog;
Vue.prototype.ImagePreview = ImagePreview;

Vue.config.productionTip = false
//全局用户信息
Vue.prototype.user = store.state.user
// md5加密
Vue.prototype.$md5 = md5;
// 系统标识
Vue.prototype.systemType = systemType
// token
Vue.prototype.get_token = getToken()
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
