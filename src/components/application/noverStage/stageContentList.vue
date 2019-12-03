<template>
  <div v-if="appPower.length">
    <div v-if="$route.name=='stageContentList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">Nover Stage管理</span>
        <el-button :disabled="!appPower[0].isCheck" style="float:right;" type="primary" @click="showCreateScene=true;">新建场次</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span>
          关键字
          <el-input style="width:150px;" v-model="inputX" maxlength="50"></el-input>
        </span>
        <el-button type="primary" @click="listData">搜索</el-button>
        <el-button type="primary" plain @click="del" :disabled="!appPower[3].isCheck">批量删除</el-button>
      </el-row>
      <el-table ref="stageRef" :data="contentTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" :max-height="tableHeight">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="场景名次"></el-table-column>
        <el-table-column prop="num" label="场景数">
          <template slot-scope="scope">
            {{scope.row.num}}<br/>
            <a href="javascript:void(0);" @click="showScene(scope.row.id)">查看</a>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
          <template slot-scope="scope">
            {{scope.row.startTime?scope.row.startTime.slice(11):''}}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
          <template slot-scope="scope">
            {{scope.row.endTime?scope.row.endTime.slice(11):''}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-if="scope.row.state==2" style="color:red;">下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button :disabled="!appPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createstagecontent`,query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">编辑</el-button>
            <el-button type="success" :disabled="scope.row.state==1||!appPower[1].isCheck" size="mini" @click="up(scope.row.id)">上架</el-button>
            <el-button type="danger" :disabled="scope.row.state==2||!appPower[1].isCheck" size="mini" @click="down(scope.row.id)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
      <el-dialog title="创建场次" :visible.sync="showCreateScene" @close="closeDialog" width="550px" center>
        <el-form ref="form" label-width="120px" :model="form" :rules="rules">
          <el-form-item label="场次名称" prop="sceneName">
            <el-input v-model="form.sceneName" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="场次播放时间" prop="time">
            <el-time-picker
              is-range
              v-model="form.time"
              format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createScene">确 定</el-button>
          <el-button @click="showCreateScene = false">取 消</el-button>
        </span>
      </el-dialog>
      <div v-if="isShowScene">
        <sceneDialog :parentId="clickId" @sceneDialogClose="sceneDialogClose"></sceneDialog>
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
import sceneDialog from './sceneDialog'
import {getStageContentList,upStage,downStage,deleteStageContent,createStageContent} from '../../../http/request'
export default {
  name:'stageContentList',
  inject:['reload','replace'],
  components:{
    pagination,
    sceneDialog
  },
  data(){
    return{
      inputX:'',
      showPagination:false,
      contentTable:[],//列表
      delArr:[],//删除id数组
      showCreateScene:false,//创建场次弹窗
      form:{
        sceneName:'',
        time:null,
      },
      rules:{
        sceneName:[{required: true, message: '请填写场次名称', trigger: 'blur'}],
        time:[{required: true, message: '请选择场次时间', trigger: 'blur'}],
      },
      isShowScene:false,//显示场景数弹窗
      tableHeight:0,
      clickId:'',
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{appPower:'appPower'}),
    createParams(){
      return{
        "name":this.form.sceneName,
        "startTime":this.form.time?this.form.time[0]:'',
        "endTime":this.form.time?this.form.time[1]:'',
        "timeType":2,
        "appId":this.$route.params.appId
      }
    }
  },
  watch:{
    page(){
      if(this.$route.name=='stageContentList'){
        this.replace('page',this.page);
      }
    },
    limit(){
      if(this.$route.name=='stageContentList'){
        this.replace('limit',this.limit);
      }
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('name',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='stageContentList'){
        this.listData();
      }
    },
  },
  methods:{
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    listData(){
      getStageContentList({...this.$route.query,"appId":this.$route.params.appId}).then(res=>{
        this.contentTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(){
      if(this.delArr.length>0){
        deleteStageContent(this.delArr).then(res=>{
          this.replace('page',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的行');
      }
    },
    up(carrierId){
      upStage({carrierId}).then(res=>{
        this.reload();
      })
    },
    down(carrierId){
      downStage({carrierId}).then(res=>{
        this.reload();
      })
    },
    closeDialog(){
      this.form.sceneName='';
      this.form.time=null;
    },
    sceneDialogClose(){
      this.isShowScene=false;
    },
    showScene(id){
      this.clickId = id;
      this.isShowScene = true;
    },
    createScene(){//创建场次
      this.$refs.form.validate((valid) => {
        if (valid) {
          createStageContent(this.createParams).then(res=>{
            this.showCreateScene = false;
            this.reload();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    }
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.inputX = this.$route.query.userName||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='stageContentList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.stageRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>