/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

import { filterObj } from '@/utils/util'
import { deleteAction, getAction, downFile, httpAction, dict } from '@/api/manage'
import Cookies from 'js-cookie'
import { getToken, setToken } from '@/utils/auth'
// import Vue from 'vue'
// import { ACCESS_TOKEN } from "@/store/mutation-types"

export const listMixin = {
  data () {
    return {
      // token header
      // tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      // this.member = this.user.member;
      queryParam: {
        body: {

        },
        header: {

        }

      },

      initBodyData: [],
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc'
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      member: {},
      activeName: '-1',
      nowActive: '',
      searchListArr: [
        { arr: [], active: '-1', nowActive: '-1', name: 'memberId', hasMore: false, overflow: false },
        { arr: [], active: '-1', nowActive: '-1', name: 'departLongNumber', hasMore: false, overflow: false },
        // { arr: [], active: '-1', nowActive: '-1', name: 'type', hasMore: false, overflow: false },
        { arr: [], active: '-1', nowActive: '-1', name: 'state', hasMore: false, overflow: false },
        { arr: [], active: '-1', nowActive: '-1', name: 'time', hasMore: false, overflow: false }
      ],
      searchSelectedType: '',
      searchSelectedName: '',
      downloadLoading: false,
      searchType: true, // true 默认，查所有;false 高级条件查询
      generalSearchData: {}, //普通搜索数据
      advancedSearchData: {}, //高级搜索数据
      advancedSearchFlag: false,//高级搜索
      generalSearchFlag: false,//普通搜索
      importDiv_flag: false,//导入 弹出框 显示、隐藏
      keyNum: -1, //0普通搜索，1高级搜索

      search_falg: false,
      selfSort: '',
      tableDataAuto: false
      // memberSearchDisabled:true,//成员 部门搜索，暂时取消显示了
    }
  },
  created () {
    this.member = this.user.member
    this.queryParam.body.unitId = this.member.unitId
    if (this.tableDataAuto || this.tableDataAuto == undefined) {
      this.loadData()
    }
    if (this.hasSearch) {
      if (this.memberSearchDisabled) { //原来列表上 点人员 部门 的搜索
        this.getMemberList()
      }

    } else {
      window.onresize = ''
    }
    // 初始化字典配置 在自己页面定义
    this.initDictConfig()
  },
  methods: {
    loadData (arg) {
      if (!this.url.list) {
        this.$message({ message: '请设置url.list属性!', type: 'warning' })
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }

      var params = {}
      var apiUrl = ''
      if (this.searchType) {
        apiUrl = this.url.list

        //有普通搜索参数时，添加的参数
        params = this.getQueryParams()// 查询条件
        // if(this.generalSearchFlag){
        // params = {
        //   body: {},
        //   header: { pageNumber: 1, pageSize: 10 }
        // }
        if (JSON.stringify(this.generalSearchData) != '{}') {
          for (name in this.generalSearchData) {
            params.body[name] = this.generalSearchData[name]
            this.initBodyData.push(name)
            if (!this.generalSearchData[name]) {
              delete params.body[name]
            }
          }

          //普通搜索时有新改接口地址的话
          if (this.url.generalList) {
            apiUrl = this.url.generalList
          } else {
            apiUrl = this.url.list
          }
        } else {
          // this.initBodyData.forEach(item=>{
          //   delete params.body[item]
          // })
          // this.queryParam.body = {
          //   unitId:this.member.unitId,
          //   keywords:this.queryParam.body.keywords
          // }
        }
        // }

      } else {
        if (this.advancedSearchFlag) {
          apiUrl = '/search/advancedSaerch'
          params = {
            body: this.advancedSearchData,
            header: { pageNumber: 1, pageSize: 10 }
          }
        }
      }
      if (this.isSort) {
        params.header.sortList = [{
          orderField: 'updateTime',
          orderType: 'desc'
        }]
      } else if (this.orderField == 'sortNo') {
        params.header.sortList = [{
          orderField: 'sortNo',
          orderType: 'asc'
        }]
      } else {
        delete params.header.sortList
      }
      // 清空选择框和选择的内容
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
        this.nowRowData = {}
      }
      // if (this.hasSearch) {
      //   if (this.user.member.departRange.length == 0) {
      //     this.curHeight = 'calc(100vh - 298px)'

      //   }
      // }
      if (this.otherBodyParam && JSON.stringify(this.otherBodyParam) != '{}') {
        for (name in this.otherBodyParam) {
          this.queryParam.body[name] = this.otherBodyParam[name]
        }
      }



      console.log(this.queryParam)
      this.loading = true
      httpAction(apiUrl, params).then((res) => {
        if (res.code == 0) {
          // this.dataSource = res.result.records;
          // this.ipagination.total = res.result.total;

          this.dataSource = res.data.dataList
          this.ipagination.total = res.data.total
          if (this.noPaging) {
            this.dataSource = res.data
          }
        }
        if (res.code === 1) {
          this.$message.warning(res.msg)
          this.dataSource = []
          this.ipagination.total = 0
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    //高级搜索是 点查询的事件
    searchQueryFun (data) {
      console.log(data)
      this.advancedSearchData = data
      this.searchType = false
      this.loadData(1)
    },
    //普通搜索时，点击列或查询 的事件
    generalSearchQueryFun (data) {
      this.generalSearchData = data
      this.loadData(1)
    },
    // isGeneralSearch(){//普通搜索 1.0
    //   if(!this.generalSearchFlag){
    //     this.cancelAdvancedSearch()
    //   }
    //   this.generalSearchFlag=true
    //   this.advancedSearchFlag=false

    // },
    isGeneralSearch () {//普通搜索 2.0
      this.keyNum = 0
      if (!this.generalSearchFlag) {
        this.cancelAdvancedSearch()
      }
      this.generalSearchFlag = !this.generalSearchFlag
      this.advancedSearchFlag = false
      this.computeFun(0)
      this.computeFun(1)
    },
    isAdvancedSearch () {//高级搜索
      this.keyNum = 1
      if (!this.advancedSearchFlag) {
        this.cancelAdvancedSearch()
      }

      this.generalSearchFlag = false
      this.advancedSearchFlag = !this.advancedSearchFlag
    },
    listRecovery () {//列表重置
      this.generalSearchFlag = false
      this.advancedSearchFlag = false
      this.cancelAdvancedSearch()
      //更新完毕后再去打开
      this.$nextTick(() => {
        if (this.keyNum == 0) {
          this.generalSearchFlag = true
        } else if (this.keyNum == 1) {
          this.advancedSearchFlag = true
        }
      })
    },
    cancelAdvancedSearch () {//默认列表请求
      this.clearOtherData()
      this.generalSearchData = {}
      this.queryParam.body.keywords = ''
      this.initBodyData.forEach(item => {
        delete this.queryParam.body[item]
      })
      this.searchType = true
      this.loadData(1)
    },
    initDictConfig () {
      // console.log("--这是一个假的方法!")
    },
    handleSuperQuery (arg) {
      // 高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams () {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
      }
      // var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
      var param = Object.assign(sqp, this.queryParam)// 查询参数


      // param.field = this.getQueryField();
      // param.pageNumber = this.ipagination.current;
      // param.pageSize = this.ipagination.pageSize;

      param.header = {
        pageNumber: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      }
      if (this.hasSort) {
        param.header.sortList = [{
          orderField: 'sortNo',
          orderType: 'asc'
        }]
      }
      return filterObj(param)// 过路参数空内容
    },
    getQueryField () {
      // TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },

    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery () {
      this.searchType = true
      this.loadData(1)
    },
    superQuery () {
      this.$refs.superQueryModal.show()
    },
    searchReset () {
      this.queryParam = {}
      this.loadData(1)
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            deleteAction(api, { ids: ids }).then((res) => {
              if (res.success) {
                this.$message({
                  message: '操作删除' + (res.msg == 'success' ? '成功' : '失败'),
                  type: res.msg == 'success' ? 'success' : 'error',
                  duration: 2000
                })
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },

    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      if (this.selectionMoreData.length == 0) {
        this.$message.error('请选择要删除的数据')
        return
      }
      let api = ''
      let temp = null
      if (this.selectionMoreData.length > 1) { // 批量删除
        api = this.url.deleteBatch
        const ids = []
        this.selectionMoreData.forEach((item) => {
          ids.push(item.id)
        })
        temp = ids
      } else {
        api = this.url.delete // 单个删除
        temp = this.selectionMoreData[0].id
      }
      this.$confirm('确定要删除选择的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpAction(api, { body: temp }).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '操作删除' + (res.msg == 'success' ? '成功' : '失败'),
              type: res.msg == 'success' ? 'success' : 'error',
              duration: 2000
            })
            if (this.cancelFun) {
              this.cancelFun()
            }
            this.loadData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      })
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleTableChange (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    handleToggleSearch () {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    modalFormOk () {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },
    /* 导出 */
    handleExportXls2 () {
      debugger
      const paramsStr = encodeURI(JSON.stringify(this.getQueryParams()))
      const url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`
      window.location.href = url
    },
    handleExportXls (fileName) {
      if (!fileName || typeof fileName !== 'string') {
        fileName = '导出文件'
      }
      const param = { ...this.queryParam }
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(',')
      }
      console.log('导出参数', param)
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls')
        } else {
          const url = window.URL.createObjectURL(new Blob([data]))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    /* 导入 */
    handleImportExcel (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            const { message, result: { msg, fileUrl, fileName } } = info.file.response
            const href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span><br />
                  <span>具体详情请 <a href={href} target='_blank' download={fileName}>点击下载</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `)
      }
    },
    /* 图片预览 */
    getImgView (text) {
      if (text && text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      return window._CONFIG['imgDomainURL'] + '/' + text
    },
    /* 文件下载 */
    uploadFile (text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      window.open(window._CONFIG['domianURL'] + '/sys/common/download/' + text)
    },

    // 本月、上月切换
    getTabs (type) {
      // this.clearOtherData()
      if (this.nowActive != type) {
        this.queryParam.body.queryType = type
        this.nowActive = type
        this.searchSelectedType = '更新时间'
        this.searchSelectedName = type == 1 ? '30天内更新' : type == 2 ? '30天外更新' : ''
      } else { // 全部
        delete this.queryParam.body.queryType
        this.nowActive = ''
        this.activeName = '-1'
        this.searchSelectedType = ''
        this.searchSelectedName = ''
      }
      this.loadData(1)
    },
    clearOtherData (num) {
      // this.searchListArr[0].active = '-1'
      // this.searchListArr[0].nowActive = '-1'
      // this.searchListArr[1].active = '-1'
      // this.searchListArr[1].nowActive = '-1'
      // delete this.queryParam.body.memberId
      // delete this.queryParam.body.departLongNumber
      this.searchListArr.forEach((item, index) => {
        item.active = '-1'
        item.nowActive = '-1'
        delete this.queryParam.body[item.name]
      })
      this.selectionMoreData = []
    },
    clearMemberData (num) {
      // if(num == 0){
      //   this.searchListArr[1].active = '-1'
      //   this.searchListArr[1].nowActive = '-1'
      //   delete this.queryParam.body.departLongNumber
      // }else if(num == 1){
      //   this.searchListArr[0].active = '-1'
      //   this.searchListArr[0].nowActive = '-1'
      //   delete this.queryParam.body.memberId
      // }
      this.searchListArr.forEach((item, index) => {
        if (num == 1) {
          if (index != 1) {
            item.active = '-1'
            item.nowActive = '-1'
            delete this.queryParam.body[item.name]
          }
        }
        //  else if (num == 0) {
        //   if (index == 2) {
        //     item.active = '-1'
        //     item.nowActive = '-1'
        //     delete this.queryParam.body[item.name]
        //   }
        // }
      })
      this.activeName = '-1'
      this.nowActive = '-1'
      delete this.queryParam.body.queryType
      this.selectionMoreData = []
    },
    tabDo (tab, index, type, name) {
      this.clearMemberData(type)
      let curId = ''
      if (this.searchListArr[type].nowActive != index) {
        if (type == 0) {
          curId = tab.id
          this.searchSelectedType = '负责人'
          this.searchSelectedName = tab.realName
        } else if (type == 1) {
          curId = tab.path
          this.searchSelectedType = '部门'
          this.searchSelectedName = tab.name
        } else if (type == 2) {
          curId = tab.id
          this.searchSelectedType = '状态'
          this.searchSelectedName = tab.itemText
        } else if (type == 3) {
          curId = tab.id
          this.searchSelectedType = '更新时间'
          this.searchSelectedName = tab.itemText
        }
        // } else if (type == 2) {
        //   curId = tab.id
        //   this.searchSelectedType = name
        //   this.searchSelectedName = tab.itemText
        // }
        this.searchListArr[type].nowActive = index
        this.queryParam.body[this.searchListArr[type].name] = curId
        this.searchListArr[type].active = index
      } else { // 全部
        // delete this.queryParam.body.queryType;
        this.clearOtherData()
        curId = ''
        this.searchListArr[type].nowActive = '-1'
        this.searchListArr[type].active = '-1'
        this.searchSelectedType = ''
        this.searchSelectedName = ''
      }
      this.initBodyData = [...this.initBodyData, ...['memberId', 'departLongNumber']]
      this.searchListArr[type].overflow = false
      // this.loadData(1)
    },
    getMemberList () {
      const memberObj = this.user.member
      // if (this.hasTypeSearch) {
      //   // 商机/项目类型
      //   dict('buss_opportunity_type').then(res => {
      //     this.searchListArr[2].arr = res.data
      //     this.computeFun(2)
      //   })
      // }
      console.log("当前是否存在更新时间", this.hasTimeSearch)
      if (this.hasTimeSearch) {
        //查周期
        dict("SJXMZQ").then(res => {
          this.searchListArr[3].arr = res.data
          this.computeFun(3)
        })
      }
      if (this.SearchStateType == 0) {
        // 客户代理商状态
        dict('KHQYZT').then(res => {
          this.searchListArr[2].arr = res.data
          this.computeFun(2)
        })
      } else if (this.SearchStateType == 1) {
        // 项目商机客户状态
        dict('project_status').then(res => {
          this.searchListArr[2].arr = res.data
          this.computeFun(2)
        })
      } else if (this.SearchStateType == 2) {
        // 线索
        dict('XSZT').then(res => {
          this.searchListArr[2].arr = res.data
          this.computeFun(2)
        })
      }

      if (memberObj.departRange.length == 0) {
        return
      }
      const temp = {
        // allPathMember:true,
        // departId:memberObj.depart.id,
        departRanges: memberObj.departRange,
        // jobId:memberObj.job.id,
        // memberState:'',
        // memberType:'',
        // postId:'',
        unitId: memberObj.unitId
      }
      // 查人员
      httpAction('/member/queryMemberList', { body: temp }).then((res) => {
        if (res.code == 0) {
          this.searchListArr[0].arr = res.data
          this.computeFun(0)
        }
      })
      // 查部门
      // httpAction('/depart/queryChildListByRanges', { body: memberObj.departRange }).then((res) => {
      httpAction('/depart/findListByParams', { body: { unitId: this.member.unitId } }).then(res => {
        if (res.code == 0) {
          this.searchListArr[1].arr = res.data != null ? res.data : []
          this.searchListArr[1].arr.push(...res.data[0].departList)
          this.computeFun(1)
          if (this.clearStyle == 0) {
            this.curHeight = this.searchListArr[1].arr.length == 0 ? 'calc(100vh - 338px)' : 'calc(100vh - 215px)'
          }
        }
      })


    },
    // 单独查人员
    queryMemberList (tab) {
      const temp = {
        body: {
          departId: tab.id,
          unitId: tab.unitId,
          allPathMember: true
        }
      }
      httpAction('/member/queryMemberList', temp).then((res) => {
        if (res.code == 0) {
          this.searchListArr[0].arr = res.data
          this.computeFun(0)
        }
      })
    },
    getDepartTab (tab, index) { // 部门
      this.queryMemberList(tab)
      this.tabDo(tab, index, 1)
    },
    getMemberTab (tab, index) { // 人员
      this.tabDo(tab, index, 0)
    },
    getStateTab (tab, index) {  // 状态
      this.tabDo(tab, index, 2)
    },
    getTimeTab (tab, index) {  // 更新时间
      this.tabDo(tab, index, 3)
    },
    getTypeTab (tab, index, name) { // 商机/项目类型
      this.tabDo(tab, index, 2, name)
    },
    computeFun (type) {
      this.$nextTick(() => {
        const obj = this.$refs[this.searchListArr[type].name]
        let str = 0
        if (obj) {
          for (var i = 0; i < obj.children.length; i++) {
            str += obj.children[i].offsetWidth + 5
          }
          if (str > obj.offsetWidth) {
            this.searchListArr[type].hasMore = true
          } else {
            this.searchListArr[type].hasMore = false
          }
          this.searchListArr[type].overflow = false

          this.menuResize()
        }
      })
    },
    // 更多
    moreFun (type) {
      this.searchListArr[type].overflow = !this.searchListArr[type].overflow
    },
    menuResize () {
      window.onresize = () => {
        this.computeFun(0)
        this.computeFun(1)
        // if (this.hasTypeSearch) {
        //   this.computeFun(2)
        // }
        if (this.hasTimeSearch) {
          this.computeFun(3)
        }
      }
    },
    closeSelected () {
      // this.searchListArr[0].active = '-1'
      // this.searchListArr[0].nowActive = '-1'
      // this.searchListArr[0].overflow = false
      // this.searchListArr[1].active = '-1'
      // this.searchListArr[1].nowActive = '-1'
      // this.searchListArr[1].overflow = false
      // this.activeName = '-1'
      // this.nowActive = '-1'
      // this.searchSelectedType = ''
      // this.searchSelectedName = ''
      // delete this.queryParam.body.queryType;
      // delete this.queryParam.body.memberId
      // delete this.queryParam.body.departLongNumber
      this.searchListArr.forEach((item, index) => {
        item.active = '-1'
        item.nowActive = '-1'
        item.overflow = false
        delete this.queryParam.body[item.name]
      })
      this.activeName = '-1'
      this.nowActive = '-1'
      this.searchSelectedType = ''
      this.searchSelectedName = ''
      delete this.queryParam.body.queryType
      this.loadData(1)
    },
    export_excel () {
      console.log(this.selectionMoreData)
      if (this.selectionMoreData.length > 0) {
        this.export_excel_selected()
      } else {
        this.export_excel_all()
      }
    },
    // 勾选内容导出
    export_excel_selected () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.export_excel_data.tHeader
        const filterVal = this.export_excel_data.filterVal
        const jsonData = this.selectionMoreData
        const data = this.formatJson(filterVal, jsonData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.export_excel_data.name,
          autoWidth: 'true',
          bookType: 'xlsx' // 'xlsx', 'csv', 'txt'
        })
        this.downloadLoading = false
      })
    },
    // 所有导出
    export_excel_all () {
      this.queryParam.header.pageSize = this.ipagination.total
      httpAction(this.url.list, this.queryParam).then((res) => {
        if (res.code == 0) {
          if (res.data.dataList.length > 0) {
            const list = res.data.dataList
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = this.export_excel_data.tHeader
              const filterVal = this.export_excel_data.filterVal
              const jsonData = list
              const data = this.formatJson(filterVal, jsonData)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: this.export_excel_data.name,
                autoWidth: 'true',
                bookType: 'xlsx' // 'xlsx', 'csv', 'txt'
              })
              this.downloadLoading = false
            })
          } else {
            this.$message.warning('暂无数据导出')
            return
          }
        }
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (Object.prototype.toString.call(v[j]) === '[object Object]') {
          let str = ''
          if (v[j] != null) {
            str = v[j].itemText || v[j].name
          }
          return str
        } else {
          for (name in this.export_excel_data.format) {
            if (j == name) {
              return this.export_excel_data.format[name][v[j]]
            }
          }
          return v[j]
        }
      }))
    },
    importDivClose (status) {
      this.importDiv_flag = false
      //导入后 最后一步关闭时 刷新数据
      if (status == 3) {
        this.loadData(1)
      }
    },
    handleCommand (command) {
      if (command == 0) { //导出
        // if (!this.url.export) {
        //   this.$message.error('请设置this.url.export属性')
        //   return
        // }
        // window.open(this.url.export + '?token=' + getToken())
        this.export_excel()
      } else if (command == 1) { //导入
        this.importDiv_flag = true
      } else if (command == 2) { //下载模板
        if (!this.url.downloadTemplet) {
          this.$message.error('请设置this.url.downloadTemplet属性')
          return
        }
        window.open(this.url.downloadTemplet + '?token=' + getToken())
      } else if (command == 3) { //导出全部
        if (!this.url.export) {
          this.$message.error('请设置this.url.export属性')
          return
        }
        window.open(this.url.export + '?token=' + getToken())
      }
    },
    uploadSectionFile (params) {
      if (!this.url.import) {
        this.$message.error('请设置this.url.import属性')
        return
      }
      const file = params.file
      let isExcel = null
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        isExcel = true
      }
      if (!isExcel) {
        this.$message.error('请选择正确excel的文件格式!')
        return
      }
      const form = new FormData()
      form.append('files', file)
      httpAction(this.url.import, form).then(response => {
        if (response.code == 0) {
          this.$message({
            message: '导入' + (response.msg == 'success' ? '成功' : '失败'),
            type: response.msg == 'success' ? 'success' : 'error',
            duration: 2000
          })
          this.loadData()
          if (response.data.length > 0) {
            let str = ''
            response.data.forEach((item) => {
              str += (item + '；')
            })
            this.$alert(str, '导入提示', {
              confirmButtonText: '确定',
              callback: action => {

              }
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 全选 点击
    selectAllClick (e) {
      this.selectionMoreData = e
    },
    selectAllClick_split (e) {
      this.selectionMoreData = e
      this.cancelFun()
    },
    selectCheck () {
      if (this.selectionMoreData.length > 1) {
        this.$message({ message: '请选择一条需要修改的数据', type: 'warning' })
        return false
      }
      if (this.selectionMore && this.selectionMoreData[0]) {
        this.nowRowData = this.selectionMoreData[0]
      } else {
        this.nowRowData = {}
      }
      return true
    }
  }

}
