<template>
  <div>
    <div v-if="$route.name=='putCreate'">
      <headNav></headNav>
      <div class="pa_body">
          <div class="body-menu">
          <el-row class="tac">
            <el-col :span="24" >
              <el-menu 
              class="el-menu-demo"
              text-color="#333"
              active-text-color="#FF644E"
              router
              :default-active="$route.path"
              >
              <navMenu :menus="menus"></navMenu>
             </el-menu>
            </el-col>
          </el-row>
      </div>
          <div class="body-content">
        <el-main>
           <div  v-if="isCreate"style="height:50px;border-bottom:1px solid #DFDCDC;">
            <span style="font-size:24px;font-weight:bold;color:#614a4d;">添加投放规则</span>
          </div>
          <div v-else style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:15px;">
            <span style="font-size:24px;font-weight:bold;color:#614a4d;">编辑投放规则</span>
          </div>
           <!-- 基础信息 -->
          <el-card class="box-card" style="margin-bottom:15px">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
            <el-button style="float: left; padding: 2px 0;margin-top:5px;" type="text" class="downIcon"></el-button>
          </div>
          <div  class="text item">
           <el-form ref="formSize" :model="formSize" label-width="120px" :rules="rules">
            <el-form-item label="选择应用：" prop="backgroundAppId">
              <el-select v-model="formSize.backgroundAppId" placeholder="请选择" filterable>
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                clearable
                >
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="投放时间：" required prop="startTime">
              <timeSwitch></timeSwitch>
            </el-form-item>
            <el-form-item label="投放位置：" required>
              <el-col :span="3">
                <el-form-item prop="positionX">
                  x：<el-input v-model="formSize.positionX" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="positionY">
                  y：<el-input v-model="formSize.positionY" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="positionZ">
                  z：<el-input v-model="formSize.positionZ" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="投放方向：" required>
              <el-col :span="3">
                <el-form-item prop="relationX">
                  x：<el-input v-model="formSize.relationX" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="relationY">
                  y：<el-input v-model="formSize.relationY" style="width:75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item prop="relationZ">
                  z：<el-input v-model="formSize.relationZ" style="width:75%" ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="使用状态：" prop="state">
               <el-radio v-model="formSize.state" label="1" @change="changeState('1')">启用</el-radio>
               <el-radio v-model="formSize.state" label="2" @change="changeState('2')">禁用</el-radio>
            </el-form-item>
           </el-form>
          </div>
        </el-card>
        <!-- 内容计划 -->
          <el-card class="box-card" style="margin-bottom:15px">
          <div slot="header" class="clearfix">
            <span>内容计划</span>
            <el-button style="float: left; padding: 2px 0;margin-top:5px;" type="text" class="downIcon"></el-button>
          </div>
          <div  class="text item">
           <el-form ref="formSize2" :model="formSize" label-width="120px" :rules="rules">

      
            <el-form-item label="展示规则：" class="labeItem">
              <div>
                <el-radio v-model="formSize.chooseTime" label="1" @change="changeTime('1')">按时间段</el-radio>
                <el-radio v-model="formSize.chooseTime" label="2" @change="changeTime('2')">按天</el-radio>
              </div>
              <div>
                <el-table  :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%;position:relative;padding-bottom:56px;" v-if="formSize.chooseTime=='1'" :key="1">
                  <el-table-column prop="id" label="内容ID" width="120" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="内容名称"  align="center">
                  </el-table-column>
                  <el-table-column label="计划展示时间" width="" align="center" >
                    <template slot-scope="scope">
                      <el-time-picker
                      is-range
                      v-model="scope.row.smallTime"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围"
                      format="HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="smallTimeChange(scope.$index,scope.row)"
                      :clearable="false"
                      
                      
                      >
                    </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="scope.row.state" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" v-if="scope.row.state==1" @click="activeAble(2,scope.$index)">启用</el-button>
                      <el-button type="text" v-if="scope.row.state==2" style="color:red" @click="activeAble(1,scope.$index)">禁用</el-button>
                    </template>
                  </el-table-column>
                   <el-table-column  label="操作" width="150" align="center">
                    <template slot-scope="scope">
                       <el-button type="danger"  @click="del(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table  :data="tableData" ref="multipleTable2" tooltip-effect="dark" style="width: 100%;position:relative;padding-bottom:56px;"  v-if="formSize.chooseTime=='2'" :key="2">
                  <el-table-column prop="id" label="内容ID" width="120" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="内容名称"  align="center">
                  </el-table-column>
                   <el-table-column  label="计划展示时间" width="" align="center" >
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.smallTime"
                        type="daterange"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="smallTimeChange(scope.$index,scope.row)"
                        :clearable="false"
                        >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="scope.row.state" label="状态" width="120" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" v-if="scope.row.state==1" @click="activeAble(2,scope.$index)">启用</el-button>
                      <el-button type="text" v-if="scope.row.state==2" style="color:red" @click="activeAble(1,scope.$index)">禁用</el-button>
                    </template>
                  </el-table-column>
                   <el-table-column  label="操作" width="150" align="center">
                    <template slot-scope="scope">
                       <el-button type="danger"  @click="del(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div align="center" style="position:absolute;bottom:10px;background:#fff;left:50%;transform:translateX(-50%);width:100%">
                <el-button :disabled="!formSize.backgroundAppId" @click="listData();dialogTableVisible = true;" style="width:100%" >+添加</el-button>
              </div>
              </div>
            </el-form-item>
           </el-form>
          </div>
        </el-card>
         <div style="margin-top: 20px">
          <el-button  type="primary" @click="submitForm('formSize')" v-if="isCreate">完成</el-button >
          <el-button v-else type="primary" @click="updateForm('formSize')" >立即修改</el-button>
          <el-button @click="goTo()">取消</el-button>
        </div>
        <el-dialog  :visible.sync="dialogTableVisible" width="50%" tooltip-effect="dark" @selection-change="handleSelectionChange">
           <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0" >
            <span><el-input v-model="wd" placeholder="请输入关键词" style="width: 30%"></el-input></span>
            <router-link tag="a" target="_blank" :to="`/application/assetsList/content/${playId}/${formSize.backgroundAppId}`" :underline="false" class="a-button a-primary">添加新内容</router-link>
            <el-button type="info" icon="el-icon-refresh" @click="listData();"></el-button>
          </el-row>
          <el-table :data="gridData"  @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
              :selectable="(row)=>row.state==1"
              >
            </el-table-column>
            <el-table-column property="id" label="内容ID"  width="120"></el-table-column>
            <el-table-column property="state" label="状态"  width="120">
              <template slot-scope="scope">
              <span v-if="scope.row.state==1">上架</span>
              <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
            </template>
            </el-table-column>
            <el-table-column property="name" label="内容名称" align="left">

            </el-table-column>
          </el-table>
          <div style="margin-top:15px;margin-bottom:15px">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[ 20, 40, 60,80]"
            :page-size="limit"
            layout="total,sizes, prev, pager, next,jumper"
            :total="total?total:0">
            </el-pagination>
          </div>
          <div style="margin-top: 20px">
          <el-button  type="primary" @click="saveGrid()" >完成</el-button >
          <el-button @click="cancelGrid()">取消</el-button>
        </div>
        </el-dialog>
        </el-main>
        </div>
      </div>

    </div>
    <router-view/>
  </div>

</template>

<script>
import navMenu from "@/share/navMenu.vue";
import headNav from "@/share/headNav.vue";
import {mapActions,mapState} from 'vuex';
import timeSwitch from '../../share/timeSwitch'
import singleTime from '../../share/singleTime'
import {inputContentList,inputAppList,inputAdd,inputInfo,inputUpdate} from "../../http/request";
export default {
  name: "putCreate",
  inject:['replace','reload'],
  data() {
    var checkPositonX = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('位置X不能为空'));
      }else if(!/^(-|\+)?\d+$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    };
    var checkPositonY = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('位置Y不能为空'));
      }else if(!/^(-|\+)?\d+$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkPositonZ = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('位置Z不能为空'));
      }else if(!/^(-|\+)?\d+$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkRelationX = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('方向X不能为空'));
      }else if(!/^(-|\+)?\d+$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkRelationY = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('方向Y不能为空'));
      }else if(!/^(-|\+)?\d+$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    var checkRelationZ = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('方向Z不能为空'));
      }else if(!/^(-|\+)?\d+$/.test(value)){
           callback(new Error('只能是正负数字和小数点'));
        }else {
          callback();
        }
    }
    // 
    return {
    isCreate:true,
    tableData:[],//
    gridData:[],//弹出框列表
    multipleSelection:[],//已选择数组
    dialogTableVisible:false,
    options: [],
    wd:'',
    carrierListState:1,
    formSize:{
      name:'',
      backgroundAppId:'',
      state:'2',
      startTime:'',
      endTime:'',
      positionX:'',
      positionY:'',
      positionZ:'',
      relationX:'',
      relationY:'',
      relationZ:'',
      relationCarrierList:[
      ],
      assetId:'21',
      chooseTime:'1',
    },
    playId:1,
    show:'1',
    limit:20,
    page:1,
    total:0,
    rules: {
          backgroundAppId: [
            { required: true, message: '请选择应用', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择使用状态', trigger: 'blur' }
          ],
          positionX: [
            { required: true,validator: checkPositonX,trigger: 'blur'},
          ],
          positionY: [
            { required: true,validator: checkPositonY,trigger: 'blur' }
          ],
          positionZ: [
            { required: true,validator: checkPositonZ,trigger: 'blur' }
          ],
          relationX: [
            { required: true,validator: checkRelationX,trigger: 'blur' }
          ],
          relationY: [
            { required: true,validator: checkRelationY,trigger: 'blur' }
          ],
          relationZ: [
            { required: true,validator: checkRelationZ,trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请投放选择时间', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请投放选择时间', trigger: 'change' }
          ],
        }, 
    };
  },
  created(){
    // console.log(this.$route.query.msg)
     inputAppList({}).then(res=>{
      this.options=res.data
    })
    if(this.$route.query.id){
      this.isCreate=false
      this.formSize.relationId=this.$route.query.id
      inputInfo({id:this.$route.query.id}).then(res=>{
      let currentRow={...res.data,relationCarrierList:res.data.relationCarrierList.map(v=>{v.smallTime=[]; return v})}
      this.formSize = Object.assign(this.formSize, currentRow);
      this.formSize.state=JSON.stringify(this.formSize.state)
      this.tableData=this.formSize.relationCarrierList; 
      this.tableData=this.tableData.map((v,index)=>{
        v.smallTime=[v.startTime,v.endTime]
        v.id=v.carrierId
        return v
      })
      this.tableData.length?this.formSize.chooseTime=JSON.stringify(this.tableData[0].timeType):this.formSize.chooseTime=1
      this.$store.commit('timeSwitch/setValue',[this.formSize.startTime,this.formSize.endTime])
    })
    }else{
      this.$store.commit('timeSwitch/setValue',[])
    }
    this.formSize.assetId=this.$route.query.assetId
    this.getUserPower();
	},

  computed:{
    ...mapState('singleTime',{time:'endTime'}),
    ...mapState('timeSwitch',{timeScope:'value'}),
   	 menus(){
	 	 return this.$route.name=='putCreate'?[]:this.$store.state.navMenu.menus2
   },
   chooseTime(){
     return this.formSize.chooseTime
   },
   appName(){
     return this.formSize.name
   },
   allParams(){
     return{
       page:this.page,
       limit:this.limit,
       appId:this.formSize.backgroundAppId,
       name:this.wd
     }
   },
   backgroundAppId(){
     return this.formSize.backgroundAppId
   },
  },
  methods: {
    ...mapActions('currentUserPower',['getUserPower']),
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    //请求列表数据
    listData(){
      inputContentList(this.allParams).then(res=>{
        
        this.gridData = res.data.items? res.data.items:[];
        this.total= res.data.total;
      });
    },
    handleSizeChange(value){
      this.limit = value;
    },
    handleCurrentChange(value){
      this.page = value;
    },
    cancelGrid(){
      this.dialogTableVisible=false
    },
    saveGrid(){
      this.dialogTableVisible=false;
      this.tableData=this.tableData.concat(this.multipleSelection)
      this.multipleSelection.forEach(v=>{v.effectFrom ='';v.effectTo='';this.formSize.relationCarrierList.push({carrierId:'',startTime:'',endTime:'',state:1,timeType:parseInt(this.formSize.chooseTime)})})
      
    },
    smallTimeChange(index,row){
      this.tableData[index].effectFrom =this.tableData[index].smallTime[0];
      this.tableData[index].effectTo =this.tableData[index].smallTime[1];
      let idx=this.tableData.map(v=>v.id).indexOf(row.id)
      this.formSize.relationCarrierList.splice(index,1,{carrierId:row.id,startTime:row.effectFrom,endTime:row.effectTo,timeType:parseInt(this.formSize.chooseTime),state:row.state})
      if(!this.isHasRepeatTime(this.tableData)){
      this.tableData[index].effectFrom ="";
      this.tableData[index].effectTo ="";
      this.tableData[index].smallTime=null;
      this.formSize.relationCarrierList.splice(index,1,{carrierId:row.id,startTime:'',endTime:'',timeType:parseInt(this.formSize.chooseTime),state:row.state})
      
      }
      
    },
    del(index){
      // console.log(index,'index')
      this.tableData.splice(index,1)
      this.formSize.relationCarrierList.splice(index,1)
    },
    //返回
    goTo(){
      this.$router.push({path:'/putManage/putList',query:JSON.parse(this.$route.query.msg)})
      
    },
    //判断是否有空时间控件
    isTimeEmpty(){
      let isTime=this.formSize.relationCarrierList.filter(v=>v.carrierId=='')
        return isTime.length>0
    },
    //保存
     submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid&&this.formSize.relationCarrierList.length&&!this.isTimeEmpty()) {
            inputAdd(this.formSize).then(res=>{
              res.code?this.$message.error(res.msg):this.goTo()
            })
          }else if(!this.formSize.relationCarrierList.length){
            this.$message.error('请至少选择一个内容计划');
          }else if(this.isTimeEmpty()){
            this.$message.error('有计划时间未填写');
          }
        });
      },
    // updateForm
    updateForm(formName) {
        // console.log(this.isTimeEmpty(),'jiance')
        this.$refs[formName].validate((valid) => {
          if (valid&&this.formSize.relationCarrierList.length&&!this.isTimeEmpty()) {
            inputUpdate(this.formSize).then(res=>{
            res.code?this.$message.error(res.msg):this.goTo()
            })
          }else if(!this.formSize.relationCarrierList.length){
            this.$message.error('请至少选择一个内容计划');
          }else if(this.isTimeEmpty()){
            this.$message.error('有计划时间未填写');
          }
        });
      },
      activeAble(num,index){
        if(num==1){
          this.tableData[index].state =1;
          this.formSize.relationCarrierList[index].state=1
        }else{
          this.tableData[index].state =2;
          this.formSize.relationCarrierList[index].state=2
        }
      },
      //判断一些时间范围是否有重复时间段 返回false则这段时间范围有重叠部分，返回true则没有重叠。
    isHasRepeatTime(data) {
    var startTimeArr = [];
    var endTimeArr = [];
    (data || []).map(function(item) {
      if(!item.effectFrom){item.effectFrom=item.startTime;};
      if(!item.effectTo){item.effectTo=item.endTime;} 
      startTimeArr.push(new Date(item.effectFrom).getTime());
      endTimeArr.push(new Date(item.effectTo).getTime());
    });
    var allStartTime = startTimeArr.sort();
    var allEndTime = endTimeArr.sort();
    for(let i=1;i<startTimeArr.length;i++){
                if (startTimeArr[i] <= endTimeArr[i-1]){
                    this.$message.error('时间有重叠,请重新选择');
                    return false;
                }
            }
            console.log("时间没有重复！");
            return true;
},
changeTime(data){
  if(data == this.formSize.chooseTime&&this.tableData.filter(v=>v.smallTime).length){
      this.$confirm('切换展示规则将清空所有时间设置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.formSize.relationCarrierList=[];
          this.tableData=this.tableData.map((v,index)=>{
            if(this.formSize.chooseTime=='1'){
             v.smallTime=null 
            }else{
             v.smallTime=[]
            }
            v.startTime=''
            v.endTime='';
            return v;
          })
        }).catch(() => {
            if(this.formSize.chooseTime=='1'){
              this.formSize.chooseTime='2'
            }else{
              this.formSize.chooseTime='1'
            }
        });
  }
},

changeState(data){
  // console.log(data,'data')
  let isHasState=this.$route.query.ableLength
  // if(isHasState&&data=='1'){
  //   this.$message.error('不能启动，只能有一条启动数据');
  //   this.formSize.state='2'
  // }else{
  //   this.formSize.state='1'
  // }
}
  },
   watch: {
    page(){
		  this.listData()
    },
    limit(){
      this.listData()
    },
    wd(){
      this.page=1;
      this.listData()
    },
    chooseTime(){
        
    },
    timeScope(){
      this.formSize.startTime=this.timeScope[0]
      this.formSize.endTime=this.timeScope[1]
      
    },
    backgroundAppId(){
      let arr=this.options.filter(v=>v.id==this.formSize.backgroundAppId)
      if(arr.length){
      this.formSize.name=arr[0].name
      this.playId=arr[0].playId
      }
    }
    },
   components: {
    navMenu,
    headNav,
    timeSwitch,
    singleTime
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main{
    padding-top: 10px;
  }
  .pa_body .body-menu{
  position:absolute;
  top:60px;
  left:0;
  bottom:0;
  width:212px;
  /*background-color:#545c64;*/
      }
  .pa_body .body-content{
  position:absolute;
  top:66px;
  left:210px;
  right:0;
  background-color:#fff;
  bottom:0;
  overflow:auto;
  border-left: 1px solid #eeeeee;
  }
.cur{ cursor: pointer;}
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.downIcon{
	width:0;
	height:0;
	border-right:12px solid transparent;
	border-left:12px solid transparent;
	border-top:12px solid #C0C4CC;
}
.upIcon{
	width:0;
  height:0;
	border-right:12px solid transparent;
	border-left:12px solid transparent;
	border-bottom:12px solid #C0C4CC;
}
a.a-primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
}
.a-button {
    text-decoration: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
}
.labeItem:before {
    /* content: '*';
    color: #F56C6C;
    margin-right: 4px;
    position: absolute;
    z-index: 99;
    left: 68px;
    top:590px */
}

</style>
