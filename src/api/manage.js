import request from '@/utils/request'
const api = {
  user: '/api/user',
  role: '/api/role',
  service: '/api/service',
  permission: '/api/permission',
  permissionNoPager: '/api/permission/no-pager'
}

export default api
export function dict (parameter) {
  let formData = new FormData();
  formData.append("data",JSON.stringify({ 'body': parameter }));
  formData.append("url","/dictManager/findDictItemByDictCode");
  return request({
    url: '/dictManager/findDictItemByDictCode',
    method: 'post',
    data: formData
  })
}
// post
export function postAction (url, parameter) {
  return request({
    url: url,
    method: 'post',
    data: parameter
  })
}

// post method= {post | put}
export function httpAction (url, parameter, method) {
  let formData = new FormData();
  if(url== "/file/upload") {
    formData.append("files", parameter.get("files"));
    parameter.delete("files")
  }
  formData.append("data",JSON.stringify(parameter));
  formData.append("url",url);
  return request({
    url: url,
    method: method || 'post',
    data: formData
  })
}

// put
export function putAction (url, parameter) {
  return request({
    url: url,
    method: 'put',
    data: parameter
  })
}

// get
export function getAction (url, parameter) {
  let params = Object.keys(parameter).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(parameter[key]);
  }).join("&");
  let formData = new FormData();
  formData.append("url",url+"?"+params);
  return request({
    url: url,
    method: 'get',
    data: formData
  })
}

// deleteAction
export function deleteAction (url, parameter) {
  let params = Object.keys(parameter).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(parameter[key]);
  }).join("&");
  let formData = new FormData();
  formData.append("url",url+"?"+params);
  return request({
    url: url,
    method: 'delete',
    data: formData
  })
}

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  let params = Object.keys(parameter).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(parameter[key]);
  }).join("&");
  let formData = new FormData();
  formData.append("url",api.role+"?"+params);
  return request({
    url: api.role,
    method: 'get',
    data: formData
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  let formData = new FormData();
  formData.append("data",JSON.stringify(parameter));
  formData.append("url",api.service);
  return request({
    url: api.service,
    method: parameter.id == 0 ? 'post' : 'put',
    data: formData
  })
}

/**
 * TODO 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile (url, parameter) {
  return request({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

