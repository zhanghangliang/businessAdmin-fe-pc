<template>
  <div>
    <div class="all" style="background-color: #ffffff">
      <div class="my-top">
        <img src="../../assets/images/user_bg.jpg" alt="" />
        <div class="my-top-info">
          <div class="left">
            <span class="name-info">
              你好，
              <span>{{ member.realName }}</span>
            </span>
            <p class="name-status">{{ member.mobile ? '已注册手机号' : '' }}</p>
            <p class="phone">{{ member.mobile ? formatData(member.mobile) : '' }}</p>
          </div>
          <div class="right">
            <!-- <img src="../../assets/images/bg-user.png" alt=""> -->
            <img :src="imgUrl" alt="" />
          </div>
        </div>
      </div>
      <div class="my-list-do">
        <ul class="list-ul">
          <li @click="toPage('/baseInfo')">
            <img src="../../assets/images/icon_userInfo.png" alt="" />
            <span>个人基础信息</span>
          </li>
          <!-- <li @click="toPage('/doHistory')">
                        <img src="../../assets/images/icon_historyRecord.png" alt="">
                        <span>历史操作记录</span>
                    </li> -->
          <!--                    <li @click="toPage('/groupList')">-->
          <li @click="toPage('/message')">
            <img src="../../assets/images/icon_historyRecord.png" alt="" />
            <span>在线服务</span>
          </li>
          <li @click="toPage('/preliminary')">
            <img src="../../assets/images/icon_historyRecord.png" alt="" />
            <span>预审</span>
          </li>
          <li @click="toPage('/record')">
            <img src="../../assets/images/icon_historyRecord.png" alt="" />
            <span>预审进度</span>
          </li>
          <li @click="toPage('/materialList')">
            <img src="../../assets/images/icon_historyRecord.png" alt="" />
            <span>自助服务记录</span>
          </li>
          <!-- <li @click="toPage('/needDo')">
                        <img src="../../assets/images/icon_historyRecord.png" alt="">
                        <span>未完成操作记录</span>
                    </li> -->
        </ul>
      </div>
    </div>
    <bottom-menu type="2" />
  </div>
</template>
<script>
import { httpAction } from '@/api/manage';
import bottomMenu from '@/components/menu';
import Cookies from 'js-cookie';
import infoMixin from '@/mixins/infoMixin.js'

export default {
  name: 'index',
  components: {
    bottomMenu
  },
mixins:[infoMixin],
  props: {},
  data() {
    return {
      member: {},
      imgUrl: ''
    };
  },
  created() {
    Cookies.remove('selected-page'+this.systemType);
    //   let state = {
    //         title: 'title',
    //         url: "#"
    //     }
    //     window.history.pushState(state, state.title, state.url)
    // this.$router.push('/my')
    this.member = JSON.parse(Cookies.get('member' + this.systemType));
    this.imgUrl = this.member.headimgurl ? this.member.headimgurl : require('../../assets/images/bg-user.png');
  },
  methods: {
    toPage(path) {
      if (path === '/message') {
        this.getGroupList();
        return;
      }

      this.$router.push({
        path: path
        // query: this.nowRowData
      });
    },
    formatData(tel) {
      return tel.replace(tel.substring(3, 7), '****');
    },
    getGroupList() {
      const toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      });
      httpAction('/message/linkcustomer', {
        body: ""
      })
        .then(response => {
          if (response.code == 0) {
            this.$router.push({
              path: '/message',
              query: response.data
            });
          }
          toastItem.clear();
        })
        .catch(error => {
          console.log(error);
          toastItem.clear();
        });
    }
  }
};
</script>
<style scoped>
.my-top {
  margin: 15px 15px 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 130px;
  background-color: #ffffff;
}
.my-top > img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 1;
}
.my-top-info {
  position: absolute;
  z-index: 2;
  width: calc(100% - 40px);
  height: calc(100% - 20px);
  padding: 20px 20px 0;
  color: #ffffff;
}
.my-top-info .left {
  display: inline-block;
  width: calc(100% - 100px);
  vertical-align: middle;
}
.name-info {
  display: inline-block;
  margin-bottom: 3px;
  height: 30px;
  line-height: 30px;
}
.name-status {
  color: #8089d1;
  font-size: 12px;
  margin: 10px 0 6px;
  height: 15px;
}
.phone {
  font-size: 14px;
  letter-spacing: 2px;
}
.my-top-info .right {
  display: inline-block;
  width: 95px;
  height: 95px;
  border-radius: 50%;
  overflow: hidden;
  vertical-align: middle;
}
.my-top-info .right img {
  width: 100%;
  height: 100%;
}
.my-list-do {
  width: 100%;
  height: calc(100% - 145px);
  background-color: #e5e5e5;
}
.list-ul {
  margin: 0 15px;
  background-color: #ffffff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0px 2px 15px 1px #d9d9d9;
}
.list-ul li {
  list-style-type: none;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #eeeeee;
  padding: 0 15px;
  background: url(../../assets/images/-s-icon_arrowR.png) no-repeat 96%;
  background-size: 12px;
}
.list-ul li img {
  width: 18px;
  height: 18px;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 3px;
}
.list-ul li > span {
  font-size: 14px;
  font-weight: bold;
  vertical-align: middle;
}
</style>
