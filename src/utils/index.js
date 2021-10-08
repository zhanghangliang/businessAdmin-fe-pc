/**
 * Created by PanJiaChen on 16/11/18.
 * 
 *
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
import store from '@/store'
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * 当前时间 年月日
 *
 */
export function getNowFormatDate () {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

/**
 * 当前时间 年月日 时分秒
 *
 */
export function datetime () {
  let year = new Date().getFullYear();
  let month =new Date().getMonth() + 1 < 10? "0" + (new Date().getMonth() + 1): new Date().getMonth() + 1;
  let date =new Date().getDate() < 10? "0" + new Date().getDate(): new Date().getDate();
  let hh =new Date().getHours() < 10? "0" + new Date().getHours(): new Date().getHours();
  let mm =new Date().getMinutes() < 10? "0" + new Date().getMinutes(): new Date().getMinutes();
  let ss =new Date().getSeconds() < 10? "0" + new Date().getSeconds(): new Date().getSeconds();
  let nowTime = year + "-" + month + "-" + date +" "+hh+":"+mm+':'+ss ;
  return nowTime;
}
export function getStore () {
  return store.state.user;
}
export function screenHeight (obj,hi) {
  let num = '';
  num = `${document.documentElement.clientHeight}`;//获取浏览器可视区域高度
  window.onresize = () => {
    num =  `${document.documentElement.clientHeight}`;
    console.log(num)
    return num;
  }
  console.log('=============')
  console.log(num)
  // console.log(num)
  return num;
}
export function compareTime(num1,num2,ms){//计算两个日期 大小
  var oDate1 = new Date(num1);
  var oDate2 = new Date(num2);
  if(oDate1.getTime() + ms > oDate2.getTime()){
      // console.log('第一个大');
      return true;
  } else {
      // console.log('第二个大');
      return false;
  }
}

// export function compareDifferTime(num1,num2){//计算两个日期 相差
//   var oDate1 = new Date(num1);
//   var oDate2 = new Date(num2);
//   var compareTimer (oDate1, oDate2)

//   let differ = oDate1.getTime() - oDate2.getTime();
//   console.log('相差：'+differ)
//   let mm = parseInt((differ % (1000 * 60 * 60)) / (1000 * 60))
//   console.log(mm)
//   return Math.abs(mm)
// }
/**
 * 比较两个时间的时间差
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @demo compareTimer(new Date('2019-12-24 16:02').getTime(), new Date().getTime())
 */
export function compareDifferTime (startTime, endTime) {
  var oDate1 = new Date(startTime);
  var oDate2 = new Date(endTime);
  var retValue = {}

  var compareTime = oDate2 - oDate1  // 时间差的毫秒数

  // 计算出相差天数
  var days = Math.floor(compareTime / (24 * 3600 * 1000))
  retValue.Days = days

  // 计算出相差年数
  var years = Math.floor(days / 365)
  retValue.Years = years

  // 计算出相差月数
  var months = Math.floor(days / 30)
  retValue.Months = months

  // 计算出小时数
  var leaveHours = compareTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leaveHours / (3600 * 1000))
  retValue.Hours = hours

  // 计算相差分钟数
  var leaveMinutes = leaveHours % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leaveMinutes / (60 * 1000))
  retValue.Minutes = minutes

  // 计算相差秒数
  var leaveSeconds = leaveMinutes % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leaveSeconds / 1000)
  retValue.Seconds = seconds

  var resultSeconds = 0
  if (years >= 1) {
      resultSeconds = resultSeconds + years * 365 * 24 * 60 * 60
  }
  if (months >= 1) {
      resultSeconds = resultSeconds + months * 30 * 24 * 60 * 60
  }
  if (days >= 1) {
      resultSeconds = resultSeconds + days * 24 * 60 * 60
  }
  if (hours >= 1) {
      resultSeconds = resultSeconds + hours * 60 * 60
  }
  if (minutes >= 1) {
      resultSeconds = resultSeconds + minutes * 60
  }
  if (seconds >= 1) {
      resultSeconds = resultSeconds + seconds
  }
  retValue.resultSeconds = resultSeconds

  var totalMinutes = retValue.Hours*60 + retValue.Minutes
  // console.log(retValue)
  return totalMinutes
}
