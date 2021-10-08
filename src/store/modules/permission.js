import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '@/store'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = [];
      // if (roles.includes('system-admin-role')) { //是系统管理员时 菜单没过滤
      //   accessedRoutes = asyncRoutes || []
      // } else { //其它角色有菜单数据
        let menuData = store.getters.menuData;
        let newMenu = setMenu(menuData,asyncRoutes)
        // 404页面需要放最后面 asyncRoutes[asyncRoutes.length-1]
        accessedRoutes = [...newMenu,...[asyncRoutes[asyncRoutes.length-1]]] || [];
      
        if(accessedRoutes[0].path == "/adminIndex"){
          accessedRoutes[0].path = '/'
          accessedRoutes[0].redirect = accessedRoutes[0].children[0].path
          accessedRoutes[0].children[0].meta.title = '首页'
          accessedRoutes[0].children = [accessedRoutes[0].children[0]]
        }else{
           let arr = [
            // {
            //   path: '/',
            //   component: Layout,
            //   redirect: '/emptyIndex',
            //   children: [
            //     {
            //       path: '/emptyIndex',
            //       component: () => import('@/views/adminIndex/emptyIndex.vue'),
            //       name: 'emptyIndex',
            //       meta: { title: '首页', icon: 'dashboard'}
                
            //     }
            //   ]
            // }
            {
              path: '/',
              redirect: '/index',
              component: () => import('@/views/index'),
              meta: { title: '首页' }
            },
           ]
           accessedRoutes = [...arr,...accessedRoutes]
        }
       
        // accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}
function setMenu(dataA,dataB){
  // debugger
  let arr = [];
  dataA.forEach((itemA)=>{
    dataB.forEach((itmeB,index)=>{
        if(itemA.url == itmeB.path){
          itmeB.meta.title = itemA.name;
          itmeB.meta.icon = itemA.icon;
          if(itemA.childList.length>0){
            dataB[index].children = setMenu(itemA.childList,dataB[index].children)
          }
          arr.push(dataB[index])
        }
    });
  });
  return arr
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
