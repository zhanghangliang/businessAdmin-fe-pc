import request from '@/utils/request'

export function fetchList(query) {
  let params = Object.keys(query).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
  }).join("&");
  let formData = new FormData();
  formData.append("url",'/article/list'+"?"+params);
  return request({
    url: '/article/list',
    method: 'get',
    data: formData
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  let params = Object.keys({ pv }).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent({ pv }[key]);
  }).join("&");
  let formData = new FormData();
  formData.append("url",'/article/pv'+"?"+params);
  return request({
    url: '/article/pv',
    method: 'get',
    data: formData
  })
}

export function createArticle(data) {
  let formData = new FormData();
  formData.append("data",JSON.stringify(data));
  formData.append("url","/article/create");
  return request({
    url: '/article/create',
    method: 'post',
    data: formData
  })
}

export function updateArticle(data) {
  let formData = new FormData();
  formData.append("data",JSON.stringify(data));
  formData.append("url","/article/update");
  return request({
    url: '/article/update',
    method: 'post',
    data: formData,
  })
}
