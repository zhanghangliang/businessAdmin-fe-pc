<template>
  <div>
    <div class="all">
      <div class="top-con">
        <div class="top-banner-div">
          <!-- <img src="../../assets/images/img-ban01.jpg" alt="" /> -->
          <img src="../../assets/images/img-suining.png" style="width: 100%;" alt="" />
          <div class="text-info">
            <h3>遂宁市政务大百科</h3>
            <span>深化放管服改革 优化营商环境</span>
          </div>
        </div>
        <div class="top-search-div" @click="toSearch">
          <img src="../../assets/images/icon_search.png" alt="" />
          <span style="color: #b3b5be">我要开学校 | 开餐饮店</span>
        </div>
      </div>
      <div class="con-item-div">
        <p class="title">一件事服务</p>
        <div class="serve-item-div">
          <ul>
            <li
              v-for="(item, index) in matterData"
              :key="index"
              @click="toMatterList(item)"
            >
              <img :src="imgData[index]" alt="" />
              <div class="info">
                <p>{{ item.itemText }}</p>
                <span>{{ item.description }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="con-item-div">
        <p class="title">热门服务</p>
        <ul class="serve-list" v-if="hotServer.length > 0">
          <li
            v-for="(item, index) in hotServer"
            :key="item.id"
            @click="toDetail(item)"
            v-if="item.subjectName"
          >
            <span>
              <!-- <img src="../../assets/images/one.png" alt="" v-if='index==0'>
                            <img src="../../assets/images/two.png" alt="" v-if='index==1'>
                            <img src="../../assets/images/three.png" alt="" v-if='index==2'> -->
              <van-icon
                name="fire"
                color="#FE0000"
                size="18"
                v-if="index == 0"
              />
              <van-icon
                name="fire"
                color="#FFB900"
                size="18"
                v-if="index == 1"
              />
              <van-icon
                name="fire"
                color="#00B80A"
                size="18"
                v-if="index == 2"
              />
              {{ item.subjectName }}
            </span>
            <span v-if="index == 0" class="first">{{ item.count }}</span>
            <span v-else-if="index == 1" class="second">{{ item.count }}</span>
            <span v-else-if="index == 2" class="third">{{ item.count }}</span>
            <span v-else>{{ item.count }}</span>
          </li>
          <li class="lastNone" @click="moreQuery">查看更多</li>
        </ul>
        <p v-else class="noData-p">暂无数据</p>
      </div>
    </div>
    <bottom-menu type="0" />

    <van-dialog
      v-model="showBox"
      title="遂宁政务服务使用声明"
      messageAlign="left"
      :beforeClose="beforeClose"
    >
      <div class="box-msg">
        <p>
          1.为了给行政相对人提供更准确、更有个性的服务，申请人请如实填写个人信息，确保申请材料的真实性。使用虚假信息造成的相应的法律后果由本人自行承担。
        </p>
        <p>
          2.遂宁行政审批局重视并保护所有使用遂宁政务服务公众号个人隐私权，保证数据不会泄露，也不会挪作他用；
        </p>
        <div style="display: flex; justify-content: center">
          <van-checkbox v-model="checked">我同意上述内容</van-checkbox>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { httpAction } from "@/api/manage";
import bottomMenu from "@/components/menu";
import Cookies from "js-cookie";
export default {
  name: "index",
  components: {
    bottomMenu,
  },

  props: {},
  data() {
    return {
      hotServer: [
        // {subjectName:'张三',count:13},
        // {subjectName:'李四',count:23},
        // {subjectName:'王五',count:23},
        // {subjectName:'赵六',count:23}
      ],
      matterData: [],
      imgData: [
        require("../../assets/images/bg_service01.jpg"),
        require("../../assets/images/bg_service02.jpg"),
        require("../../assets/images/bg_service03.jpg"),
        require("../../assets/images/bg_service04.jpg"),
        require("../../assets/images/bg_service05.jpg"),
        require("../../assets/images/bg_service06.jpg"),
        require("../../assets/images/bg_service07.jpg"),
        require("../../assets/images/bg_service08.jpg"),
        require("../../assets/images/bg_service09.jpg"),
      ],
      queryData: {
        body: "",
        header: {
          pageNumber: 1,
          pageSize: 5,
          sortList: [
            {
              orderField: "count",
              orderType: "desc",
            },
          ],
        },
      },
      showBox: false,
      checked: false,
    };
  },
  created() {
    let ua = window.navigator.userAgent.toLowerCase();
    if (true || ua.match(/MicroMessenger/i) == "micromessenger") {
      this.getHotList();
      this.getMatterType();
      this.member = JSON.parse(Cookies.get("member" + this.systemType));
      this.checkMobile();
    } else {
      this.$router.push({ path: "/emptyPage" });

      console.log("不是微信浏览器");
    }
  },
  methods: {
    checkMobile() {
      if (!this.member.mobile) {
        this.showBox = true;
      }
    },
    beforeClose(action, done) {
      if (this.checked) {
        done();
        setTimeout(() => {
          this.Dialog.alert({
            title: "系统提示",
            message: "请完善基础信息里的手机号码",
          }).then(() => {
            this.$router.push({
              path: "/baseInfo",
              query: { checkMobile: true },
            });
          });
        }, 300);
      } else {
        done(false);
        this.Notify({
          type: "warning",
          message: '请勾选 "我同意上述内容"',
          className: "isTopNotify",
        });
      }
    },
    //事项分类
    getMatterType() {
      httpAction("/dict/findDictByCode", { body: "ZTLX" })
        .then((response) => {
          if (response.code == 0) {
            this.matterData = [];
            response.data.items.forEach((item) => {
              if (item.itemCode) {
                this.matterData.push(item);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //热门服务
    getHotList(type, pageNumber) {
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      httpAction("/WxIndex/popularservices", this.queryData)
        .then((response) => {
          if (response.code == 0) {
            if (response.data.content.length == 0) {
              if (type == 1) {
                // this.$message({
                //     message: '没有更多的数据了',
                //     type: 'warning',
                //     duration: 2000
                // })
                this.Toast("没有更多的数据了");
                this.queryData.header.pageNumber = pageNumber - 1;
              }
            } else {
              this.hotServer = [...this.hotServer, ...response.data.content];
            }
          }
          setTimeout(() => {
            toastItem.clear();
          }, 500);
        })
        .catch((error) => {
          toastItem.clear();
          console.log(error);
        });
    },
    moreQuery() {
      // this.checkMobile()
      this.queryData.header.pageNumber++;
      this.getHotList(1, this.queryData.header.pageNumber);
    },
    toDetail(data) {
      // this.checkMobile()
      data.id = data.subjectId;
      this.$router.push({
        path: "/serverDetail",
        query: data,
      });
    },
    toSearch() {
      // this.checkMobile()
      this.$router.push({
        path: "/search",
        // query: this.nowRowData
      });
    },
    toMatterList(data) {
      // this.$router.push({
      //   path: '/serverDetail',
      //   query: {
      //     id:'2c91121676dff6af0177b3fca2743d93'
      //   }
      // })
      // return;

        // this.checkMobile()
      console.log(`data`, data);
      let majorCategorys = data.itemCode == 8 ? [2] : [1];
      this.$router.push({
        path: "/matterTypeList",
        query: {
          ...data,
          majorCategorys,
        },
      });
    },
  },
};
</script>
<style scoped>
.top-con {
  overflow: hidden;
  padding: 15px 15px 0;
}
.top-banner-div {
  width: 100%;
  height: 130px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
}
.top-banner-div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.top-banner-div .text-info {
  position: absolute;
  z-index: 2;
  color: #ffffff;
  top: 25px;
  left: 15px;
}
.top-banner-div .text-info h3 {
  margin-bottom: 8px;
  font-size: 1.5rem;
  color: #fdfdfd;
}
.top-banner-div .text-info span {
  color: #dee1e4;
  font-size: 0.93rem;
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
/* .serve-item-div{

    } */
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
  background-color: #999;
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
  object-fit: cover;
}
.serve-item-div ul li > div.info {
  position: absolute;
  z-index: 2;
  color: #ffffff;
  width: calc(100% - 95px);
  left: 8px;
  top: 30px;
}
.serve-item-div ul li > div.info p {
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  width: 135px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.serve-item-div ul li > div.info span {
  font-size: 13px;
  line-height: 18px;
  display: inline-block;
  height: 35px;
  overflow: hidden;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 35px;
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
  font-size: 13px;
  font-weight: bold;
  vertical-align: middle;
}
.serve-list li > span:first-child {
  display: inline-block;
  width: calc(100% - 70px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.serve-list li > span i {
  vertical-align: text-bottom;
}
.serve-list li > span:last-child {
  font-size: 12px;
  color: #9d9d9d;
  background-color: #e4e4e4;
  float: right;
  min-width: 30px;
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
.noData-p {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #999;
  font-size: 12px;
}
.box-msg {
  flex: 1;
  max-height: 60vh;
  padding: 26px 24px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  text-align: left;
  word-wrap: break-word;
}
</style>
