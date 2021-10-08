<script>
import store from '@/store'
import { httpAction, getAction } from '@/api/manage';
import Cookies from 'js-cookie';
import { getToken, setToken, removeToken } from '@/utils/auth';
export default {
  name: 'AuthRedirect',
  data() {
    return {
      url: '',
      code: '',
      hasToken: false,
      redirectPath: ''
    };
  },
  created() {
    console.log(location);
    console.log(this.$route.query);
    if (this.$route.query) {
      this.redirectPath = this.$route.query.redirect;
    }

    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      console.log('微信浏览器');
      const hasToken = getToken();
      if (hasToken) {
        this.getUserInfo();
      } else {
        this.getAuthUrl();
      }
    } else {
      const hasToken = getToken();
      console.log("不是微信浏览器"+getToken());
      if (hasToken) {
        this.getUserInfo();
      } else {
        // let req = {
        //   // username: "18083021024",
        //   // userPassword : "123321", // 密码；SHA加密密码
        //   // uuid : "qweeewqwrqwe", // 唯一标识
        //   // realName : "张三", // 真实姓名
        //   // sex : "1", // 性别
        //   // idNumber : "500107199608022013" // 身份证
        //   "idNumber": "500107199608022013",
        //   "realName": "张三三",
        //   "sex": 2,
        //   "userPassword": "xxcc",
        //   "username": "18083023324",
        //   "uuid": "PHONE_CE3170419608E944E356D05BF3248189"
        // }
        // this.onLoginByPlatform(req)

        // this.$router.replace({ path: '/baseInfo', query: { checkMobile: true } })
        this.onGetUserTicket();
      }
    }
  },
  watch: {
    '$route.query'(v) {
      this.redirectPath = v.redirect;
    }
  },
  methods: {
    // 自然人
    getNatural(username, jwtToken) {
      let timestamp = new Date().valueOf();
      let that = this;
      let param = {
        app_id: "wdhf",
        biz_content: JSON.stringify({
          username: username,
          jwtToken: jwtToken
        }),
        charset: "UTF-8",
        interface_id: "zrrxxcx",
        origin: "APP",
        sign: "",
        timestamp,
        version: "1.0"
      };
      $.ajax({
        dataType: "json",
        type: "post",
        url:
          "https://tftb.sczwfw.gov.cn:8085/jmas-api-gateway-server/createsign.do",
        data: param,
        success: res => {
          // console.log(res, "自然人sign");
          param.sign = res.data.sign;
          that.getNaturalData(param);
        },
        fail: () => {}
      });
    },
    getNaturalData(param) {
      let that = this;
      $.ajax({
        dataType: "json",
        type: "post",
        url:
          "https://tftb.sczwfw.gov.cn:8085/jmas-api-gateway-server/gateway.do",
        data: param,
        success: res => {
          console.log("自然人用户数据", res);
          if (res.success && res.code == "200") {
            res = JSON.parse(res.data);
            if (res) {
              let info = res.data.real;
              let baseInfo = res.data.base;
              console.log(info);

              let req = {
                infos: res.data,
                username: baseInfo.username,
                userPassword : baseInfo.userPassword, // 密码；SHA加密密码
                uuid : baseInfo.uuid, // 唯一标识
                realName : info.realName, // 真实姓名
                sex : info.sex, // 性别
                idNumber : info.idNumber // 身份证
              }
              that.onLoginByPlatform(req)
            }
          } else {
          }
        },
        fail: () => {}
      });
    },
    onLoginByPlatform(req) {
      let that = this;
      httpAction('/Wx/loginByPlatform', {body:req}).then(response => {
        if (response.code == 0) {
          if(response.data.checkstate == 1){ //成功
            setToken(response.data.token);
            store.dispatch('user/setToken', response.data.token)
            that.Toast('静默登录成功')
            // this.timer = setTimeout(()=>{   //设置延迟执行
            //   this.$router.replace({ path: '/my', query: {token: response.data.token} || {} });
            // },2000);
            that.getUserInfo();
          }else if(response.data.checkstate == 0){  //失败
            that.Toast('静默登录失败')
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
     // 获取用户信息
    onGetUserTicket() {
      let that = this;
      lightAppJssdk.user.getTicket({
        success: function (data) {
          //成功回调
          if (data == "未登录") {
            that.onLoginApp();
          } else {
            let userInfo = JSON.parse(data);
            console.log("userInfo~~~~~~~", userInfo);
            if (userInfo.socialCreditCode) {
              that.$dialog
                .alert({
                  message: "此服务不支持法人用户"
                })
                .then(() => {
                  that.oncloseWindow();
                });
            } else {
              that.getNatural(userInfo.username, userInfo.jwtToken);
            }
          }
        },
        fail: function (data) {
          //错误返回
          that.oncloseWindow();
        }
      });
    },
    // 登陆
    onLoginApp() {
      let that = this;
      lightAppJssdk.user.loginapp({
        success: function (data) {
          //成功回调
          if (data == "未登录") {
            that.oncloseWindow();
          } else {
            let userInfo = JSON.parse(data);
            console.log("userInfo~~~~~~~", userInfo);
            if (userInfo.socialCreditCode) {
              that.$dialog
                .alert({
                  message: "此服务不支持法人用户"
                })
                .then(() => {
                  that.oncloseWindow();
                });
            } else {
              that.getNatural(userInfo.username, userInfo.jwtToken);
            }
          }
        },
        fail: function () {
          that.oncloseWindow();
        }
      });
    },
    // 关闭
    oncloseWindow() {
      lightAppJssdk.navigation.close({
        success: function (data) {
          //成功回调
        },
        fail: function (data) {
          //错误返回
        }
      });
    },

    getAuthUrl() {
      if (this.getCodeUrlBefore()) {
        console.log('回调路径', location.href);
        httpAction('/getcodeUrl', { body: location.href })
          .then(res => {
            if (res.code == 0) {
              removeToken();
              this.url = res.data;
              this.getCode();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      //  zhengwu.wangserver.cn
      // http://public.wangserver.cn/
    },
    getCodeUrlBefore() {
      const token = this.$route.query.token;
      if (token) {
        this.token = token;
        setToken(token);
        this.getUserInfo();
        return false;
      }
      return true;
    },
    getCode() {
      // 非静默授权，第一次有弹框
      this.token = this.$route.query.token || ''; // 截取code
      if (!this.token) {
        // 如果没有code，则去请求
        window.location.replace(this.url);
      } else {
        setToken(this.token);
        this.getUserInfo();
      }
    },
    getUserInfo() {
      console.log('token', this.token);
      this.$store
        .dispatch('user/getInfo', { Token: this.token })
        .then(() => {
          const pathname = this.redirectPath;
          console.log('进入的页面 pathname', pathname);
          const { redirect, token, ...params } = this.$route.query;
          console.log(params, '路由参数');
          if (!pathname || pathname == '/' || pathname == '/login') {
            this.$router.replace({ path: '/index', query: params || {} });
          } else {
            this.$router.replace({ path: pathname, query: params || {} });
          }
        })
        .catch(() => {
        });
    }
  },
  render: function(h) {
    return h(); // avoid warning message
  }
};
</script>
