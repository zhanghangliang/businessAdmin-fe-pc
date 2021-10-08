const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  unitId: state => state.user.member.unitId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menuData: state => state.user.menuData,
  expireDate: state => state.user.expireDate,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  sysInfo: state => state.settings.sysInfo,
  groupId: state => state.user.groupId
}
export default getters
