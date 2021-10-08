import {
  login,
  wxLogin,
  logout,
  getInfo
} from '@/api/user'
import {
  httpAction
} from '@/api/manage'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'
const {
  systemType
} = defaultSettings
import {
  datetime,
  compareTime
} from '@/utils'
import {
  Message
} from 'element-ui'
const state = {
  token: getToken(),
  expireDate: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  member: {},
  menuData: [],
  btnJump: [],
  groupId: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EXPIRE: (state, expireDate) => {
    state.expireDate = expireDate
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENBER: (state, member) => {
    state.member = member
  },
  SET_MENU: (state, menuData) => {
    state.menuData = menuData
  },
  SET_BTNJUMP: (state, btnJump) => {
    state.btnJump = btnJump
  },
  SET_GROUPID: (state, groupId) => {
    state.groupId = groupId
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    // 账号密码登录
    const {
      username,
      password,
      system
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response

        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    // // 授权登录
    // const { code} = userInfo
    // return new Promise((resolve, reject) => {
    //   wxLogin({ code: code}).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data)
    //     setToken(data)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({
    commit,
    state
  }, token) {
    if (!state.token) {
      commit('SET_TOKEN', token.Token)
    }
    return new Promise((resolve, reject) => {
      // let datas = {
      //   roles: ['admin'],
      //   introduction: 'I am a super administrator',
      //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      //   name: 'Super Admin'
      // }
      // commit('SET_ROLES', datas.roles)
      // commit('SET_NAME', datas.name)
      // commit('SET_AVATAR', datas.avatar)
      // commit('SET_INTRODUCTION', datas.introduction)
      // resolve(datas)
      getInfo(state.token).then(response => {

        const {
          data
        } = response
        commit('SET_EXPIRE', data.expireDate)
        let member = data.member;
        member.departRange = data.departRange;
        commit('SET_MENBER', member)
        // commit('SET_MENU', data.treeResources)
        Cookies.set('member' + systemType, member)

        let btnJump = []
        // data.treeResources.forEach((item, index) => {
        //   let child = item.childList;
        //   if (child.length > 0) {
        //     if (index == 0) {
        //       btnJump.push(child[0].url)
        //     } else {
        //       child.forEach((childItem) => {
        //         btnJump.push(childItem.url)
        //       });
        //     }

        //   }
        // });
        // commit('SET_BTNJUMP', btnJump)
        // let memberCode = data.roleCodes;

        let datas = {
          // roles: memberCode,
          roles: ['system-admin-role'],
          introduction: 'I am a super administrator',
          avatar: window._CONFIG['imgView'] + (data.member.photo ? data.member.photo :
            '2c9367df6f8d281e016f8e2a28000000'),
          name: member.realName
        }

        // company-leader-role //领导
        // system-admin-role //管理员
        commit('SET_ROLES', datas.roles)
        commit('SET_NAME', datas.name)
        commit('SET_AVATAR', datas.avatar)
        commit('SET_INTRODUCTION', datas.introduction)
        resolve(datas)

        // commit('SET_ROLES', roles)
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        // resolve(data)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_MENBER', [])
        commit('SET_MENU', [])

        Cookies.remove('member' + systemType)

        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, {
          root: true
        })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // set token
  setToken({
    commit,
    dispatch
  }, token) {
    return new Promise(resolve => {
    commit('SET_TOKEN', token)
    resolve()
    })
  },
  // remove token
  resetToken({
    commit,
    dispatch
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_MENBER', [])
      commit('SET_MENU', [])
      commit('SET_BTNJUMP', [])
      Cookies.remove('member' + systemType)

      resetRouter()
      removeToken()

      resolve()
    })
  },
  //token更新
  renewalToken({
    commit,
    dispatch
  }) {
    return new Promise(resolve => {
      httpAction('/pclogin/renewal', {}).then((res) => {
        let data = res.data
        commit('SET_TOKEN', data.token)
        commit('SET_EXPIRE', data.expireDate)
        setToken(data.token)
        getInfo()
        resolve(data)
      })

    })
  },

  // dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {
        roles
      } = await dispatch('getInfo')

      resetRouter()
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      console.log(accessRoutes)
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  },

  // 创建一个组消息
  createGroupMessage({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      httpAction('/message/linkcustomer', data).then(res => {
        commit('SET_GROUPID', res.data.id);
        resolve(res);
      }).catch(err => {
        reject(err)
      });
    });
  },

  resetGroupId({
    commit
  }, data) {
    return new Promise(resolve => {
      commit('SET_GROUPID', '');
      resolve();
    });
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
