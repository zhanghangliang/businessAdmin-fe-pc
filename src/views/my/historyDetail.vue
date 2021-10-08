<template>
    <div>
        <div class="all" style="height:100vh">
            <div class="top-text">
                <p class="all-title">{{tableData.subject.name}}</p>
                <span>{{tableData.subject.description}}</span>
            </div>
            <ul class="con-list">
                <li v-if="tableData.subject.sysFiles&&tableData.subject.sysFiles.length>0" style="margin: 0 13px 15px;padding:0;">
                    <div class="img-style-div">
                        <img v-for="(item,index) in tableData.subject.sysFiles" :key="index" :src="imgPath+item.fileUrl" alt="">
                    </div>
                </li>
                <!-- <li v-for='(item,index) in tableData.material' :key='index'>
                     <template v-if='item.material'>
                        <p class="isFront" v-if="item.material.front">
                            <van-icon name="star" />
                        {{item.material.frontDescription}}
                        </p>
                        <div class="top">
                            <p>{{item.material.materialName}}</p>
                            <span>{{item.material.materialDescription}}</span>
                        </div>
                        <div class="middle">
                            <div>
                                <span>材料编号</span>
                                <span>{{item.material.materialId}}</span>
                            </div>
                            <div>
                                <span>材料类型</span>
                                <span>{{materialTypeName[item.material.materialType]}}</span>
                            </div>
                            <div>
                                <span>材料必要性</span>
                                <span>{{item.necessity?'必要':'非必要'}}</span>
                            </div>
                            <div>
                                <span>材料验收</span>
                                <span v-if="item.checkAccept">{{item.checkAccept == '1'?'收原件':item.checkAccept == '2'?'验原件收复印件':'收原件及复印件'}}</span>
                            </div>
                            <div>
                                <span>材料数量</span>
                                <span>{{item.qty}}</span>
                            </div>
                            <div v-if='item.remark'>
                                <span>备注</span>
                                <span>{{item.remark}}</span>
                            </div>
                            
                        </div>
                        <div class="bottom" v-if="item.material.sysFiles.length>0">
                            <p @click="handleClick(item.material)">示例图片
                                <van-icon name="arrow" />
                            </p>
                        </div>
                    </template>
                </li> -->
                <li>
                    <template>
                        <el-table 
                        ref='table'
                        :data="tableData.material" 
                        border 
                        style="width: 100%">
                            <el-table-column  type="index" label="序号" width="50" align="center"> </el-table-column>
                            <el-table-column  label="材料名称" width="120" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.material">{{scope.row.material.materialName}}</span>
                                </template>
                            </el-table-column>
                            
                            <!-- <el-table-column label="材料编号" width="100" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.material">{{scope.row.material.materialId}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column label="材料类型" width="80" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.material">{{materialTypeName[scope.row.material.materialType]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="是否必要" width="95" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.necessity?'必要':'非必要'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="材料验收" width="120" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.checkAccept">
                                        <template v-if="scope.row.checkAccept == '1'">收原件</template>
                                        <template v-else-if="scope.row.checkAccept == '4'">收复印件</template>
                                        <template v-else-if="scope.row.checkAccept == '2'">验原件收复印件</template>
                                        <template v-else-if="scope.row.checkAccept == '3'">收原件及复印件</template>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="材料数量" width="80" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.qty}}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="材料说明" min-width="300" align="center">
                                <template slot-scope="scope">
                                    <span style="text-align: left;display: inline-block;width: 100%;">{{scope.row.material.materialDescription}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column label="材料备注" width="150" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.remark}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="样本" width="120" align="center">
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.material" @click="handleClick(scope.row.material)" type="text" size="small">查看详细</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </li>
            </ul>
            
        </div>
        <!-- 查看详细 -->
        <div class="password-popup">
            <div class="popup-bg" @click="popupShow=!popupShow" v-if="popupShow"></div>
            <div class="mobile-popup-con" v-if="popupShow">
                <p class="popup-title">示例文件</p>
                
                <div class="description">
                    <ul>
                        <li v-for="(item,index) in files" :key="index" @click="setImg(index)">
                            {{index+1}}.{{item.fileName}}
                        </li>
                    </ul>
                </div>
                <div class="popup-div-btn">
                    <span @click="popupShow=!popupShow">确定</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {httpAction} from '@/api/manage'
import Cookies from 'js-cookie'
import bottomMenu from '@/components/menu'

export default {
  name: 'index',
  components: {
      bottomMenu
  },
  
  props: {
      
  },
  data () {
    return {
        imgPath:window._CONFIG['apiUrl'],
        hotServer:[],
        queryData:{
            body: "",
            header: {
                pageNumber: 1,
                pageSize: 5,
                sortList: [
                    {
                        orderField: "updateTime",
                        orderType: "desc"
                    }
                ]
            }
        },
        tableData:{
            subject:{},
            material:[]
        },
        selectData:{
            subject:{
                processFlowFiles:[]
            }
        },
        popupShow:false,
        files:[],
        imgArr:[],
        materialTypeName:['证照','批文','证明','表单','其他']
    }
  },
  metaInfo () {
      return {
        title: this.title,
        meta: [
          { name: 'viewport', content:'width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=3.0, user-scalable=yes' }
        ]
      }
    },
  created () {
    
    this.selectData = this.$route.query
    
    this.getMaterial()
    
//     window.addEventListener("popstate", (e)=> {  //回调函数中实现需要的功能
//         this.$router.push({
//             path: '/doHistory',
//         })
//         return
//     }, false);

  },
  methods: {
      setImg(index){
          if(this.isImg(this.imgArr[index])){
                this.ImagePreview({
                    images:this.imgArr,
                    showIndex:true,
                    loop:false,
                    startPosition:index
                })
          }else{
              window.location.href = this.imgArr[index]
          }
      },
      isImg(filePath) {
        let strArr =  filePath.split(".")
        let ext = strArr[strArr.length-1]
        let nameArr = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'svg', 'tiff']
        let temp = nameArr.includes(ext)
        if(!temp){ //大写转换为小写时判断一次
            let lowercase = ext.toLowerCase() 
            temp = nameArr.includes(lowercase)
        }
        return temp;
    },
    downLoadFile(url) {     //  url为需要下载的文件地址
        const fileName = url.split('/').pop().split('?')[0];
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status === 200) {
                const data = this.response;
                const url = window.URL.createObjectURL(data)
                var a = document.createElement('a');
                a.download = fileName;
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                // window.URL.revokeObjectURL(url);
            }
        }
    },
    getMaterial(){
          let data = JSON.parse(Cookies.get('member'+this.systemType))
          let temp = {
                // matterId: this.selectData.ids,
                // memberId: data.id,
                // unoperationId:this.selectData.recordId?this.selectData.recordId.id||this.selectData.recordId:''
                // operationId:this.selectData.operationId?this.selectData.operationId:'',
                opinionIds:this.selectData.ids,
                relationShipId:this.selectData.finishId,
                subjectId:this.selectData.subjectId
            }
            //已完成的历史记录进详情 传 已完成的id
            // if(this.selectData.finishId){
            //     temp.finishId = this.selectData.finishId
            // }
        let toastItem = this.Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...',
        })  
        httpAction('/Wxoperation/findMaterialHistory', {body:temp}).then(response => {
            if (response.code == 0) {
                this.tableData = response.data
            }
            toastItem.clear()
          }).catch(error => {
            toastItem.clear()
            console.log(error)
          })
      },
      handleClick(row){
          this.imgArr = []
          if(row.sysFiles.length>0){
              row.sysFiles.forEach((item)=>{
                  this.imgArr.push(this.imgPath+item.fileUrl)
              })
          }
          this.files = row.sysFiles
          this.popupShow = true
      },
      filesView(data){
          console.log(data)
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

  }
}
</script>
<style scoped>
    
    .top-con{
        overflow: hidden;
        padding: 15px 15px 0;
    }
    .top-banner-div{
        width: 100%;
        height: 123px;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 15px;
    }
    .top-banner-div img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .top-search-div{
        width: 100%;
        height: 45px;
        background-color: #FFFFFF;
        border-radius: 5px;
        line-height: 45px;
        font-size: 14px;
    }
    .top-search-div img{
        vertical-align: middle;
        width: 20px;
        height: 20px;
        margin: 0 12px;
    }
    .con-item-div{
        padding-top: 30px;
    }
    .con-item-div p.title{
        font-size: 15px;
        font-weight: bold;
        color: #333333;
        border-left: 4px solid #00B240;
        padding-left: 15px;
        margin: 0px 15px 0;
    }
    /* .serve-item-div{

    } */
    .serve-item-div ul{
        padding: 15px 15px 0;
        margin-top: 10px;
        background-color: #ffffff;
    }
    .serve-item-div ul li{
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
    .serve-item-div ul li:nth-child(2n+1){
        margin-right: 10px;
    }
    .serve-item-div ul li img{
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .serve-item-div ul li > div.info{
        position: absolute;
        z-index: 2;
        color: #ffffff;
        width: calc(100% - 30px);
    }
    .serve-item-div ul li > div.info p{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .serve-item-div ul li > div.info span{
        font-size: 13px;
        line-height: 18px;
        display: inline-block;
    }

    .serve-list{
        margin: 10px 15px;
        background-color: #ffffff;
        border-radius: 5px;
    }
    .serve-list li{
        list-style-type: none;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #EEEEEE;
        margin: 0 15px;
        background: url(../../assets/images/-s-icon_arrowR.png) no-repeat right;
        background-size: 12px;
    }
    .serve-list li img{
        width: 18px;
        height: 18px;
        object-fit: cover;
        vertical-align: middle;
        margin-right: 3px;
    }
    .serve-list li > span{
        font-size: 14px;
        font-weight: bold;
        vertical-align: middle;
    }
    .serve-list li > span:last-child{
        font-size: 12px;
        color:#9D9D9D;
        background-color: #E4E4E4;
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
    .serve-list li > span.first{
        background-color: #FE0000;
        color: #FFC5C5;
    }
    .serve-list li > span.second{
        background-color: #FFB900;
        color: #FEEDC6;
    }
    .serve-list li > span.third{
        background-color: #00B80A;
        color: #ffffff;
    }
    .serve-list li:last-child{
        border-bottom: none;

    }
    .serve-list li.lastNone{
        background: none;
        text-align: center;
        font-size: 12px;
        color: #A1A1A1;
        font-weight: bold;
    }
    .serve-list li.firstNone{
        background: #EFF3FF;
        font-size: 12px;
        color: #2855E4;
        font-weight: bold;
        margin: 0;
        padding: 0 15px;
    }
    .serve-list li.firstNone img{
        margin-right: 15px;
        width: 12px;
        height: 12px;
    }
    .serve-list.last-span-none li > span:last-child,
    .serve-list li.firstNone > span:last-child{
        background: none;
    }
    .answer .serve-list li{
        background: none;

    }
    .answer .serve-list li > span{
        font-weight: 500;
    }
    .answer .serve-list li.firstNone{
        background: #EFF3FF;
        text-align: center;
    }
    .answer .serve-list li.firstNone > span {
        background: #EFF3FF;
        font-size: 15px;
        color: #2855E4;
        margin: 0;
        padding: 0 15px;
        text-align: center;
        font-weight: bold;
    }
    .answer .serve-list li img{
        width: 12px;
        height: 12px;
    }
    .description{
        min-height: 125px;
        padding: 0 5px;
        line-height: 20px;
        font-size: 14px;
        max-height: 300px;
        overflow-y: auto;
    }
    .description li{
        line-height: 20px;
        min-height: 20px;
        overflow: hidden;
        word-wrap: break-word;
        width: 100%;
        padding-bottom: 5px;
        margin-bottom: 5px;
        border-bottom: 1px dashed #E7E7E7;
    }
      
.top-text{
    padding: 15px 10px 0px;
    height: 89px;
    background-color: #fff;
    margin-bottom: 15px;
    overflow: hidden;
}
.all-title{
   font-weight: bold;
   font-size: 1.2rem;
   margin-bottom: 10px;
}
.top-text span{
    display: inline-block;
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
}
.con-list{
    width: 100%;
    height: calc(100vh - 119px);
    margin: auto;
    overflow: auto;
    /* padding: 0 13px; */
}
.con-list li{
    min-height: 100px;
    background-color: #fff;
    /* margin-bottom: 20px; */
    padding: 8px 5px;
    border-radius: 5px;
}
.img-style-div img{
    width: 100%;
}
.isFront{
    width: 100%;
    min-height: 25px;
    line-height: 25px;
    border-bottom:1px dashed #E7E7E7;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 0.8rem;
}
.isFront i{
    vertical-align: text-bottom;
    font-size: 16px;
    color: #FED577;
}
.con-list li .top{
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}
.con-list li .top p{
    width: 100%;
    min-height: 25px;
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 5px;
}
.con-list li .top span{
    font-size: 0.8rem;
    color: #999;
}
.con-list li .middle{
    font-size: 0.8rem;
    margin-bottom: 10px;
}
.con-list li .middle > div{
    margin-bottom: 8px;
}
.con-list li .middle > div span:first-child{
    display: inline-block;
    color:#888888;
    width: 65px;
    vertical-align: top;
}
.con-list li .middle > div span:last-child{
    display: inline-block;
    color:#000000;
    width: calc(100% - 70px);
}
.con-list li .bottom{
    height: 35px;
    line-height: 35px;
    border-top: 1px dashed #E7E7E7;
    padding-top: 5px;
    color: #00B7E6;
}
.con-list li .bottom p{
    font-size: 0.9rem;
}
.con-list li .bottom i{
    float: right;
    padding: 10px;
    
}
</style>