<template>
    <div>
        <div class="all" style="height:100vh;overflow: hidden;">
            <img v-if="is_weixin" src="@/assets/images/other.png" alt="" >
            <div class="down-btn">
                <!-- <el-button type="primary" size="small" @click="downPage">下载</el-button> -->
                <van-button v-if="is_weixin" type="info" block @click="downPage">复制</van-button>
                <span v-else>请在微信中复制后打开</span>
            </div>
        </div>
    </div>
</template>
<script>
import {httpAction} from '@/api/manage'
import Cookies from 'js-cookie'
import { getToken, setToken, removeToken } from "@/utils/auth";
export default {
  name: 'downPage',
  components: {

  },
  props: {

  },
  data () {
    return {
        imgView:window._CONFIG['uploadUrl'],
        imgPath:window._CONFIG['download'],
        excelView: window._CONFIG['excelView'],
        is_weixin:true,
        downUrl:'',
        curToken:''
    }
  },
  created () {
    this.filesData = this.$route.query
    this.curToken = getToken()
    this.downUrl = this.imgPath +'?fileId=' +this.filesData.id+'&token='+this.curToken
    if(this.filesData.mimeType.indexOf('downloadPage') === -1){
      this.downUrl = this.imgView + this.filesData.fileUrl
    }else{
      this.downUrl = this.excelView + '?id=' + this.filesData.id + '&token='+ this.curToken
    }

    // this.is_weixin = this.isWeixin();

  },
  methods: {
    downFile(){

    },
    GetRequest() {
        var url = location.search;//获取url中"?"符后的字符串
        var theRequest = new Object();
        if (url.indexOf("?")!=-1){  //存在？ 则
            var str = url.substr(1);
            strs = str.split("&");  //字符串分割
            for(var i=0;i<strs.length;i++){
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    isWeixin() {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            console.log('微信浏览器');
            console.log(this.downUrl)
            return true;
        } else {
            // debugger
            // setToken(this.curToken)
            // Cookies.set('pathname', '/downPage')
            // window.top.location.href="/#/downPage?fileurl="+this.downUrl;
            console.log("不是微信浏览器");

            return false;
        }
    },
    downPage(){
        var input = document.createElement("input");   // js创建一个input输入框
        input.value = this.downUrl
        document.body.appendChild(input);    // 将输入框暂时创建到实例里面
        input.select();   // 选中输入框中的内容
        document.execCommand("Copy");   // 执行复制操作
        document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
         this.Toast('复制成功')
        // if(this.is_weixin){
        //     //是微信浏览器  显示返回按钮   （用户可以选择下载或者返回）
        //     console.log(this.downUrl)
        // }else{
        //     //不是微信浏览器
        //     console.log(this.imgPath)
        //     console.log(this.getUrlCode())
        //     if(this.getUrlCode().fileUrl){
        //          window.location.href=this.imgView + this.getUrlCode().fileUrl
        //     }else{
        //         input.value = this.downUrl
        //         document.body.appendChild(input);    // 将输入框暂时创建到实例里面
        //         input.select();   // 选中输入框中的内容
        //         document.execCommand("Copy");   // 执行复制操作
        //         document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
        //     }
        // }
    },
    getUrlCode(){ //截取url
        var url = location.hash;
         console.log(location)
        var theRequest = new Object()
        if (url.indexOf("?") != -1) {
            var str = url.substr(1)
            var strs = str.split("&")
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1])
            }
        }
        return theRequest
    },

  },
   beforeDestroy() {
        if(!this.is_weixin){
            removeToken()
        }

    }
}
</script>
<style scoped>
    img{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
        opacity: .8;
    }
    .down-btn{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 80%;
        max-width: 300px;
        z-index: 3;
        text-align: center;
    }
</style>
