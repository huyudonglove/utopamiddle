<template>
  <div v-if="userPower.length">
    <div v-if="$route.name=='userList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户列表</span>
        <el-button :disabled="!userPower[0].isCheck" style="float:right;" type="primary" @click="$router.push({path:'/system/userlist/createuser',query:{oldQuery:JSON.stringify($route.query)}})">添加用户</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span>
          关键字
          <el-input style="width:150px;" v-model="inputX" maxlength="50"></el-input>
        </span>
        <el-button type="primary" @click="listData">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button type="primary" plain @click="del" :disabled="!userPower[3].isCheck">批量删除</el-button>
      </el-row>
      <el-table ref="userRef" :data="userTable" border style="width: 100%" class="mt15 mb15" @selection-change="handleSelectionChange" :max-height="tableHeight">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="userName" label="用户名称"></el-table-column>
        <el-table-column prop="email" label="邮箱账号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">在职</span>
            <span v-if="scope.row.status===2">离职</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button :disabled="!userPower[1].isCheck" type="primary" size="mini" @click="$router.push({path:'/system/userlist/createuser',query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">修改</el-button>
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
import pagination from '../../share/pagination'
import {getUserList,deleteUser} from '../../http/request'
export default {
  name:'userList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      userTable:[],
      showPagination:false,
      delArr:[],
      tableHeight:0,
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
    ...mapState('currentUserPower',{userPower:'userPower'}),
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
      this.replace('userName',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='userList'){
        this.listData();
      }
    }
  },
  methods:{
    handleSelectionChange(arr){
      this.delArr = arr.length?arr.map(v=>v.id):[];
    },
    del(){
      if(this.delArr.length>0){
        deleteUser({"ids":this.delArr}).then(res=>{
          this.replace('page',1);
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要删除的用户');
      }  
    },
    reset(){
      this.replace('reset');
      this.inputX='';
    },
    listData(){
      getUserList(this.$route.query).then(res=>{
        this.userTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
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
    if(this.$route.name=='userList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>