/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

import { filterObj } from '@/utils/util';
import { deleteAction, getAction,downFile,httpAction } from '@/api/manage'
import Cookies from 'js-cookie'

export const formMixin = {
  data(){
    return {
      queryParam: {
        body:{
          
        }
      },
      stateTitle:'',
      member:{},
      rowData:{},
      showTreeModelPos:'',
      modelType:'1',
      selectionType:'1',
      tableDialog:false,
      treeDialog:false,
      relation:{},
      url: {
        upload: window._CONFIG['upload'],
        imgView: window._CONFIG['imgView'],
        fileList: window._CONFIG['fileList'],
        fileDelete: window._CONFIG['fileDelete']
      },
      fileIds:[],
      fileList:[]
    }
  },
  created() {
    
    this.member = this.user.member;
    this.rowData = this.$route.query;
    if(this.isOrg){
      if(this.orgMemberData.id){
        this.setFormData(this.orgMemberData);
        this.stateTitle = '修改';
      }else{
        this.stateTitle = '新建';
      }
    }else{
      if(this.edit_id){
          this.getDetail(this.edit_id);
          this.stateTitle = '修改';
      }else{
          this.stateTitle = '新建';
          this.ruleForm.customerId = this.rowData.id;
          // this.ruleForm.unitId = this.member.unitId;
      }
    }
    
    
  },
  methods:{
    submitForm(){
        if(!this.url.saveUpdate){
            this.$message.error("请设置url.saveUpdate属性!")
            return
          }
        this.$refs['form'].validate((valid) => {
            if (valid) {
                let temp = {
                    body:this.ruleForm
                };
                // if(this.ruleForm.fileIds&&this.ruleForm.fileIds.length == 0){
                //   temp.body.fileIds = this.fileIds
                // }
                if(this.isBilling){
                  temp.body.customerId = this.rowData.id
                }
                
                console.log(temp)
                httpAction(this.url.saveUpdate, temp).then(response => {
                    if (response.code == 0) {
                        this.$message({
                            message: this.stateTitle + (response.msg == 'success'?'成功':'失败'),
                            type: response.msg == 'success' ? 'success' : 'error',
                            duration: 2000
                        });
                        this.setModel(1);
                    };
                }).catch(error => {
                    console.log(error);
                })
            }
        });
  },
  getDetail(id){
    if(!this.url.findById){
        this.$message.error("请设置url.findById属性!")
        return
      }
    httpAction(this.url.findById, {body:id}).then(response => {
            if (response.data) {
            this.setFormData(response.data);
            }
        }).catch(error => {
            console.log(error)
        })
    },
  setFormData(data){
    for(name in this.ruleForm){
        this.ruleForm[name] = data[name];
    };
    if(this.isOrg){
      this.ruleForm.memberIdName = data.memberName
    }else{
      this.ruleForm.createByName = data.createName
    }
     // 合同记录-客户
    if(typeof(this.ruleForm.customerIdName) == "undefined" || this.ruleForm.customerIdName == ''){
      this.ruleForm.customerIdName = data.customerName
    }
    
     // 客户管理-联系人
     if(this.isContract){
      this.ruleForm.customer = data.customer.id
    }
    
    if(data.files){
      this.fileIds = []
      data.files.forEach((item)=>{
        this.fileIds.push(item.id)
        item.name = item.fileName +item.fileSuffix
      })
      this.fileList = data.files
    }
   },
   showTreeModel(name,type,only){//选择人显示弹窗
    this.showTreeModelPos = name;
    this.modelType = type;
    this.selectionType = only;
    this.treeDialog = true;
  },
  showTableModel(name,type,linkmanType){//选择显示弹窗,分页
    this.showTreeModelPos = name;
    this.modelType = type;
    if(type == 3){ //联系人时
      this.relation = {
        relationId:this.rowData.customerId,
        // type:linkmanType
      };
      this.tableDialog = true;
      return;
    };
    this.tableDialog = true;
  },
  getTreeModelVal(data){ //弹窗确定后 设置值
    if(!data){
      this.treeDialog = false;
      this.tableDialog = false;
      return;
    };
    if(this.showTreeModelPos == 'receiver'){//投诉接待人
      this.manyName(data,'receiver',1);
    }else if(this.showTreeModelPos == 'complainant'){//客户投诉人
      this.manyName(data,'complainant',0);
    }else if(this.showTreeModelPos == 'owner'){ //合同所有人 //签署人
      this.manyName(data,'owner',1);
    }else if(this.showTreeModelPos == 'customerId'){ //客户名称
      this.manyName(data,'customerId',0);
    }else if(this.showTreeModelPos == 'product'){//产品
      this.manyName(data,'product',0);
    } else if (this.showTreeModelPos == 'memberId') { //组织 人员
      this.manyName(data,'memberId',1)
    } else if (this.showTreeModelPos == 'createBy') { //创建人
      this.manyName(data,'createBy',1)
    };
  },
  manyName(data,name,type){
      this.ruleForm[name] = '';
      let str = ''
      let parameterName = type == 0 ? 'name' :'realName';
      data.forEach((item,index) => {
        str += item[parameterName]+(index+1 == data.length?'':'，');
        this.ruleForm[name] += item.id+(index+1 == data.length?'':',');
      });
      this.ruleForm[name+'Name'] = str;
      console.log(this.ruleForm)
      this.treeDialog = false;
      this.tableDialog = false;
   },
    fileDown (file) {
      let fileId = ''
      if(file.response){
        fileId = file.response.data.id
      }else{
        fileId = file.id
      }
      window.open(this.url.imgView + fileId)
    },
    handleRemove (file, fileList) { // 删除
      // const id = file.response.data.id
      let fileId = ''
      if(file.response){
        fileId = file.response.data.id
      }else{
        fileId = file.id
      }
      // 删除文件
      httpAction(this.url.fileDelete, { 'body': fileId }).then(response => {
        if (response.code == 0) { // 赋值
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.fileIds.forEach((item,index)=>{
            if(item == id){
              this.fileIds.splice(index, 1)
            }
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }, 
    handleSuccess (res, file, fileList) {
      if (res.code == 0) {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
        this.fileIds.push(res.data.id)
      } else {
        this.$message({
          message: '上传失败',
          type: 'error',
          duration: 2000
        })
      }
    },

  }
}