<template>
  <div>
    <div class="all" style="height: 100vh">
      <div class="con-item-div answer" style="padding-top: 10px">
        <ul class="serve-list last-span-none">
          <li class="firstNone">
            <img
              src="../../assets/images/icon_arrowL.png"
              alt=""
              @click="backPage"
            />
            <span>{{ pageData.itemText }}</span>
            <span style="display: none" />
          </li>
          <template v-if="refresh">
            <li
              v-for="(item, index) in serverList"
              :key="index"
              @click="toSelectPage(item)"
            >
              <!-- <span class="isSelect-style">
                                <img v-if='isSelected(item.id)' src="../../assets/images/icon_hook.png" alt="">
                            </span> -->
              <span>{{ item.name }}</span>
              <span />
              <!-- <span @click.stop="toNextLevel(item)"></span> -->
            </li>
          </template>
        </ul>
        <p v-if="serverList.length == 0" class="noData">暂无数据</p>
      </div>
    </div>
    <!-- <div class="bottom-div">
            <div class="btn-div">
                <button class="left" @click="prevLevel" :disabled="stepArr.length==1">上一步</button>
                <button class="middle" @click="toNextLevel">下一步</button>
                <button class="right" @click="getMaterial">材料清单</button>
            </div>
        </div> -->
  </div>
</template>
<script>
import { httpAction } from "@/api/manage";
import bottomMenu from "@/components/menu";
import infoMixin from "@/mixins/infoMixin.js";
export default {
  name: "Index",
  components: {
    bottomMenu,
  },
  mixins: [infoMixin],
  props: {},
  data() {
    return {
      serverList: [],
      stepArr: [],
      stepIndex: 0,
      refresh: true,
      selectdDataArr: [],
      moreSelect: true,
      currentData: "",
      pageData: {
        id: "",
        value: "",
      },
    };
  },
  created() {
    this.pageData = this.$route.query;
    console.log(`this.pageData`, this.pageData)

    this.getMatterTypeList();
  },
  methods: {
    getMatterTypeList() {
      const toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中...",
      });
      let majorCategorys = [];
      if(this.pageData.majorCategorys instanceof Array){
        majorCategorys = this.pageData.majorCategorys;
      } else{
        majorCategorys.push(this.pageData.majorCategorys);
      }
      httpAction("/Subject/wxPage", {
        body: {
          // attribute: [1],
          recyclingMark: false,
          subjectType: this.pageData.id,
          majorCategorys: majorCategorys,
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
      })
        .then((response) => {
          if (response.code == 0) {
            this.serverList = [];
            this.serverList = response.data.dataList;
          }
          console.log(this.serverList);
          toastItem.clear();
        })
        .catch((error) => {
          console.log(error);
          toastItem.clear();
        });
    },
    toNextLevel() {
      if (this.selectdDataArr.length > 0) {
        this.getLevelData(this.selectdDataArr, 1);
      } else {
        this.Toast("请选择数据");
      }
    },
    prevLevel() {
      if (this.stepIndex > 0) {
        this.getLevelData(this.stepArr[this.stepIndex - 1], 2);
      }
    },
    toPage(path) {
      // this.$router.push({
      //     path: path,
      //     // query: this.nowRowData
      //   })
    },
    toSearch() {
      this.$router.push({
        path: "/search",
        // query: this.nowRowData
      });
    },
    backPage() {
      this.$router.go(-1);
    },
    getMaterial() {
      let ids = "";
      if (this.selectdDataArr.length == 0) {
        ids = [this.liData.id];
      } else {
        ids = this.selectdDataArr;
      }
      //   debugger
      this.$router.push({
        path: "/serverTable",
        query: { ids: ids, name: this.liData.matterName },
      });
      //   let temp = {
      //       body: {
      //             matterId: "string",
      //             memberId: "string"
      //         }
      //   }
      //   httpAction('Wxoperation/findmaterial',temp).then(response => {
      //     if (response.code == 0) {

      //     }
      //   }).catch(error => {
      //     console.log(error)
      //     this.refresh = true
      //   })
    },
    // 选择
    selectItem(data) {
      if (this.moreSelect) {
        let delIndex = null;
        this.selectdDataArr.forEach((item, index) => {
          if (item == data.id) {
            delIndex = index;
          }
        });

        if (delIndex != null) {
          this.selectdDataArr.splice(delIndex, 1);
          delIndex = null;
        } else {
          this.selectdDataArr.push(data.id);
          this.currentData = data.id;
        }
      } else {
        this.selectdDataArr = [data.id];
      }

      //   console.log(this.selectdDataArr)
    },
    isSelected(id) {
      return this.selectdDataArr.includes(id);
    },
    toSelectPage(data) {
      this.$router.push({
        path: "/serverDetail",
        query: data,
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
/* .serve-list li.isSelected{
        background: url(../../assets/images/icon_hook.png) no-repeat right;
        background-size: 12px;
    } */
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
  margin-right: -10px;
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
  margin-right: 10px;
  width: 12px;
  height: 12px;
}
.serve-list.last-span-none li > span:last-child,
.serve-list li.firstNone > span:last-child {
  background: none;
}
/* .answer .serve-list li{
        background: none;

    } */
.answer .serve-list li > span {
  font-weight: 500;
}
.answer .serve-list li.firstNone {
  background: #eff3ff;
  text-align: left;
}
.answer .serve-list li.firstNone > span {
  background: #eff3ff;
  font-size: 15px;
  color: #2855e4;
  margin: 0;
  /* padding: 0 15px; */
  text-align: center;
  font-weight: bold;
}
.answer .serve-list li img {
  width: 12px;
  height: 12px;
}
.noData {
  margin: 10px 15px;
  font-size: 14px;
  color: #666;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.isSelect-style {
  display: inline-block;
  width: 12px;
}
</style>
