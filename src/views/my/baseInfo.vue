<template>
  <div>
    <div class="all">
      <ul class="form-list">
        <li>
          <img src="../../assets/images/icon_arrowL.png" alt="" @click="backPage">
          <span>个人基础信息</span>
        </li>
        <li>
          <span>姓名</span>
          <input type="text" class="inp-style" v-model="formData.name">
        </li>
        <li>
          <span>性别</span>
          <div class="div-style" @click="sexSelectShow=!sexSelectShow">
            {{formData.sex}}
            <div class="sex-select-div" v-if='sexSelectShow'>
              <p @click="formData.sex = '男'">男</p>
              <p @click="formData.sex = '女'">女</p>
            </div>
          </div>
          <img src="../../assets/images/icon_arrowB.png" alt="">
        </li>
        <li>
          <span>手机</span>
          <div class="div-style">{{formData.mobile?formatData(formData.mobile):''}}</div>
          <!-- <input type="text" class="inp-style" v-model="formData.mobile"> -->
<!--          <img src="../../assets/images/btn_modify.png" alt="" @click="popupShowFun">-->
        </li>
        <li>
          <span>真实姓名</span>
          <input type="text" class="inp-style-4" maxlength="8" :value="formData.realName" disabled>
<!--          <img src="../../assets/images/btn_modify.png" alt="" @click="editIcardInfo">-->
        </li>
        <li>
          <span>身份证号</span>
          <input type="text" class="inp-style-4" maxlength="18" :value="formData.idCard" disabled>
<!--          <img src="../../assets/images/btn_modify.png" alt="" @click="editIcardInfo">-->
        </li>
        <!-- <li>
            <span>密码</span>
            <p> ●●●●●● </p>
            <img src="../../assets/images/btn_modify.png" alt="" @click="show_edit_psd">
        </li>
        <li>
            <span>注册</span>
            <p>{{createTime}}</p>
        </li> -->
      </ul>
    </div>
    <div class="bottom-div">
      <div class="submit-div">
<!--        <button @click="submit">保存修改</button>-->
      </div>
    </div>
    <!-- 修改手机号 -->
    <div class="mobile-popup">
      <div class="popup-bg" @click="popupShow=!popupShow" v-if="popupShow"></div>
      <div class="mobile-popup-con" v-if="popupShow">
        <p class="popup-title">{{mobileAdd_edit?'确认新手机号':'修改手机号'}}</p>
        <div class="popup-div">
          <input v-if='mobileAdd_edit' type="number" placeholder="请输入手机号码" class="other" v-model="setMobile" oninput="value=value.replace(/[^\d-]/g,'')">
          <div v-else class="popup-show-mobile">{{formatData(setMobile)}}</div>
          <span class="timer-span" @click="sendStatus?sendCode():''">{{sendText}}</span>
        </div>
        <div class="popup-div">
          <input type="text" placeholder="请输入验证码" v-model="setCode">
        </div>
        <div class="popup-div-btn">
          <span v-if="!mobileAdd_edit" @click="editNext">下一步</span>
          <span v-if="mobileAdd_edit" @click="confirmMobile">确定</span>
        </div>
      </div>
    </div>
    <!-- 验证身份信息 -->
    <div class="idcard-popup">
      <div class="popup-bg" @click="idcardShow=!idcardShow" v-if="idcardShow"></div>
      <div class="mobile-popup-con" v-if="idcardShow">
        <p class="popup-title">身份信息验证</p>

        <div class="popup-div">
          <input type="text" placeholder="请输入姓名" v-model="realName">
        </div>
        <div class="popup-div">
          <input type="text" placeholder="请输入身份证号" v-model="idCard">
        </div>
        <div class="popup-div-btn">
          <span @click="confirmIdcard">确定</span>
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <div class="password-popup">
      <div class="popup-bg" @click="password_popupShow=!password_popupShow" v-if="password_popupShow"></div>
      <div class="mobile-popup-con" v-if="password_popupShow">
        <p class="popup-title">修改密码</p>
        <div class="popup-div">
          <div class="popup-show-mobile">{{formData.mobile?formatData(formData.mobile):''}}</div>
          <span class="timer-span" @click="sendStatus?sendCode():''">{{sendText}}</span>
        </div>
        <div class="popup-div">
          <input type="text" placeholder="请输入验证码" v-model="setCode">
        </div>
        <div class="popup-div">
          <input type="password" placeholder="请输入新密码" v-model="setPassword">
        </div>
        <div class="popup-div-btn">
          <span @click="password_popupShow=!password_popupShow">取消</span>
          <span @click="edit_password_">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {httpAction} from '@/api/manage'
import Cookies from 'js-cookie'



export default {
  name: 'index',
  components: {

  },

  props: {

  },
  data () {
    return {
      formData:{
        id:'',
        name:'',
        sex:'',
        mobile:'',
        password:'',
        idCard:'',
        realName:''
      },
      createTime:'',
      sexSelectShow:false,
      setMobile:'',
      setCode:'',
      setPassword:'',
      sendText:'发送验证码',
      sendStatus:true,
      clearTime:null,
      popupShow:false,
      mobileAdd_edit:false,// false 编辑 true 新增
      password_popupShow:false,
      idcardShow:false,
      toastItem:null,

      editEnabled: true,

      realName: '',
      idCard: ''
    }
  },
  created () {
    let mobileStatus = this.$route.query

    console.log(mobileStatus)
    if(mobileStatus.checkMobile){
      this.popupShowFun()
    }
    this.initFormData()
    window.addEventListener("popstate", (e)=> {//回调函数中实现需要的功能
      this.$router.push({
        path: '/my',
      })
      return
    }, false);
  },
  methods: {
    initFormData(){
      let data = JSON.parse(Cookies.get('member'+this.systemType))
      for(name in this.formData){
        this.formData[name] = data[name]
      }
      this.createTime = data.createTime
      this.formData.name = data.realName
      this.formData.sex = data.sex == '1'?'男':data.sex == '2'?'女':''
      httpAction("/wxgetBasicUserInfo",{}).then(resp=>{
        if(resp.code===0){
          console.log(resp)
          this.formData.idCard=resp.data.idCard
          this.formData.realName=resp.data.realName

          if(resp.data.idCard){
            this.editEnabled = false;
          }
        }
      })
    },
    showToast(text){
      this.toastItem = this.Toast.loading({
        duration: 0,
        forbidClick: true,
        message: text||'加载中...',
      })
    },
    clearToast(){
      this.toastItem.clear()
    },
    submit(){
      let temp = {}
      for(name in this.formData){
        temp[name] = this.formData[name]
      }
      temp.sex = temp.sex == '男'?'1':temp.sex == '女'?'2':''

      if(!temp.password){
        delete temp.password
      }

      if(!temp.name||!temp.sex||!temp.mobile||!temp.idCard){
        this.Toast('请完善所有信息')
        return
      }
      let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if(!idcardReg.test(temp.idCard)){
        this.Toast('身份证号码格式有误')
        return
      }
      this.showToast()
      console.log(temp)
      httpAction('/Wx/saveOrUpdate', {body:temp}).then(response => {
        if (response.code == 0) {
          this.Notify({
            type: response.msg == 'success' ? 'success' : 'warning',
            message: '保存'+ (response.msg == 'success' ? '成功' : '失败')
          });
          this.$store.dispatch('user/getInfo').then(()=>{})
        }
        this.clearToast()
      }).catch(error => {
        this.clearToast()
        console.log(error)
      })
    },
    backPage(){
      // this.$router.go(-1)
      this.$router.push('/my')
    },
    popupShowFun(){
      if(this.formData.mobile){
        this.setMobile = this.formData.mobile
        this.mobileAdd_edit = false
      }else{
        this.mobileAdd_edit = true
      }

      this.popupShow = true
    },
    editIcardInfo(){
      if(!this.editEnabled){
        this.Toast("你已经完成了实名认证！");
        return;
      }
      this.idcardShow = true;
    },
    //确认身份信息
    confirmIdcard(){
      console.log(this.realName=='')
      console.log(this.idCard=='')
      if(this.realName == ''){
        this.Toast('请输入真实姓名')
        return

      }
      if(this.realName == ''){
        this.Toast('请输入身份证号')
        return
      }
      this.formData.realName = this.realName;
      this.formData.idCard = this.idCard;
      this.idcardShow = false;
    },
    //修改下一步
    editNext(){
      if(!this.setMobile==''&&!this.setCode){
        this.Toast('请输入手机号和验证码')
        return
      }
      let temp = {
        mobile:this.setMobile,
        code:this.setCode
      }

      this.showToast()
      httpAction('/Wx/checkcode', {body:temp}).then(response => {
        if (response.code == 0) {
          if(response.data.checkstate == 1){ //成功
            this.mobileAdd_edit = true
            this.setMobile = ''
            this.setCode = ''
            this.sendText = '发送验证码'
            this.sendStatus = true
            if(this.clearTime){
              clearInterval(this.clearTime)
            }

          }else if(response.data.checkstate == 0){  //失败
            this.Toast('验证码有误')
          }
        }
        this.clearToast()
      }).catch(error => {
        console.log(error)
        this.clearToast()
      })
    },
    //确认手机号
    confirmMobile(){
      console.log(this.setMobile=='')
      console.log(this.setCode=='')
      if(this.setMobile==''||this.setCode==''){
        this.Toast('请输入手机号和验证码')
        return
      }
      let temp = {
        mobile:this.setMobile,
        code:this.setCode
      }
      console.log(temp)
      this.showToast()
      httpAction('/Wx/checkcode', {body:temp}).then(response => {
        this.clearToast()
        if (response.code == 0) {
          if(response.data.checkstate == 1){ //成功
            this.formData.mobile = this.setMobile
            this.popupShow = false
          }else if(response.data.checkstate == 0){  //失败
            this.Toast('验证码有误')
          }
        }
      }).catch(error => {
        this.clearToast()
        console.log(error)
      })
    },
    //发送验证码
    sendCode(){
      if(this.setMobile == ''){
        this.Toast('请输入手机号码')
        return
      }

      var reg = new RegExp(/^1[3456789]\d{9}$/)
      if(!reg.test(this.setMobile)){
        this.Toast('手机号码格式有误')
        return
      }
      this.showToast('发送中...')
      httpAction('/Wx/verification', {body:this.setMobile}).then(response => {
        if (response.code == 0) {
          this.Notify({
            type: response.msg == 'success' ? 'success' : 'warning',
            message: '发送'+ (response.msg == 'success' ? '成功' : '失败')
          })
        }
        this.sendStatusTime()
        this.clearToast()
      }).catch(error => {
        this.clearToast()
        console.log(error)
      })
    },
    //发送倒计时
    sendStatusTime(){
      let num = 60
      this.clearTime = setInterval(()=>{
        num --
        this.sendText = '已发送'+num +'s'
        this.sendStatus = false
        if(num == 0){
          clearInterval(this.clearTime)
          this.sendText = '发送验证码'
          this.sendStatus = true
        }
      },1000)
    },
    formatData(tel){
      return tel.replace(tel.substring(3,7), "****")
    },
    show_edit_psd(){
      if(this.formData.mobile == ''){
        this.Toast('请先绑定手机号码')
        return
      }
      this.setMobile = this.formData.mobile
      this.password_popupShow=!this.password_popupShow
    },
    // 修改密码确认
    edit_password_(){
      if(!this.setMobile&&!this.setCode&&!this.setPassword){
        this.Toast('请输入完整信息')
        return
      }
      let temp = {
        mobile:this.setMobile,
        code:this.setCode
      }

      console.log(temp)
      httpAction('/Wx/checkcode', {body:temp}).then(response => {
        if (response.code == 0) {
          if(response.data.checkstate == 1){ //成功
            this.formData.password = this.setPassword
            this.password_popupShow = false
          }else if(response.data == 0){  //失败
            this.Toast('验证码有误')
          }
        }
      }).catch(error => {
        console.log(error)
      })

    }


  }
}
</script>
<style scoped>
.form-list{
  margin: 15px 15px 0;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  color: #4A4A4A;
  box-shadow: 0px 2px 15px 1px #D9D9D9;
}
.form-list li{
  list-style-type: none;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #EEEEEE;
  padding: 0 15px;
  /*background: url(../../assets/images/-s-icon_arrowR.png) no-repeat 96%;*/
  background-size: 12px;
}
.form-list li img{
  width: 18px;
  height: 18px;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 3px;
}
.form-list li > span{
  font-size: 14px;
  font-weight: bold;
  vertical-align: middle;
  color: #B6B6B6;
  display: inline-block;
  margin-right: 20px;
  min-width: 30px;
}
.form-list li:first-child{
  background-color: #EFF3FF;
  height: 50px;
  line-height: 50px;
}
.form-list li:first-child span{
  color: #3D65E6;
}
.form-list li:first-child > img{
  width: 12px;
  height: 12px;
  margin-right: 10px;
}
.inp-style{
  width: calc(100% - 81px);
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  outline: none;
  border-style: none;


}
.inp-style-4{
  width: calc(100% - 110px);
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  outline: none;
  border-style: none;


}
.form-list li > p{
  width: calc(100% - 83px);
  display: inline-block;
  vertical-align: middle;
  /* color: #E2E2E2; */
}
.submit-div {
  padding: 10px 15px;
}
.submit-div button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border-style: none;
  outline: none;
  background-color: #378CFF;
  color: #ffffff;
}
.div-style{
  width: calc(100% - 83px);
  display: inline-block;
  vertical-align: middle;
  height: 45px;
  line-height: 45px;
  font-weight: 600;
  position: relative;
}
.sex-select-div{
  position: absolute;
  width: calc(100% + 30px);
  padding: 10px 0;
  border-radius: 5px;
  box-shadow: 1px 2px 6px 5px #F7F7F7;
  background-color: #ffffff;
  z-index: 5;
}
.sex-select-div p{
  padding-left: 20px;
}
.sex-select-div p:hover{
  background-color: #F7F7F7;
}

.popup-div{
  width: 100%;
  height: 50px;
  background-color: #F7F7F7;
  line-height: 50px;
  margin-bottom: 15px;
}
.popup-div input{
  width: calc(100% - 15px);
  height: 100%;
  border-style: none;
  outline: none;
  background-color: #f7f7f7;
  padding-left: 10px;
}
.popup-div input.other{
  width: calc(100% - 100px);
}
.timer-span{
  border: 1px solid #4593FF;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #4593FF;
  background-color: #C6DFFE;
}

.popup-show-mobile{
  padding-left: 13px;
  width: calc(100% - 100px);
  display: inline-block;
  vertical-align: middle;
  height: 45px;
  line-height: 45px;
  font-weight: 600;
}

input[disabled]{
  background-color: #fff!important;
}
</style>
