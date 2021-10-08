<template>
  <div>
    <div class="all">
      <p class="pageTitle">{{ pageTitle }}</p>
      <div
        v-if="serverList.length > 0"
        class="con-item-div"
        v-for="(item, index) in serverList"
        :key="index"
      >
        <p class="title">{{ item.name }}</p>
        <ul class="serve-list">
          <li v-if="item.loading" style="background: none; text-align: center">
            <van-loading />
          </li>
          <li
            v-for="(itemChild, itemChildIndex) in item.depositoryMains"
            :key="itemChildIndex"
            @click="toSelectPage(itemChild)"
          >
            <img :src="imgData[getRandom()]" alt="" />
            <span class="left">{{ itemChild.name }}</span>
            <span style="background-color: #fff"></span>
          </li>
        </ul>
      </div>
      <div v-if="serverList.length == 0" class="noData-div">
        <img src="../../assets/images/noData.png" alt="" />
        <p>暂无数据</p>
      </div>
    </div>
    <!-- <div class="bottom-div" style="height: 50px;">
            <van-button type="primary" size="large" @click="toIndex">首页</van-button>
        </div> -->
    <div class="bottom-div">
      <div class="btn-div" style="text-align: center">
        <button class="left" style="width: calc(100% - 20px)" @click="toIndex">
          首页
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { httpAction } from "@/api/manage";
import Cookies from "js-cookie";
export default {
  name: "index",
  components: {},

  props: {},
  data() {
    return {
      serverList: [],
      pageData: {
        id: "",
      },
      imgData: [
        require("../../assets/images/icon_school.png"),
        require("../../assets/images/icon_restaurant.png"),
        require("../../assets/images/icon_Internet_cafe.png"),
        require("../../assets/images/icon_Agent_bookkeeping.png"),
        require("../../assets/images/icon_liquor.png"),
        require("../../assets/images/icon_Grain_Oil.png"),
        require("../../assets/images/icon_passport.png"),
        require("../../assets/images/icon_pass.png"),
        require("../../assets/images/icon_passport.png"),
        require("../../assets/images/icon_transaction.png"),
      ],
      pageTitle: "",
    };
  },
  created() {
    this.member = JSON.parse(Cookies.get("member" + this.systemType));
    // this.checkMobile();
    // this.pageData = this.$route.query;

    // Cookies.set("pathname", "/preliminary");
    // this.init();

    if (this.member.mobile) {
      this.checkMobile();
      this.pageData = this.$route.query;

      Cookies.set("pathname", "/preliminary");
      this.init();
    }else{
       this.checkMobile();
    }
  },
  methods: {
    init() {
      // let pageNum = Cookies.get('selected-page' + this.systemType);
      // if (pageNum) {
      //   pageNum = Number(pageNum);
      //   if (pageNum === 0) {
      //     this.pageTitle = '单一事项';
      //     this.getDict(2);
      //   } else {
      //     this.pageTitle = '一事一次办';
      //     this.getDict(1);
      //     this.serverList = [];
      //   }
      //   return;
      // }
      this.Dialog.confirm({
        closeOnClickOverlay: false,
        title: "系统提示",
        message: "请先选择办事类型？",
        cancelButtonText: "一事一次办",
        cancelButtonColor: "#1989fa",
        confirmButtonText: "单一事项",
      })
        .then(() => {
          // on confirm
          this.pageTitle = "单一事项";
          Cookies.set("selected-page" + this.systemType, 0);
          this.getDict(2);
        })
        .catch(() => {
          // on cancel
          this.pageTitle = "一事一次办";
          Cookies.set("selected-page" + this.systemType, 1);
          this.getDict(1);
          console.log("cancel");
          console.log(this.serverList);
          this.serverList = [];
        });
    },
    checkMobile() {
      console.log(`checkMobile`, this.member.mobile);
      if (!this.member.mobile) {
        console.log(`checkMobile`, this.member.mobile);
        this.Dialog.alert({
          title: "系统提示",
          message: "请完善基础信息里的手机号码",
        }).then(() => {
          this.$router.push({
            path: "/baseInfo",
            query: { checkMobile: true },
          });
        });
      }
    },
    getRandom() {
      return Math.floor(Math.random() * 10);
    },

    toIndex() {
      // Cookies.remove('pathname')
      this.$router.push({
        path: "/index",
        // query: this.nowRowData
      });
    },
    toSelectPage(data) {
      data.isHistory = false;
      this.$router.push({
        path: "/preliminaryDetail",
        query: data,
      });
    },
    //获取类型数据字典
    getDict(num) {
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      httpAction("/dict/findDictByCode", { body: "ZTLX" })
        .then((res) => {
          if (res.code == 0) {
            let arr = res.data.items;
            this.serverList = [];
            if (arr.length > 0) {
              arr.forEach((item, index) => {
                let obj = {
                  majorCategorys: [0],
                  name: item.itemText,
                  depositoryMains: [],
                  loading: true,
                };
                httpAction("/Subject/wxPage", {
                  body: {
                    // attribute:[1],
                    majorCategorys: [num],
                    recyclingMark: false,
                    subjectType: item.id,
                  },
                  header: {
                    pageNumber: 1,
                    pageSize: 1000,
                    sortList: [
                      {
                        orderField: "updateTime",
                        orderType: "desc",
                      },
                    ],
                  },
                }).then((resData) => {
                  if (res.code == 0) {
                    obj.depositoryMains = resData.data.dataList;
                  }
                  setTimeout(() => {
                    toastItem.clear();
                  }, 500);
                  obj.loading = false;
                });
                this.serverList.push(obj);
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>
/* .all{
        height:calc(100vh - 50px);
    }
    .bottom-div {
        height: 50px;
    } */
.pageTitle {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin: 0px 15px 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.top-con {
  overflow: hidden;
  padding: 15px 15px 0;
}
.top-banner-div {
  width: 100%;
  height: 123px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
}
.top-banner-div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.top-search-div {
  width: 100%;
  height: 45px;
  background-color: #ffffff;
  border-radius: 5px;
  line-height: 45px;
  font-size: 14px;
  box-shadow: 0px 2px 15px 1px #d9d9d9;
}
.top-search-div img {
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin: 0 12px;
}
.con-item-div {
  padding-top: 30px;
}
.con-item-div p.title {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  border-left: 4px solid #00b240;
  padding-left: 15px;
  margin: 0px 15px 0;
}

.serve-item-div ul {
  padding: 15px 15px 0;
  margin-top: 10px;
  background-color: #ffffff;
}
.serve-item-div ul li {
  list-style-type: none;
  display: inline-block;
  width: calc(50% - 38px);
  height: 100px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  padding: 15px 15px 0;
}
.serve-item-div ul li:nth-child(2n + 1) {
  margin-right: 10px;
}
.serve-item-div ul li img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.serve-item-div ul li > div.info {
  position: absolute;
  z-index: 2;
  color: #ffffff;
  width: calc(100% - 30px);
}
.serve-item-div ul li > div.info p {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.serve-item-div ul li > div.info span {
  font-size: 13px;
  line-height: 18px;
  display: inline-block;
}

.serve-list {
  margin: 10px 15px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 15px 1px #d9d9d9;
}
.serve-list li {
  list-style-type: none;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eeeeee;
  margin: 0 15px;
  background: url(../../assets/images/-s-icon_arrowR.png) no-repeat right;
  background-size: 12px;
}
.serve-list li img {
  width: 18px;
  height: 18px;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 3px;
}
.serve-list li > span {
  font-size: 14px;
  font-weight: bold;
  vertical-align: middle;
}
.serve-list li > span.left {
  display: inline-block;
  width: calc(100% - 55px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.serve-list li > span:last-child {
  font-size: 12px;
  color: #9d9d9d;
  background-color: #e4e4e4;
  float: right;
  min-width: 5px;
  height: 18px;
  line-height: 18px;
  margin-top: 15px;
  text-align: center;
  border-radius: 10px;
  margin-right: 18px;
  padding: 0px 3px;
}
.serve-list li > span.first {
  background-color: #fe0000;
  color: #ffc5c5;
}
.serve-list li > span.second {
  background-color: #ffb900;
  color: #feedc6;
}
.serve-list li > span.third {
  background-color: #00b80a;
  color: #ffffff;
}
.serve-list li:last-child {
  border-bottom: none;
}
.serve-list li.lastNone {
  background: none;
  text-align: center;
  font-size: 12px;
  color: #a1a1a1;
  font-weight: bold;
}
.serve-list li.firstNone {
  background: #eff3ff;
  font-size: 12px;
  color: #2855e4;
  font-weight: bold;
  margin: 0;
  padding: 0 15px;
}
.serve-list li.firstNone img {
  margin-right: 15px;
  width: 12px;
  height: 12px;
}
.serve-list.last-span-none li > span:last-child,
.serve-list li.firstNone > span:last-child {
  background: none;
}
.answer .serve-list li {
  background: none;
}
.answer .serve-list li > span {
  font-weight: 500;
}
.answer .serve-list li.firstNone {
  background: #eff3ff;
  text-align: center;
}
.answer .serve-list li.firstNone > span {
  background: #eff3ff;
  font-size: 15px;
  color: #2855e4;
  margin: 0;
  padding: 0 15px;
  text-align: center;
  font-weight: bold;
}
.answer .serve-list li img {
  width: 12px;
  height: 12px;
}
.noData-div {
  width: 100%;
  height: 215px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.noData-div p {
  color: #999;
  font-size: 14px;
  margin: 10px 0;
}
</style>
