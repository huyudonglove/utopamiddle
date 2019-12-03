<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="!$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/新增场景/新增节目</span>
      <span v-if="$route.query.sceneId" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑场次/编辑场景/新增节目</span>
    </div>
    <el-form label-position="right" label-width="150px" style="width: 100%">
      <el-form-item label="节目名称">
        <el-input type="text" v-model="programName" style="width:200px;" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="播放时间">
        <el-time-picker
          is-range
          v-model="programTime"
          format="HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="选择动画">
        <div>
          <el-row class="tac" style="padding-bottom:15px">
            <el-input placeholder="请输入名称" class="input-with-select" v-model="animationName" style="width: 20%;" maxlength="50">
              <el-button slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </el-row>
          <el-table ref="programTable" :data="ainimationList" border style="width: 100%" class="mt15 mb15"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" :selectable="(row)=>row.state==1"></el-table-column>
            <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
            <el-table-column prop="name" label="动画名称" align="center"></el-table-column>
            <el-table-column prop="materialCategoryName" label="所属类别" align="center"></el-table-column>
            <el-table-column prop="isLyric" label="是否配置歌词" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isLyric==1">是</span>
                <span v-if="scope.row.isLyric==0">否</span>
              </template>
            </el-table-column>
            <el-table-column prop="androidResourcePackageSize" label="安卓资源包大小(M)" align="center">
              <template slot-scope="scope">
                {{scope.row.androidResourcePackageSize?((scope.row.androidResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小(M)" align="center">
              <template slot-scope="scope">
                {{scope.row.iosResourcePackageSize?((scope.row.iosResourcePackageSize/(1024*1024))+'').slice(0,4):''}}
              </template>
            </el-table-column>
            <el-table-column prop="durationTimeStr" label="总时长" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
            <el-table-column label="上下架状态" prop="state">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2" style="color:red;">下架</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <div>
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
          </div> -->
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="$router.push({path:`/application/assetsList/content/1/${$route.params.appId}/createscene`,query:{id:$route.query.id,sceneId:$route.query.sceneId,sceneName:$route.query.sceneName,sceneTime:$route.query.sceneTime,selectModel:$route.query.selectModel,selectMusic:$route.query.selectMusic,selectProgramList:selectProgramList.length?JSON.stringify(selectProgramList):null,oldQuery:$route.query.oldQuery}})">取 消</el-button>
    </span>
  </div>
</template>

<script>
import {getMaterialList} from '../../../http/request'
export default {
  name:'createProgram',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      programName:'',
      animationName:'',
      ainimationList:[],
      total:0,//总行数
      page:1,//页码
      limit:20,//一页行数
      selectProgram:null,
      selectProgramList:[],
      programTime:null,
      currentProgram:null
    }
  },
  computed:{
    allParams(){
      return{
        "name":this.animationName,
        // "page":this.page,
        // "limit":this.limit,
        "appId":this.$route.params.appId,
        "module":'101'
      }
    }
  },
  watch:{
    // async page(){
    //   await this.listData();
    //   if(this.currentProgram){
    //     let row = this.ainimationList.find(v=>v.id==this.currentProgram.materialId);
    //     if(row){
    //       this.$nextTick(()=>{
    //         this.$refs.programTable.toggleRowSelection(row,true);
    //       })
    //     }
    //   }
    // },
    // async limit(){
    //   if(this.page!=1){
    //     this.page=1;
    //   }
    //   await this.listData();
    //   if(this.currentProgram){
    //     let row = this.ainimationList.find(v=>v.id==this.currentProgram.materialId);
    //     if(row){
    //       this.$nextTick(()=>{
    //         this.$refs.programTable.toggleRowSelection(row,true);
    //       })
    //     }
    //   }
    // },
    async animationName(){
      if(this.page!=1){
        this.page=1;
      }
      await this.listData();
      if(this.currentProgram&&this.ainimationList.length){
        let row = this.ainimationList.find(v=>v.id==this.currentProgram.materialId);
        if(row){
          this.$nextTick(()=>{
            this.$refs.programTable.toggleRowSelection(row,true);
          })
        }
      }
    }
  },
  methods:{
    handleSizeChange(val){
      this.limit = val;
    },
    handleCurrentChange(val){
      this.page = val;
    },
    handleSelectionChange(arr){
      if(arr.length>1){
        this.$refs.programTable.toggleRowSelection(arr[0],false);
        arr.splice(0,1);
        
      }else if(arr.length==0){
        this.selectProgram=null;
        return;
      }
      this.selectProgram=arr[0];
    },
    listData(){
      return new Promise((resolve,reject)=>{
        getMaterialList(this.allParams).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            if(res.data&&res.data.length){
              this.ainimationList =res.data;
              // this.total= res.data.total;
            }
            resolve();
          }
        }).catch(err=>{
          reject(err);
        })
      })
    },
    confirm(){
      if(this.programName===''){
        this.$message.error('请输入节目名称');
        return;
      }
      if(!this.programTime){
        this.$message.error('请输入选择时间');
        return;
      }
      if(!this.selectProgram){
        this.$message.error('请勾选动画');
        return;
      }
      this.selectProgram.programName=this.programName;
      this.selectProgram.startTime=this.programTime[0];
      this.selectProgram.endTime=this.programTime[1];
      let time1 = new Date(`2019/01/01 ${this.programTime[0].slice(11)}`);
      let time2 = new Date(`2019/01/01 ${this.programTime[1].slice(11)}`);
      let sceneStartTime = new Date(`2019/01/01 ${JSON.parse(this.$route.query.sceneTime)[0].slice(11)}`);
      let sceneEndTime = new Date(`2019/01/01 ${JSON.parse(this.$route.query.sceneTime)[1].slice(11)}`);
      console.log(sceneStartTime,sceneEndTime)
      if(time1-sceneStartTime<0||time2-sceneEndTime>0){
        this.$message.error('节目时间必须在场景时间内');
        return;
      }
      if(this.selectProgramList.length){
        let programClashList = [];
        let tableData=JSON.parse(JSON.stringify(this.selectProgramList));
        if(this.isEdit){
          console.log(this.currentProgram.currentIndex,151)
          tableData.splice(this.currentProgram.currentIndex,1);
          console.log(tableData)
        }
        programClashList = tableData.filter(v=>{
          let programStartTime = new Date(`2019/01/01 ${v.startTime.slice(11)}`);
          let programEndTime = new Date(`2019/01/01 ${v.endTime.slice(11)}`);
          return (time1-programStartTime<0&&time2-programStartTime>0)||(time1-programEndTime<0&&time2-programEndTime>0)||(time1-programStartTime>=0&&time2-programEndTime<=0&&time2-time1>0)||(time1-programStartTime<=0&&time2-programEndTime>=0);
        });
        if(programClashList.length){
          this.$message.error(`节目时间与‘${programClashList.map(v=>v.programName).join('、')}’等节目有重叠`);
          return;
        }
      }
      //计算时间差
      let timeScope = (time2-time1)/1000;
      let hour = Math.floor(timeScope / 3600);
      hour = hour/10>1?hour:'0'+hour;
      let minute = Math.floor( (timeScope - hour*3600) /60 );
      minute = minute/10>1?minute:'0'+minute;
      let second = (timeScope - hour*3600 - minute*60);
      second = second/10>1?second:'0'+second;
      let duration = hour+':'+minute+':'+second;
      this.selectProgram.duration = duration;
      this.selectProgram.materialName = this.selectProgram.name;
      this.selectProgram.materialId = this.selectProgram.id;
      this.selectProgram.musicId = (new Date()).valueOf();
      if(this.isEdit){
        this.selectProgramList.splice(this.currentProgram.currentIndex,1,this.selectProgram);
      }else{
        this.selectProgramList.push(this.selectProgram);
      }
      
      this.$router.push({path:`/application/assetsList/content/1/${this.$route.params.appId}/createscene`,query:{id:this.$route.query.id,sceneId:this.$route.query.sceneId,sceneName:this.$route.query.sceneName,sceneTime:this.$route.query.sceneTime,selectModel:this.$route.query.selectModel,selectProgramList:JSON.stringify(this.selectProgramList),selectMusic:this.$route.query.selectMusic,oldQuery:this.$route.query.oldQuery}});
      this.reload();
    }
  },
  async created(){
    if(this.$route.query.selectProgramList){
      this.selectProgramList= JSON.parse(this.$route.query.selectProgramList);
    }
    await this.listData();
    if(this.$route.query.currentProgram){
      this.currentProgram = JSON.parse(this.$route.query.currentProgram);
      this.programName = this.currentProgram.programName;
      this.programTime = [this.currentProgram.startTime,this.currentProgram.endTime];
      let row = this.ainimationList.length?this.ainimationList.find(v=>v.id==this.currentProgram.materialId):false;
      if(row){
        this.$nextTick(()=>{
          this.$refs.programTable.toggleRowSelection(row,true);
        })
      }
      this.isEdit=true;
    }else{
      this.isCreate=true;
    }
  }
}
</script>

<style scoped>

</style>