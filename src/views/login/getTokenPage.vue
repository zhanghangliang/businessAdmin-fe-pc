<script>
import {httpAction,getAction} from '@/api/manage'
import Cookies from 'js-cookie';
import { getToken } from '@/utils/auth'
export default {
  name: 'AuthRedirect',
   data () {
    return {
        url:'',
        code:'',
        hasToken:false,
    }
  },
  created() {
    getCode () 
  },
  methods: {
    getAuthUrl(){
       httpAction('/getcodeUrl',{}).then(res => {
        if(res.code == 0){
                this.url = res.data;
                debugger
                console.log(this.url)
                this.getCode();
              }
        })
        .catch((error) => {
          console.log(error);
        });
      },
    getCode () { // 非静默授权，第一次有弹框
      debugger
        this.code = ''
        this.code = this.getUrlCode().code // 截取code
        if (this.code == null || this.code === '') { // 如果没有code，则去请求
            window.location.href = this.url;
        } else {
            this.getUserInfo();
        }
        console.log(this.code);
    },
    getUrlCode(){ //截取url里的code
        var url = location.search;
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
    getUserInfo(){
      debugger
      //   getAction('/getcode?code='+this.code,{}).then(res => {
      //     debugger
      //       if(res.code == 0){
              
              
      //       }else if(res.code == 2){
      //         // this.infoText = res.msg;
      //       }else if(res.code == 300){
      //         // Cookies.set('token', '');
      //           this.infoText = res.msg;
      //           this.code = ''
      //         this.getAuthUrl();
      //       }else if(res.code == 301){
      //           this.infoText = res.msg;
      //       }
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
       this.$store.dispatch('user/login', {code:this.code}).then(() => {
              // this.$router.push({ path: '/', query: this.otherQuery })
              // this.loading = false
              
            })
            .catch(() => {
              // this.loading = false
            })
    },
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
