<template>
  <div>
    <div class="all" style="height:100vh">
      <div ref="imageWrapper">
        <div class="top-text">
          <p class="all-title">{{ tableData.subject.name }}</p>
          <!-- <p>{{tableData.subject.description}}</p> -->
          <p class="p-remarks">{{ tableData.subject.description }}</p>
        </div>
        <ul class="con-list" ref="imageTable">
          <li v-if="sysFiles && sysFiles.length > 0" style="margin: 0;padding: 8px 5px 0;">
            <div class="img-style-div"><img v-for="(item, index) in sysFiles" :key="index" :src="item" alt="" /></div>
          </li>
          <li>
            <template>
              <el-table v-if="!isRefresh" ref="table" :data="tableData.detailList" border style="width: 100%">
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column label="材料名称" width="120" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.material">{{ scope.row.material.materialName }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="材料编号" width="100" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.material">{{scope.row.material.materialId}}</span>
                                    </template>
                                </el-table-column> -->
                <el-table-column label="材料类型" width="80" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.material">{{ materialTypeName[scope.row.material.materialType] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否必要" width="95" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.necessity ? '必要' : '非必要' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="材料验收" width="120" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.checkAccept">
                      <template v-if="scope.row.checkAccept == '1'">
                        收原件
                      </template>
                      <template v-else-if="scope.row.checkAccept == '4'">
                        收复印件
                      </template>
                      <template v-else-if="scope.row.checkAccept == '2'">
                        验原件收复印件
                      </template>
                      <template v-else-if="scope.row.checkAccept == '3'">
                        收原件及复印件
                      </template>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="材料数量" width="80" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.qty }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="材料说明" min-width="300" align="center">
                                    <template slot-scope="scope">
                                        <span style="text-align: left;display: inline-block;width: 100%;">{{scope.row.material.materialDescription}}</span>
                                    </template>
                                </el-table-column> -->
                <el-table-column label="材料备注" width="150" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="样本" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.material" @click="handleClick(scope.row.material.sysFiles)" type="text" size="small">查看详细</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="已上传" width="120" align="center">
                  <template slot-scope="scope">
                    <el-button @click="getUpload(scope.row.resultAnnex)" type="text" size="small">详情</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80" align="center">
                  <template slot-scope="scope">
                    <van-uploader
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xlsx"
                      :after-read="
                        e => {
                          afterRead(e, scope.row, 2, scope.$index);
                        }
                      "
                    >
                      <el-button type="primary" size="small">上传</el-button>
                    </van-uploader>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </li>
        </ul>
      </div>
      <div class="bottom-btn">
        <span @click="viewFiles">文件</span>
        <van-uploader
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xlsx"
          :after-read="
            e => {
              afterRead(e, tableData, 1);
            }
          "
        >
          <el-button type="primary" size="small">上传资料</el-button>
        </van-uploader>
        <!-- <el-button type="primary" size="small" @click="backChange">完成</el-button> -->
        <el-button type="primary" size="small" @click="saveChange" style="margin-left: 0;">提交审核</el-button>
        <el-button type="primary" size="small" @click="zancun" style="margin-left: 0;">暂存</el-button>
      </div>
    </div>
    <!-- 查看详细 -->
    <div class="password-popup">
      <div class="popup-bg" @click="popupShow = !popupShow" v-if="popupShow"></div>
      <div class="mobile-popup-con" v-if="popupShow">
        <p class="popup-title">{{ popupTitle }}</p>

        <div class="description">
          <ul v-if="files && files.length > 0">
            <li v-for="(item, index) in files" :key="index" @click="setImg(index)">
              <span>{{ index + 1 }}.{{ item.fileName }}</span>
              <i class="el-icon-delete" @click.stop="filesDel(item, index)" style="padding: 4px;"></i>
              <i class="i-down-btn" @click.stop="downPage(item)">下载</i>
            </li>
          </ul>
          <p v-else>暂无数据</p>
        </div>
        <div class="popup-div-btn"><span @click="popupShow = !popupShow">确定</span></div>
      </div>
    </div>
    <van-popup v-model="dialogTableVisible"><van-image width="95vw" height="95vh" :src="imgUrl" fit="contain" /></van-popup>

    <van-action-sheet v-model="showAction" :actions="actions" cancel-text="取消" close-on-click-action @select="onSelect" @cancel="onCancel" />
  </div>
</template>
<script>
import { httpAction } from '@/api/manage';
import Cookies from 'js-cookie';
import bottomMenu from '@/components/menu';
import html2canvas from 'html2canvas';
export default {
  name: 'index',
  components: {
    bottomMenu
  },

  props: {},
  data() {
    return {
      showAction: false,
      actions: [{ name: '材料清单', index: 0 }, { name: '图片', index: 1 }, { name: 'Excel', index: 2 }],
      imgPath: window._CONFIG['apiUrl'],
      hotServer: [],
      queryData: {
        body: '',
        header: {
          pageNumber: 1,
          pageSize: 5,
          sortList: [
            {
              orderField: 'updateTime',
              orderType: 'desc'
            }
          ]
        }
      },
      tableData: {
        subject: {},
        detailList: []
      },
      selectData: {
        subject: {
          processFlowFiles: []
        }
      },
      popupShow: false,
      files: [],
      imgArr: [],
      materialTypeName: ['证照', '批文', '证明', '表单', '其他'],
      toastItem: {},
      sysFiles: [],
      dialogTableVisible: false,
      imgUrl: '',
      isRefresh: false
    };
  },
  metaInfo() {
    return {
      title: this.title,
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=3.0, user-scalable=yes' }]
    };
  },
  created() {
    this.selectData = this.$route.query;
    console.log(this.selectData);
    this.findById(this.selectData.id);
    // this.getMaterial()
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.backChange, false);
    }
  },
  methods: {
    afterRead(e, item, operType, index) {
      console.log(e);
      const form = new FormData();
      form.append('files', e.file);
      if (operType == 1) {
        if (item.materialAnnex) {
          form.append('referenceId', item.materialAnnex);
        }
      } else if (operType == 2) {
        if (item.resultAnnex) {
          form.append('referenceId', item.resultAnnex);
        }
      }
      this.toastItem = this.Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '上传中...'
      });
      httpAction('/file/upload', form)
        .then(response => {
          if (response.code == 0) {
            if (operType == 1) {
              if (item.materialAnnex == null) {
                this.tableData.materialAnnex = response.data.referenceId;
              }
            } else if (operType == 2) {
              if (item.resultAnnex == null) {
                this.tableData.detailList[index].resultAnnex = response.data.referenceId;
              }
            }

            this.filesUpdata(response.data.referenceId, item.id, operType);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    filesUpdata(referenceId, itemId, operType) {
      let temp = {
        annex: referenceId,
        objectId: itemId,
        operType: operType
      };
      httpAction('/Wxoperation/submitOperationResult', { body: temp })
        .then(response => {
          this.toastItem.clear();
          if (response.code == 0) {
            setTimeout(() => {
              this.Toast('上传成功');
            }, 500);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setImg(index) {
      if (this.isImg(this.imgArr[index])) {
        this.ImagePreview({
          images: this.imgArr,
          showIndex: true,
          loop: false,
          startPosition: index
        });
      } else {
        window.location.href = this.imgArr[index];
      }
    },
    isImg(filePath) {
      let strArr = filePath.split('.');
      let ext = strArr[strArr.length - 1];
      let nameArr = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff'];
      let temp = nameArr.includes(ext);
      if (!temp) {
        //大写转换为小写时判断一次
        let lowercase = ext.toLowerCase();
        temp = nameArr.includes(lowercase);
      }
      return temp;
    },
    filesDel(item, index) {
      this.Dialog.confirm({
        closeOnClickOverlay: false,
        title: '系统提示',
        message: '确定删除文件吗？'
      })
        .then(() => {
          let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '删除中...'
          });
          httpAction('/file/deleteById', { body: item.id })
            .then(response => {
              if (response.code == 0) {
                setTimeout(() => {
                  this.Toast('删除成功');
                }, 500);
                this.files.splice(index, 1);
              }
              toastItem.clear();
            })
            .catch(error => {
              toastItem.clear();
              console.log(error);
            });
        })
        .catch(() => {});
    },
    getMaterial() {
      let data = JSON.parse(Cookies.get('member' + this.systemType));
      let temp = {
        // matterId: this.selectData.ids,
        // memberId: data.id,
        // unoperationId:this.selectData.recordId?this.selectData.recordId.id||this.selectData.recordId:''
        // operationId:this.selectData.operationId?this.selectData.operationId:'',
        opinionIds: this.selectData.ids ? this.selectData.ids : [],
        subjectId: this.selectData.subjectId
      };
      //已完成的历史记录进详情 传 已完成的id
      if (this.selectData.finishId) {
        temp.finishId = this.selectData.finishId;
      }
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      });
      //-/Wxoperation/findmaterial
      httpAction('/Wxoperation/addRecord', { body: temp })
        .then(response => {
          if (response.code == 0) {
            console.log(response.data);
            // this.tableData = response.data
            // this.tableData = [];
            // response.data.forEach((item,itemIndex)=>{
            //     item.bizMatterDepositorySlaves.forEach((child,childIndex)=>{
            //         child = Object.assign(child,child.bizMaterialDepository)
            //         child.itemName = item.name
            //         if(childIndex == 0){
            //             if(item.bizMatterDepositorySlaves.length == 1){
            //                 child.rowspan = 0
            //             }else{
            //                 child.rowspan = item.bizMatterDepositorySlaves.length
            //             }

            //         }else{
            //             child.rowspan = 0
            //         }

            //         this.tableData.push(child)
            //     })
            // })
            // this.tableData = listArr
            console.log(this.tableData);
            this.findById(response.data.id);
          }
          // this.$nextTick(() => {
          //     this.$refs.table.doLayout(); //解决表格错位
          // });
          toastItem.clear();
        })
        .catch(error => {
          toastItem.clear();
          console.log(error);
        });
    },
    findById(id) {
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      });
      httpAction('/Wxoperation/findRecordById', { body: id })
        .then(response => {
          if (response.code == 0) {
            console.log(response.data);
            this.tableData = response.data;
            let filesId = response.data.subject ? response.data.subject.processFlow : '';
            if (filesId) {
              httpAction('/file/findByReferenceId', { body: filesId })
                .then(response => {
                  if (response.code == 0) {
                    let imglist = response.data ? response.data : [];
                    this.sysFiles = [];
                    imglist.forEach(item => {
                      this.sysFiles.push(this.imgPath + item.fileUrl);
                    });
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
          toastItem.clear();
        })
        .catch(error => {
          console.log(error);
          toastItem.clear();
        });
    },
    handleClick(list, type) {
      this.imgArr = [];
      if (list && list.length > 0) {
        list.forEach(item => {
          this.imgArr.push(this.imgPath + item.fileUrl);
        });
      }
      this.files = list;
      this.popupShow = true;
      this.popupTitle = type == 1 ? '已上传文件' : '示例文件';
    },
    viewFiles() {
      // this.handleClick(this.tableData.materialAnnexFiles,1)
      this.getUpload(this.tableData.materialAnnex);
    },
    getUpload(id) {
      if (id == null) {
        this.handleClick([], 1);
        return;
      }
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      });
      httpAction('/file/findByReferenceId', { body: id })
        .then(response => {
          if (response.code == 0) {
            this.handleClick(response.data, 1);
          }
          toastItem.clear();
        })
        .catch(error => {
          toastItem.clear();
          console.log(error);
        });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.rowspan != 1) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    backChange() {
      history.pushState(null, null, document.URL);
      this.$router.push({
        path: '/preliminary',
        data: {}
      });
    },
    downPage(item) {
      console.log(item);
      this.$router.push({
        path: '/downPage',
        query: item
      });
    },
    zancun() {
      this.$router.replace({
        path: '/record',
        data: {}
      });
    },
    saveChange() {
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      });
      httpAction('/Wxoperation/submitOperationRecord', {
        body: this.selectData.id
      })
        .then(res => {
          toastItem.clear();
          if (res.code === 0) {
            // this.Toast('提交成功')
            this.Dialog.alert({
              title: '提示',
              message: '您的申请已提交，工作人员将尽快为您审核。',
              confirmButtonText: '我知道了'
            }).then(() => {
              // on close
              this.$router.replace({
                path: '/record',
                data: {}
              });
            });
          }
        })
        .catch(() => {
          toastItem.clear();
        });
      // this.showAction = true;
      // this.Dialog.confirm({
      //     closeOnClickOverlay:true,
      //     title: '系统提示',
      //     message: '请先选择保存位置？',
      //     cancelButtonText:'清单记录',
      //     cancelButtonColor:'#1989fa',
      //     confirmButtonText:'本地'
      // })
      // .then(() => {
      //     // on confirm
      //     console.log('下载')
      //
      // })
      // .catch(() => {
      //     // on cancel
      //     console.log('清单记录')
      //     this.addMaterialList()
      // });
    },
    excelDown() {
      let tableObj = this.$refs.table;
      console.log(tableObj);
      let tableCol = tableObj.columns;
      let tableW = 0;
      tableCol.forEach((item, index) => {
        if (tableCol.length - 3 > index) {
          tableW += item.width;
        }
      });
      tableW = tableW;
      let tableH = tableObj.$el.clientHeight + 180;
      let opts = {
        backgroundColor: '#ffffff',
        width: tableW,
        windowWidth: tableW,
        height: tableH,
        windowHeight: tableH,
        // allowTaint:true,
        usecors: true
        // scale: 1,
      };
      // 滚动条置顶
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      this.$refs.imageTable.scrollTop = 0;
      tableObj.bodyWrapper.scrollLeft = 0;

      this.isRefresh = true;
      let toastItem = this.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
      setTimeout(() => {
        this.isRefresh = false;
        this.$nextTick(() => {
          toastItem.clear();
          html2canvas(this.$refs.imageWrapper, opts).then(canvas => {
            let dataURL = canvas.toDataURL('image/png');
            this.imgUrl = dataURL;
            console.log(this.imgUrl);
            if (this.imgUrl !== '') {
              setTimeout(() => {
                this.Toast('长按图片保存');
              }, 1500);
              // this.dialogTableVisible = true;
              this.ImagePreview([this.imgUrl]);
            }
          });
        });
      }, 100);
    },
    addMaterialList() {
      // let toastItem = this.Toast.loading({
      //     duration: 0, // 持续展示 toast
      //     forbidClick: true,
      //     message: '保存中...',
      // })
      // httpAction('/file/findByReferenceId', {body:id}).then(response => {
      //     if (response.code == 0) {
      //         setTimeout(()=>{
      //             this.Toast('保存成功')
      //         },500)
      //     }
      //     toastItem.clear()
      // }).catch(error => {
      //     toastItem.clear()
      //     console.log(error)
      // })
    },
    onCancel() {
      this.showAction = false;
    },
    onSelect(item) {
      if (item.index === 0) {
        this.addMaterialList();
      } else if (item.index === 1) {
        this.excelDown();
      } else {
        this.downPage({
          id: this.selectData.id,
          mimeType: 'downloadPage'
        });
      }
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.backChange, false);
  }
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
.description {
  min-height: 125px;
  padding: 0 5px;
  line-height: 20px;
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
}
.description p {
  text-align: center;
  line-height: 100px;
  color: #999;
}
.description li {
  line-height: 20px;
  min-height: 20px;
  overflow: hidden;
  word-wrap: break-word;
  width: 100%;
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1px dashed #e7e7e7;
}

.top-text {
  padding: 15px 10px 0px;
  height: 89px;
  background-color: #fff;
  margin-bottom: 15px;
  overflow: hidden;
}
.all-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
}
.top-text .p-remarks {
  /* display: inline-block; */
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box; */
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
  height: 50px;
}
.con-list {
  width: 100%;
  height: calc(100vh - 162px);
  margin: auto;
  overflow: auto;
  /* padding: 0 13px; */
}
.con-list li {
  min-height: 100px;
  background-color: #fff;
  /* margin-bottom: 20px; */
  /* padding: 8px 5px; */
  border-radius: 5px;
}
.img-style-div img {
  width: 100%;
}
.bottom-btn {
  margin: 5px;
  text-align: center;
}
.bottom-btn span {
  position: absolute;
  left: 0;
  height: 35px;
  line-height: 35px;
  margin: 0 10px;
  font-size: 13px;
  color: #1890ff;
}
.isFront {
  width: 100%;
  min-height: 25px;
  line-height: 25px;
  border-bottom: 1px dashed #e7e7e7;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 0.8rem;
}
.isFront i {
  vertical-align: text-bottom;
  font-size: 16px;
  color: #fed577;
}
.con-list li .top {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.con-list li .top p {
  width: 100%;
  min-height: 25px;
  line-height: 25px;
  font-weight: bold;
  margin-bottom: 5px;
}
.con-list li .top span {
  font-size: 0.8rem;
  color: #999;
}
.con-list li .middle {
  font-size: 0.8rem;
  margin-bottom: 10px;
}
.con-list li .middle > div {
  margin-bottom: 8px;
}
.con-list li .middle > div span:first-child {
  display: inline-block;
  color: #888888;
  width: 65px;
  vertical-align: top;
}
.con-list li .middle > div span:last-child {
  display: inline-block;
  color: #000000;
  width: calc(100% - 70px);
}
.con-list li .bottom {
  height: 35px;
  line-height: 35px;
  border-top: 1px dashed #e7e7e7;
  padding-top: 5px;
  color: #00b7e6;
}
.con-list li .bottom p {
  font-size: 0.9rem;
}
.con-list li .bottom i {
  float: right;
  padding: 10px;
}
</style>
