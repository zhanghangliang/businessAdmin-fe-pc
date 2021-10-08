<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable
      v-model="list"
       v-bind="max"
      class="board-column-content"
       :move="onMove"
        @end="end"
    >
       <transition-group type="transition">
           <li v-for="(item,index) in list" :key="index" >
              <!-- <span class="stage-time">2019年07月11日</span> -->
              <div class="stage-name">
              <span v-if='item.name'>
                {{ item.name }}
                <i v-if='!item.id' class="el-icon-edit"  @click='editMaxStage(item,index)'/>
              </span>  
              
              <el-input v-else v-model="inpList['curInput'+index]" placeholder="请输入内容" @blur='setMaxStage(item,index)'></el-input>
              <!-- <div class="stage-days">
                  <span>20天</span>
                  <img src="../../assets/images/jt.png" alt="">
              </div> -->
              </div>
              <div class="minStageDiv">
                 <i v-if='item.name' class="el-icon-plus"  @click='addMixStage(item,index)'/>
              </div>
              <div class="stage-item-div">
                <draggable
                    v-model="item.items"
                    v-bind="min"
                    class="board-column-content"
                    :move="onMove"
                    @end="end"
                    @update="datadragEnd"
                  >
                    <p v-if='minRefresh' v-for="(min,index) in item.items"><i v-if='!min.id' class="el-icon-circle-close-outline" @click="delMinStage(item,min)" />{{min.sortNo}}.{{min.name}}</p>
                  
                  </draggable>
              </div>
              
          </li>
        
        </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DragKanbanDemo',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // list: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
    data() {
    return {
      list: [],
      minRefresh:true,
      curInput:'',
      inpList:{}
    };
  },
  computed: {
    max() {
      return {
        animation: 150,
        group: "max",
         sort:true,
         forceFallback: false,
        // disabled: !this.editable,
      };
    },
    min() {
      return {
        animation: 100,
        group: "min",
        // disabled: !this.editable,
        // ghostClass: "ghost",
       forceFallback: false,
        scroll:true,
        scrollSensitivity:200
      };
    },
  },
  created(){
    this.getData();
  },
  methods: {
    onMove(el){
      let dragged = el.draggedContext.element;
      let draggedNext = el.relatedContext.element;
    },
     datadragEnd (evt) {
        console.log('拖动前的索引 :' + evt.oldIndex)
        console.log('拖动后的索引 :' + evt.newIndex)
        console.log(this.tags)
      },
    end (ev) {
      // debugger
      console.log(ev)
      // if (ev.to.className === 'dragArea11') {
        // this.$set(this.list[ev.oldIndex], 'flag', true)
      // }
      this.updata_sortNo();
    },
    //设置当前大阶段名字
    setMaxStage(item,index){
      this.list[index].name = this.inpList['curInput'+index];
      console.log(this.list)
    },
    //修改当前名字
    editMaxStage(item,index){
      this.inpList['curInput'+index] = this.list[index].name;
      this.list[index].name = '';
    },
    //添加小阶段
    addMixStage(){

    },
    //获取阶段数据
    getData(){
      this.list = [
                { name: '疑似阶段', id: 1 , items:[]},
                { name: '潜在阶段', id: 2 , items:[]},
                { 
                  name: '意向阶段', id: 3,
                  items:[ { name: '设定目标1', id: 15 },
                          { name: '了解背景2', id: 16 },
                          { name: '找到联系人2', id: 17 }
                        ]
                  },
                { 
                    name: '立项阶段', 
                    id: 4 ,
                    items:[ { name: '设定目标', id: 5 },
                            { name: '了解背景', id: 6 },
                            { name: '找到联系人', id: 7 }
                          ]
                },
                {name: '', items:[{ name: '找到联系人2'}]},
                {name: '', items:[]}
            ];
            this.updata_sortNo()
    },
    //更新小阶段排序号
    updata_sortNo(){
      this.minRefresh = false;
      let num = 0;
      this.list.forEach((item)=>{
        if(item.items.length>0){
          item.items.forEach((min)=>{
            num +=1
            min.sortNo = num;
          });
        }
      });
      this.minRefresh = true;
       console.log(this.list)
    },
    //小阶段 删除按钮（只有未提交时的数据才能有删除图标）
    delMinStage(item,min){
      this.delArr(item,min)
    },
    //删除
    delArr(data,delData){
      data.items.forEach((item,index)=>{
        if(item.id == delData.id){
          data.items.splice(index, 1); 
        }
      });
      this.updata_sortNo()
    }
  }
}
</script>
<style>
  .board-column-content{
    min-height: 230px;
  }

</style>
