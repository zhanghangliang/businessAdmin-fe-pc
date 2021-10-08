export default {
  created() {
    // padStart 的 polyfill，因为某些机型或情况，还无法支持es7的padStart，比如电脑版的微信小程序
    // 所以这里做一个兼容polyfill的兼容处理
    if (!String.prototype.padStart) {
      // 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
      String.prototype.padStart = function(maxLength, fillString = " ") {
        if (Object.prototype.toString.call(fillString) !== "[object String]")
          throw new TypeError("fillString must be String");
        let str = this;
        // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
        if (str.length >= maxLength) return String(str);

        let fillLength = maxLength - str.length,
          times = Math.ceil(fillLength / fillString.length);
        while ((times >>= 1)) {
          fillString += fillString;
          if (times === 1) {
            fillString += fillString;
          }
        }
        return fillString.slice(0, fillLength) + str;
      };
    }
  },
  methods: {
    getTimestamp(str) {
      return new Date(str).getTime();
    },
    timeFormat(timestamp = null, fmt = "yyyy-mm-dd") {
      // 其他更多是格式化有如下:
      // yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
      timestamp = parseInt(timestamp);
      // 如果为null,则格式化当前时间
      if (!timestamp) timestamp = Number(new Date());
      // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
      if (timestamp.toString().length == 10) timestamp *= 1000;
      let date = new Date(timestamp);
      let ret;
      let opt = {
        "y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "h+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "s+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    timeFrom(unix_stamp, pre_time) {
      let _today_stamp = this.getTimestamp(
        this.timeFormat(undefined, "yyyy-mm-dd") + " 00:00:00"
      );

      let stamp = [];
      stamp[0] = _today_stamp + 86400000;
      stamp[1] = _today_stamp;
      stamp[2] = _today_stamp - 86400000; // 昨天
      stamp[3] = _today_stamp - 172800000; // 前天

      stamp[4] = _today_stamp - 518400000; // 7天

      stamp[5] = _today_stamp - 31536000000; // 365天

      let _compare_obj = new Date();
      _compare_obj.setTime(unix_stamp);

      if (typeof pre_time != "undefined"  && typeof pre_time != 'boolean' && pre_time != null) {
        const curr = _compare_obj.getTime();
        let timer = curr - pre_time;
        timer = parseInt(timer / 1000);
        if (timer <= 300) {
          return "";
        }
      }

      let return_str;

      if (unix_stamp >= stamp[1] && unix_stamp < stamp[0]) {
        return_str = this.timeFormat(_compare_obj.getTime(), "hh:MM:ss");
      } else if (unix_stamp >= stamp[2] && unix_stamp < stamp[1]) {
        return_str = "昨天 " + this.timeFormat(_compare_obj.getTime(), "hh:MM:ss");
      } else if (unix_stamp >= stamp[3] && unix_stamp < stamp[2]) {
        return_str = "前天 " + this.timeFormat(_compare_obj.getTime(), "hh:MM:ss");
      } else if (unix_stamp >= stamp[4] && unix_stamp < stamp[3]) {
        // 7天内
        return_str =
          "周" +
          this.getWeek(_compare_obj.getDay()) +
          this.timeFormat(_compare_obj.getTime(), "hh:MM:ss");
      } else if (unix_stamp >= stamp[5] && unix_stamp < stamp[4]) {
        // 365天内
        return_str = this.timeFormat(_compare_obj.getTime(), "mm-dd hh:MM:ss");
      } else {
        return_str = this.timeFormat(_compare_obj.getTime(), "yyyy-mm-dd hh:MM:ss");
      }
      return return_str;
    },
    getWeek(num) {
      return ["日", "一", "二", "三", "四", "五", "六"][num];
    }
  }
};
