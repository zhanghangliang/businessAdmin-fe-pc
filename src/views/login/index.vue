<template>
  <div class="login-container">
    <div class="logo-div">
      <!-- <img src="../../assets/images/loginLogo.png" alt=""> -->
      <img :src="imgUrl + sysInfo.logo" alt="" />
    </div>
    <div class="login-div">
      <!-- <div class="login-div-left">
        <img src="../../assets/images/loginLeftNoTitle.png"
             alt="">
        <div class="loginLeft-title">
          <h3 class="title">{{ sysInfo.cnName }}</h3>
          <span>{{ sysInfo.enName }}</span>
        </div>

      </div> -->
      <div class="top-title-container">
        <h3 class="title">{{ sysInfo.cnName }}</h3>
        <span>{{ sysInfo.enName }}</span>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <!-- <div class="logo-div">
          <img src="../../assets/images/loginLogo.png" alt="">
          <img :src="imgUrl + sysInfo.logo"alt="">
        </div> -->
        <div class="title-container">
          <h3 class="title">用户登录 <span>Login User</span></h3>
          <p class="line-word">
            <span>欢迎登录{{ sysInfo.cnName }}</span>
          </p>
        </div>
        <div style="margin: 0 15px">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-checkbox class="check-style" v-model="psdChecked"
            >记住密码</el-checkbox
          >

          <el-button
            class="loginBtn"
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 65px"
            @click.native.prevent="handleLogin"
            >登录</el-button
          >

          <!-- <div style="position:relative">
          <div class="tips">
            <span>Username : admin</span>
            <span>Password : any</span>
          </div>
          <div class="tips">
            <span style="margin-right:18px;">Username : editor</span>
            <span>Password : any</span>
          </div>

          <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
            Or connect with
          </el-button>
        </div> -->
        </div>
      </el-form>
    </div>
    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business
      simulation! ! !
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
// import store from '@/store'
import { httpAction } from "@/api/manage";
import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";
const Base64 = require("js-base64").Base64;
import Cookies from "js-cookie";
export default {
  name: "Login",
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: "18384115008",
        password: "123",
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        username: [
          { required: true, trigger: "change", message: "请输入账号" },
        ],
        password: [
          { required: true, trigger: "change", message: "请输入密码" },
        ],
      },
      checked: false,
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      sysInfo: {
        cnName: "政务大百科",
        enName: "Service Operation Management System",
      },
      imgUrl: "",
      psdChecked: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    // this.getSysInfo()
    // 在页面加载时从cookie获取登录信息
    const username = this.getCookie("username" + this.systemType);
    // let password = this.getCookie("password")
    const password = Base64.decode(
      this.getCookie("password" + this.systemType)
    );
    // 如果存在赋值给表单，并且将记住密码勾选
    if (username) {
      this.loginForm.username = username;
      this.loginForm.password = password;
      this.psdChecked = true;
    }
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.loginForm.system = this.systemType;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: "/", query: this.otherQuery });
              this.loading = false;
              if (this.psdChecked) {
                this.setCookie(
                  "username" + this.systemType,
                  this.loginForm.username
                );
                // this.setCookie("password",this.loginForm.password)
                // base64加密密码
                const passWord = Base64.encode(this.loginForm.password);
                this.setCookie("password" + this.systemType, passWord);
                this.setCookie("remember" + this.systemType, this.psdChecked);
              } else {
                this.setCookie("username" + this.systemType, "");
                this.setCookie("password" + this.systemType, "");
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 保存cookie
    setCookie(cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // 获取信息信息
    getSysInfo() {
      this.$store
        .dispatch("settings/sysInfo", "/sys-config/querySysConfigInfo")
        .then((data) => {
          this.imgUrl = window._CONFIG["imgView"];
          if (data) {
            this.sysInfo = data;
            Cookies.set("ecBaseUrl" + this.systemType, data.ecBaseUrl);
            Cookies.set("ecAvailFlag" + this.systemType, data.ecAvailFlag);
            Cookies.set(
              "openDailyReoprtStatus" + this.systemType,
              data.openDailyReoprtStatus
            );
          }
        });
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #1765a1;
$light_gray: #009ecb;
$cursor: #009ecb;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 43px;
    width: 82%;
    vertical-align: middle;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      padding: 5px 5px 5px 3px;
      color: $light_gray;
      height: 44px;
      caret-color: $cursor;
      font-size: 16px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
      &::-webkit-input-placeholder,
      &:-moz-placeholder,
      &::-moz-placeholder,
      &:-ms-input-placeholder {
        color: #009ecb;
      }
    }
  }

  .el-form-item {
    border: 1px solid #009ecb;
    background: #ffffff;
    color: #454545;
    border-radius: 4px;
  }
  .el-form-item.is-required {
    margin-bottom: 30px;
  }
  .el-form-item.el-tooltip {
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #e5e9ec;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("../../assets/images/1.png") no-repeat;
  background-size: 100% 100%;
  background-color: $bg;
  overflow: hidden;
  .login-div {
    position: relative;
    width: 500px;
    height: 600px;
    // min-width: 520px;
    // max-width: 800px;
    margin: 0 auto;
    overflow: hidden;

    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    zoom: 1;
  }
  .login-div-left {
    display: inline-block;
    width: 600px;
    height: 600px;
    position: relative;
    .loginLeft-title {
      position: absolute;
      height: 40px;
      z-index: 10;
      top: 27px;
      left: 82px;
      color: #fff;
      h3.title {
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 18px;
      }
      span {
        font-weight: bold;
        font-size: 16px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      }
    }
  }
  .login-div-left img {
    width: 100%;
    height: 100%;
  }
  .logo-div {
    position: absolute;
    text-align: center;
    width: 120px;
    height: 35px;
    top: 20px;
    left: 40px;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .login-form {
    position: relative;
    width: 75%;
    max-width: 430px;
    padding: 0 35px 0;
    background-color: #fff;
    border-radius: 4px;
    margin: 0 auto;
    overflow: hidden;
    // display: inline-block;
    vertical-align: top;
    box-shadow: 5px 5px 15px 12px rgba(0, 0, 0, 0.1);
    .check-style {
      color: #009ecb;
    }
  }
  .login-form button {
    padding: 18px 20px;
    font-size: 16px;
    border-radius: 3px;
    background-color: #009ecb;
    font-weight: bold;
    border-style: none;
    letter-spacing: 2px;
    margin-top: 25px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 5px 5px 10px;
    color: #009ecb;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    font-size: 16px;
  }
  .top-title-container {
    position: relative;
    margin: 40px 0 30px;
    text-align: center;
    .title {
      font-size: 40px;
      font-weight: 500;
      color: #ffffff;
      margin: 0px auto 10px auto;
    }
    span {
      font-size: 20px;
      color: #fff;
    }
  }
  .title-container {
    position: relative;
    margin: 40px 0 30px;
    text-align: center;

    .title {
      font-size: 20px;
      color: #009ecb;
      margin: 0px auto 15px auto;
      text-align: center;
      font-weight: 600;
      position: relative;
      span {
        font-size: 12px;
        color: #a7a7a7;
        font-weight: 100;
        position: absolute;
        right: 20%;
        top: 5px;
      }
    }
    .line-word {
      position: relative;
      background-color: #009ecb;
      margin: 30px 0;
      height: 2px;
      span {
        color: #a7a7a7;
        font-size: 15px;
        position: absolute;
        top: 50%;
        background-color: #fff;
        padding: 0 10px;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 25px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  @media screen and (max-width: 1366px) {
    .login-div {
      zoom: 0.85;
    }
  }
}
</style>
