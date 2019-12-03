<template>
  <div v-if="appPower.length">
    <div v-if="$route.name=='arContentList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">AR拍照内容管理</span>
        <el-button :disabled="!appPower[0].isCheck" style="float:right;" type="primary" @click="$router.push({path:`/application/assetsList/content/2/${$route.params.appId}/createarcontent`,query:{oldQuery:JSON.stringify($route.query)}})">创建内容</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span>
          关键字
          <el-input style="width:150px;" v-model="inputX" maxlength="50"></el-input>
        </span>
        <span>
          类别筛选
          <el-select v-model="typeValue" style="width:150px;">
            <el-option v-for="(item,idx) in typeList" :key="idx" :label="item.moduleName" :value="item.module"></el-option>
          </el-select>
        </span>
        <el-button type="primary" @click="listData">搜索</el-button>
        <el-button type="primary" plain @click="del" :disabled="!appPower[3].isCheck">批量删除</el-button>
      </el-row>
      <el-table ref="arRef" :data="contentTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" :max-height="tableHeight">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="内容名称"></el-table-column>
        <el-table-column prop="materialInfo" label="包含内容"></el-table-column>
        <el-table-column prop="duration" label="总时长"></el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-if="scope.row.state==2" style="color:red;">下架</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="startTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="createBy" label="创建人"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间"></el-table-column>
        <el-table-column prop="updateBy" label="最后修改人"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button :disabled="!appPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:`/application/assetsList/content/2/${$route.params.appId}/createarcontent`,query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button :disabled="scope.row.state==1||!appPower[1].isCheck" type="success" size="mini" @click="up(scope.row.id)">上架</el-button>
            <el-button :disabled="scope.row.state==2||!appPower[1].isCheck" type="danger" size="mini" @click="down(scope.row.id)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import pagination from '../../../share/pagination'
import {getArContentList,upAR,downAR,deleteArContent,getArTypeDropDown} from '../../../http/request'
export default {
  name:'arContentList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      showPagination:false,
      inputX:'',
      typeValue:'',//类别
      typeList:[],//类别列表
      contentTable:[],
      tableHeight:0,
      delArr:[],
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{appPower:'appPower'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('name',this.inputX);
    },
    typeValue(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('type',this.typeValue);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='arContentList'){
        this.listData();
      }
    }
  },
  methods:{
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    dropDown(){
      getArTypeDropDown({"playId":2}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.typeList=res.data;
          this.typeList.unshift({"module":'',"moduleName":'全部'});
        }
      })
    },
    listData(){
      getArContentList({...this.$route.query,"appId":this.$route.params.appId}).then(res=>{
        this.contentTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(){
      if(this.delArr.length>0){
        deleteArContent(this.delArr).then(res=>{
          this.replace('page',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的行');
      }
    },
    up(carrierId){
      upAR({carrierId}).then(res=>{
        this.reload();
      })
    },
    down(carrierId){
      downAR({carrierId}).then(res=>{
        this.reload();
      })
    }
  },
  created(){
    this.dropDown();
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.inputX = this.$route.query.name||'';
    this.typeValue = this.$route.query.type||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='arContentList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.arRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>