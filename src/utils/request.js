import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken,removeToken } from '@/utils/auth'
import { datetime, compareTime, compareDifferTime } from '@/utils'
import { httpAction } from '@/api/manage'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_SERVER_IP + window._CONFIG['apiUrl']
})
window.isRefreshing = false
/* 被挂起的请求数组*/
let refreshSubscribers = []
/* push所有请求到数组中*/
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}
/* 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）*/
function onRrefreshed (token) {
  refreshSubscribers.map(cb => cb(token))
}

// request interceptor
service.interceptors.request.use(
  config => {
    // ------------  修改为 form-data形式  ------------
    config.headers["common"]["Content-Type"] = "multipart/form-data"
    config.url = ""
    console.log("%c [统一修改请求]",'color:red', config);
    // -----------------------------------------------
    // do something before request is sent
    if (store.getters.token) { // 已登录，有token
      config.headers['token'] = getToken()
      if (compareTime(datetime(), store.getters.expireDate, 0)) {
        MessageBox.confirm('登录超时，请重新登录！', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })

        return
      }
      // if (compareDifferTime(datetime(), store.getters.expireDate) < 60 && config.url.indexOf('/pclogin/renewal') === -1) {
      //   // console.log('即将过期')
      //   if (!window.isRefreshing) {
      //     window.isRefreshing = true
      //     store.dispatch('user/renewalToken').then((data) => {
      //       window.isRefreshing = false
      //       onRrefreshed(data.token)
      //       refreshSubscribers = []
      //     })
      //   }
      //   /* 把请求(token)=>{....}都push到一个数组中*/
      //   const retry = new Promise((resolve, reject) => {
      //     /* (token) => {...}这个函数就是回调函数*/
      //     subscribeTokenRefresh((token) => {
      //       config.headers['token'] = token
      //       /* 将请求挂起*/
      //       resolve(config)
      //     })
      //   })
      //   return retry
      // }

      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['token'] = getToken()
      // config.url = config.url + '?access_token=' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      // Message({
      //   message: res.msg || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // });
      if (res.code === 1) {
        if (res.errorCode == 2||res.errorCode == 500) {
          MessageBox.confirm('登录超时，请重新登录！', '系统提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        } else {
          let codeStr = ''
          if (res.msg) {
            const str = res.msg.split(':')
            codeStr = str[str.length - 1]
          }

          // console.log(str[str.length-1])
          Message({
            message: res.errorMsg || '系统异常' + codeStr,
            type: 'warning',
            duration: 3000
          })
          console.log(res.msg)
        }
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: '去登录',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // let err = error.response.data
    // if(err.code == 1&&err.errorCode == 500){
    //   store.dispatch('user/resetToken').then(() => {
    //     location.reload()
    //   })
    // }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
