<template>
    <div v-if="appPower.length">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">应用列表</span>
        <el-button style="float:right;" type="primary" @click="goTo('create')" :disabled="!appPower[0].isCheck">创建应用</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">

        <span>应用名称<el-input style="width:150px;"  placeholder="请输入内容" v-model="appName"></el-input></span>
        <span>
          应用类型
          <el-select  v-model="relateApplicationId" style="width:150px;height:30px;">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item.name" :value="item.id" v-for="item in appId" :key="item.id"></el-option>
          </el-select>
        </span>
        <span>
          状态
          <el-select  v-model="type" style="width:150px;height:30px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </span>
        <el-button type="primary">查询</el-button>
        <el-button type="info" @click="replace('reset');reload();">清空</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" :max-height="tableHeight" ref="arRef" border>
        <el-table-column fixed prop="id" label="ID" width="200">
        </el-table-column>
        <el-table-column prop="name" label="应用名称" width="200">
        </el-table-column>
        <el-table-column prop="relateApplicationId" label="应用类型" width="120">
          <template slot-scope="scope">
            {{appId.length?appId.find(v=>v.id==scope.row.relateApplicationId)?appId.find(v=>v.id==scope.row.relateApplicationId).name:'':''}}
          </template>
        </el-table-column>
        <el-table-column prop="position" label="位置" >
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            {{scope.row.status?'禁用':'启用'}}
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="最新保存时间" width="160">
        </el-table-column>
        <el-table-column prop="modifyBy" label="更新人" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button  type="text" size="small" @click="goTo('watch',scope.row.id)">查看</el-button>
            <el-button type="text" size="small"  @click="goTo('revise',scope.row.id)" :disabled="!appPower[1].isCheck">编辑</el-button>
            <el-button type="text" size="small"  @click="deleteApp(scope.row.id)" :disabled="!appPower[3].isCheck">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="showPagination"></pagination>
    </div>
</template>

<script>
  import pagination   from '../../share/pagination'
  import {getAppList,deleteApp,getAppId} from "../../http/request";
  import {mapState} from 'vuex'
  export default {
        name: "applicationList",
        components:{
          pagination
        },
        inject:['replace','reload'],
        computed:{
          ...mapState('pagination',['clickPage','limitPage']),
          ...mapState('currentUserPower',['appPower'])
        },
        data(){
          return{
            tableData: [],
            showPagination:true,
            playType:'',
            type:'',
            appName:'',
            tableHeight:0,
            appId:[],
            relateApplicationId:''
          }
        },
        methods:{
          getList(){
            let msg={
              pageIndex:this.$route.query.clickPage||1,
              pageSize:this.$route.query.limitPage||20,
              containName:this.$route.query.appName ||'',
              id:'',
              relateApplicationId:this.$route.query.relateApplicationId||'',
              status:this.$route.query.type||''
            }
            //console.log(msg,999)
            getAppList(msg).then(res=>{
              this.$store.commit('pagination/setTotal',res.data.total);
              this.tableData=res.data.items;
            });
          },
          goTo(type,id){
            this.$router.push({
              path:'/app/createApplication',
              query:{
                msg:JSON.stringify(this.$route.query),
                type:type,
                id:id
              }
            })
          },
          deleteApp(id){
              deleteApp(id).then(v=>{
                this.getList();
              })
          },
          getAppId(){
            getAppId().then(res=>{
              res.code?this.$message.error(res.msg):this.appId=res.data;

            })
          }
        },
        watch:{
          clickPage(){
            this.replace('clickPage',this.clickPage);
          },
          limitPage(){
            this.replace('limitPage',this.limitPage);
          },
          appName(){
            this.$store.commit('pagination/setClickPage',1);
            this.replace('appName',this.appName);
          },
          playType(){
            this.replace('playType',this.playType);
          },
          type(){
            this.$store.commit('pagination/setClickPage',1);
            this.replace('type',this.type);
          },
          relateApplicationId(){
            this.$store.commit('pagination/setClickPage',1);
            this.replace('relateApplicationId',this.relateApplicationId)
          },
          $route(){
            //监听路由变化，请求接口
            if(this.$route.name=='applicationList'){
              this.getList();
            }
            //console.log(111)
          }
        },
        created() {
          //请求接口，初始页面
          let pageRecord = this.$route.query.clickPage||1;//记录上一次页码操作
          let limitRecord = this.$route.query.limitPage||20;//记录上一次limit操作
          // this.title=this.$route.query.title?this.$route.query.title:'';
          // this.select=this.$route.query.select?this.$route.query.select:'';
          let typeRecord=this.$route.query.type||'';
          this.appName=this.$route.query.appName||'';
          this.relateApplicationId=this.$route.query.relateApplicationId||'';
          this.$nextTick(()=>{
            this.$store.commit('pagination/setLimitPage',limitRecord);
            this.$store.commit('pagination/setClickPage',pageRecord);
            this.type=typeRecord+'';
            this.showPagination = true;//加载分页组件
            this.getList();
            this.getAppId();
          })
          console.log(this.appPower,77)
        },
      updated() {
        if(this.$route.name=='applicationList'){
          this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.arRef.$el.offsetTop - 110;
          })
        }
      }
  }
</script>

<style scoped>

</style>
