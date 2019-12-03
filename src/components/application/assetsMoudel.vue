<template>
  <div>
    <div v-if="$route.name=='assetsMoudel'">
       <div  style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:15px;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{tagValue}}</span>
      </div>
      <div style="margin-top:15px;">
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
            <el-input
              placeholder="输入素材关键字"
              class="input-with-select pl15"
              style="width: 15%"
              v-model="wd"
            ></el-input>
          </span>
          <span>
            类别筛选：
             <el-cascader
            ref="tree"
            v-model="moduleTreeSelect"
            :options="moduleTree"
            :props="props"
            :show-all-levels="false"
            @change="handleChange"
            filterable
            :key="Math.random()"
				   clearable
            >
            </el-cascader>
          </span>
        </el-row>
          <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%"   :max-height="tableHeight"  >
        <el-table-column prop="id" :label="'id'" width="120" align="center" :key="1">
        </el-table-column>
        <el-table-column prop="name" :label="`${tagValue}名称`" width="" align="center" :key="2">
        </el-table-column>
        <el-table-column prop="materialCategoryName" :label="'所属类别'" width="" align="center" :key="3">
        </el-table-column>
        <el-table-column prop="parentIdUrl" :label="`${tagValue}预览`" width="200" align="center" v-if="tagKey==100" :key="4">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >
              <img src="@/assets/play.png" alt="" v-if="!scope.row.play" @click="tableData.forEach(v=>{v.play=false;});scope.row.play=true;;playMusic(scope.row.androidMaterial,scope.row)">
               <img src="@/assets/stop.png" alt="" v-if="scope.row.play" @click="scope.row.play=!scope.row.play;playMusic()">
            </span>
             </template>
        </el-table-column>
        
        <el-table-column  :label="`${tagValue}展示`" width="150" align="center" v-if="tagKey==101||tagKey==103||tagKey==102" :key="5">
            <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/static/${scope.row.webUrl}`" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
        </el-table-column>
         
        <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==105||tagKey==107" :key="6">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/static/${scope.row.webUrl}`" alt=""  style="width:50px;height:50px" v-focus>
              </span>
            </template>
          </el-table-column>
           <el-table-column  :label="`${tagValue}预览`" width="150" align="center" v-if="tagKey==104" :key="7">
           <template slot-scope="scope">
              <a :href="`${scope.row.videoUrl}`" target="_blank">{{scope.row.videoUrl}} </a>
            </template>
          </el-table-column>
        <el-table-column  :label="`占位图展示`" width="200" align="center" v-if="tagKey==102" :key="8">
           <template slot-scope="scope">
              <span style="cursor: pointer;" >
                <img :src="`/static/${scope.row.pictureUrl}`" alt="" style="width:50px;height:50px" v-focus>
              </span>
            </template>
        </el-table-column>
        <el-table-column prop="isLyric" label="是否包含歌词" width="120" align="center" v-if="tagKey==101" :key="9">
          <template slot-scope="scope">
            <span v-if="scope.row.isLyric==1">是</span>
            <span v-if="!scope.row.isLyric" style="color:#FF644E">否</span>
      
          </template>
          </el-table-column>
          <el-table-column  label="资源包大小" width="150" align="center" v-if="tagKey ==100||tagKey ==107" :key="10">
             <template slot-scope="scope">
               {{scope.row.androidResourcePackageSize}}M
            </template>
          </el-table-column>
          <el-table-column  label="安卓资源包大小" width="150" align="center" v-if="tagKey ==101||tagKey ==102||tagKey ==103" :key="11">
             <template slot-scope="scope">
               {{scope.row.androidResourcePackageSize}}M
            </template>
          </el-table-column>
          <el-table-column prop="iosResourcePackageSize" label="IOS资源包大小" width="150" align="center" v-if="tagKey ==101||tagKey ==102||tagKey ==103||tagKey ==105||tagKey ==106" :key="12">
             <template slot-scope="scope">
               {{scope.row.iosResourcePackageSize}}M
            </template>
          </el-table-column>
          <el-table-column prop="durationTimeStr" label="总时长" width align="center" v-if="tagKey==100||tagKey==101||tagKey ==105||tagKey ==106||tagKey ==107" :key="13"></el-table-column>
          <el-table-column prop="state" label="状态" width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.state==1">上架</span>
                <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width align="center" :key="14"></el-table-column>
          <el-table-column prop="createUser" label="创建人" width="120" align="center" :key="15"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width align="center" :key="16"></el-table-column>
          <el-table-column prop="updateUser" label="最后修改人" width="120" align="center" :key="17"></el-table-column>
        </el-table>
        <div>
         <audio :src="url" autoplay="autoplay" ref="audio"></audio>
        </div>
		<div style="margin-top:15px;margin-bottom:15px">
       <pagination v-if="showPagination"></pagination>
       </div>
    <!-- <el-table :data="tableData2" ref="multipleTable2" tooltip-effect="dark" style="width: 100%"   :max-height="0" >
    </el-table> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {applicationToTree,getFile} from "../../http/request";
import pagination from '../../share/pagination'
export default {
  name: "assetsMoudel",
  inject:['replace','reload'],
  data(){
	  return{
      moduleDetail:[],//素材种类
      moduleTree:[],//模块分类
      wd:'',
      showPagination:false,
      tagValue:'',
      tagKey:'',
      url:'',
      appId:'',
      moduleTreeVal:'',
      moduleTreeSelect:[],
     props: {
        label: "name",
        children: 'children',
        value:'id',
        checkStrictly: true,
        expandTrigger:'hover'
    },
    tableHeight:0,
    tableData:[]
	  }
  },
  created(){
  let query=this.$route.query
  let pageRecord = query.page;//记录上一次页码操作
  let limitRecord = query.limit;//记录上一次limit操作
  this.wd=query.wd?query.wd:'';
  this.moduleTreeVal=query.moduleTreeVal?parseInt(query.moduleTreeVal):'';
  this.appId=parseInt(this.$route.params.appId)
  this.tagKey=parseInt(this.$route.params.moudle)
  switch (this.tagKey) {

    case 100:
      this.tagValue='音乐'
      break;
    case 101:
      this.tagValue='动画'
      break;
    case 102:
      this.tagValue='场景模型'
      break;
    case 104:
      this.tagValue='在线视频'
      break;
    case 105:
      this.tagValue='抠像视频'
      break;
    case 106:
      this.tagValue='游戏交互'
      break;
    case 107:
      this.tagValue='MP4'
      break;
    default:
      break;
  }
    this.initListModule({...this.$route.query,module:this.tagKey,appId:this.appId}).then(res=>{

    if(res.data.items !=null){
      let app=res.data.items.map(v => {
      v.play=false;
      v.webUrl = Base64.decode(v.pic)
      if(v.placeholderPictureUrl){
        v.pictureUrl = Base64.decode(v.placeholderPictureUrl)
      }
      return v
    })
    this.tableData=JSON.parse(JSON.stringify(app))
    }
    
		this.$store.commit('pagination/setTotal',this.total);
		})
  this.$nextTick(()=>{
  this.moduleTreeSelect=query.moduleTreeSelect?JSON.parse(query.moduleTreeSelect):[]
  this.$store.commit('pagination/setClickPage',pageRecord);
  this.$store.commit('pagination/setLimitPage',limitRecord);
  this.showPagination = true;//加载分页组件
  })
  },
  computed:{
	...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  ...mapState('assetsMoudel',{total:'total3'}),
  },
  methods:{
	  ...mapActions('assetsMoudel',['initListModule']),
      playMusic(id,row){
          id?(()=>{
              this.url=`/static/${Base64.decode(id)}`;
              this.$refs.audio.load();
              this.$refs.audio.play();
              this.$refs.audio.onended=function () {
                row.play=!row.play;
              }
              })():(()=>{
                this.$refs.audio.pause();
              })();
        },
      handleChange(value){
        this.moduleTreeVal=value[value.length-1]
      },
  },
  watch:{
	page(){
		this.replace("page",this.page);
    },
  limit(){
      this.replace('limit',this.limit);
  },
  wd(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('wd',this.wd);
  },
  moduleTreeVal(){
    this.$store.commit('pagination/setClickPage',1);
    this.replace('moduleTreeVal',this.moduleTreeVal);
  },
  moduleTreeSelect(){
    let apple =JSON.stringify(this.moduleTreeSelect);
    this.replace('moduleTreeSelect',apple);
  },
  tagKey(){
    //  this.moduleTreeVal=''
    //  this.moduleTreeSelect=[]
     applicationToTree({moduleId:this.tagKey}).then(res=>{
      this.moduleTree=res.data?res.data:[]
      this.moduleTree.push({id: "",name:"全部"})
    })
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout();
    });
  },

  $route(){//判断路由query变化执行请求
   
    if(this.$route.name=='assetsMoudel'){
     this.reload()
    this.appId=parseInt(this.$route.params.appId)
    this.tagKey=parseInt(this.$route.params.moudle)
    switch (this.tagKey) {
    case 100:
      this.tagValue='音乐'
      break;
    case 101:
      this.tagValue='动画'
      break;
    case 102:
      this.tagValue='场景模型'
      break;
    case 104:
      this.tagValue='在线视频'
      break;
    case 105:
      this.tagValue='抠像视频'
      break;
    case 106:
      this.tagValue='游戏交互'
      break;
    case 107:
      this.tagValue='MP4'
      break;
    default:
      break;
  } 
    this.moduleTreeSelect=this.$route.query.moduleTreeSelect?JSON.parse(this.$route.query.moduleTreeSelect):[]
		this.initListModule({...this.$route.query,module:this.tagKey,appId:this.appId}).then(res=>{
   
    if(res.data.items !=null){
      let app=res.data.items.map(v => {
      v.webUrl = Base64.decode(v.pic)
      v.play=false;
      if(v.placeholderPictureUrl){
        v.pictureUrl = Base64.decode(v.placeholderPictureUrl)
      }
      return v;
    })
    this.tableData=JSON.parse(JSON.stringify(app))
    }
    this.$store.commit('pagination/setTotal',this.total);
		})
      }
    }
  },
   updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
    })
  },
  components: {
    pagination
  }
};
</script>

<style scoped>
.tac span {
  font-size:14px;
  color:#606266;
  padding-left: 5px;
  padding-right: 10px;
}
.el-tag{
  margin-right: 10px;cursor: pointer;
}
</style>