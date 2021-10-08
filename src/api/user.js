import request from '@/utils/request'
import api from "@/api/manage";

export function login (data) {
  let formData = new FormData();
  formData.append("data",JSON.stringify({body:data}));
  formData.append("url",'/wxlogin');
  return request({
    url: '/wxlogin', // /login/login   /user/login
    method: 'post',
    data:formData
  })
}
export function getInfo (token) {
  let formData = new FormData();
  formData.append("url",'/wxgetUserInfo');
  formData.append("data",JSON.stringify({token:token}));
  formData.append("token",token);
  return request({
    url: '/wxgetUserInfo',
    method: 'post',
    data: formData,
    token
  })
}
export function wxLogin(parameter) {
  let params = Object.keys(parameter).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(parameter[key]);
  }).join("&");
  let formData = new FormData();
  formData.append("url","/getcode"+"?"+params);
  return request({
    url: '/getcode',
    method: 'get',
    data: formData
  })
}

export function logout () {
  let formData = new FormData();
  formData.append("url",'/user/logout');
  return request({
    url: '/user/logout',
    method: 'post',
    data: formData
  })
}
