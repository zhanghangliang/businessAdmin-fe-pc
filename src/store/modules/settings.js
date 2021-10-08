import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { httpAction } from '@/api/manage'
const { showSettings, tagsView, fixedHeader, sidebarLogo,systemType } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  sysInfo:{}
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  SET_SYSINFO: (state, sysInfo) => {
    state.sysInfo = sysInfo
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  sysInfo({ commit }, url) {
    return new Promise((resolve, reject) => {
      httpAction(url, {body:systemType}).then(response => {
        commit('SET_SYSINFO', response.data);
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

