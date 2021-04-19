<template>
  <div>
    <el-row
      type="flex"
      justify="start"
      align="middle"
      class="markSetRow"
    >
      <el-col
        :span="18"
        :offset="1"
      >
        <el-radio
          class="radio"
          v-model="question.type"
          label="工作记忆模板"
        >工作记忆模板</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="工作记忆模板2"
        >工作记忆模板2</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="奖励按键反应"
        >奖励按键反应</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="惩罚按键反应"
        >惩罚按键反应</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="无反馈按键反应"
        >无反馈按键反应</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="根据要求说出词语"
        >根据要求说出词语</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="看图回答问题"
        >看图回答问题</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="指导语"
        >指导语</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="注视点"
        >注视点</el-radio>
    
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="start"
      align="middle"
      class="markSetRow"
      style="padding-bottom: 30px">
      <el-col
        :span="5"
        :offset="1">
        输入题目id
        <el-input
          placeholder="输入题目id"
          v-model="question.questionId"
        ></el-input>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="start"
      align="middle"
      class="markSetRow"
      style="padding-bottom: 30px"
    >
      <el-col
        :span="13"
        :offset="1"
      >
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入问题"
          v-model="question.question"
        ></el-input>
      </el-col>
      <el-col
        :span="10"
        :offset="4"
      >
      <el-upload
          class="upload-demo"
          action="/img/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :on-success='(response, file, fileList)=>handlerSubmitPic(response, file, fileList)'
          v-if="question.type=='看图回答问题'||question.type=='奖励按键反应'||question.type=='惩罚按键反应'||question.type=='无反馈按键反应'||question.type=='指导语'||question.type=='注视点'||question.type=='根据要求说出词语'||question.type=='工作记忆模板'||question.type=='工作记忆模板2'"
        >
         <el-button>上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-upload>
      <img v-if="question.picUrl" :src="question.picUrl" height="50"></img>
      </el-col>
      <template v-if="question.type=='奖励按键反应'||question.type=='惩罚按键反应'||question.type=='无反馈按键反应'||question.type=='注视点'||question.type=='根据要求说出词语'">
      <el-col
        :span="5"
        :offset="1">
        输入限制时间
        <el-input
          placeholder="输入限制时间"
          v-model="question.timeLimit"
        ></el-input>
      </el-col>
      </template>
      <template v-if="question.type=='奖励按键反应'||question.type=='惩罚按键反应'||question.type=='无反馈按键反应'||question.type=='工作记忆模板'||question.type=='工作记忆模板2'">
        <el-col :span="5" :offset="1">
          输入正确答案
          <el-input
            placeholder="输入正确答案"
            v-model="question.rightAnswer"
          ></el-input>
        </el-col>
      </template>
    </el-row>
    <el-row
      type="flex"
      justify="start"
      align="middle"
      class="markSetRow"
      v-for="(answer, index) in question.options"
      :key="index"
      v-if="question.type=='量表填写'"
    >
      <el-col
        :span="14"
        :offset="1"
      >
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入选项"
          v-model="answer.content"
        ></el-input>
      </el-col>
      <el-col
        :span="14"
        :offset="1"
      >
        <span></span>
      </el-col>
      <el-col
        :span="10"
        :offset="2"
      >
        <el-button
          v-if="index === question.options.length - 1"
          icon="plus"
          class="addLable"
          @click="addAnswer"
        ></el-button>
      </el-col>

        <el-col
        :span="6"
        :offset="1"
      >
       <el-button
          v-if="question.options.length > 1"
          icon="minus"
          class="addLable"
          @click="removeAnswer(index)"
        ></el-button>
      </el-col>
     
      <el-col
        :span="14"
        :offset="1"
      >
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="end"
      align="middle"
      style="padding-top: 30px"
    >
      <el-col
        :span="5"
        :offset="1"
      >
        <!-- <el-input
          placeholder="查询题目id"
          v-model="question_id"
        ></el-input>
        <el-button
          style="width: 100px"
          @click="query"
        >查询</el-button> -->
      <el-button
          style="width: 100px"
          @click="save"
        >保存题目</el-button>
        <el-button
          style="width: 100px"
          @click="update"
        >更新题目</el-button>
      
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
import bus from '../utils/bus';
import { mapActions, mapState } from 'vuex';
import {addQuestion, queryQuestionById, updateQuestion, queryRedisAnswerVO} from '@/api/getData'; 
import qs from 'qs';

export default {
  name: 'ExperimentQuestione',
  props: {
    'question_id':String,
  },
  data () {
    return {
      answerTemplate: {
        content: '',
      },
      questionTemplate: {
        questionId: '',
        type: '',
        question: '',
        options: [],
        picUrl:'',
        timeLimit:'',
        rightAnswer:''
      },
      redisAnswerVO:{},
      question: {},
      selectedIndex: -1,
      showAnswer: true, // 是否可以设置答案
      allowAddReasonDisable: false, // 是否可以设置附加答案
      isEditTitle: false,
      uploadUrl: "",//你要上传视频到你后台的地址
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      fileList:[],
      videoList:[],
      // question_id:''
    }
  },
  methods: {
    ...mapActions(['setAnswerList', 'unSetAnswerList']),
    init () {
      this.bindEvent();
      // this.queryRedisAnswerVO();
      // this.clear(); // 初始化问题和答案
    },
    bindEvent () {
      bus.$on('setQuestion', (index) => {
        this.selectedIndex = index;
        this.question = _.cloneDeep(this.QuestionnaireTemplate.template.questions[index]);
      });

      this.$watch('question.type', y => {
        
      })
    },
    async query_redis_answer(){
      let res = await queryRedisAnswerVO();
      if(res.status==200){
        this.redisAnswerVO = res.data
      }
    },
    handlerSubmitPic(response, file, fileList){
      if(response){
        this.question.picUrl = response
        concole.log(this.question)
      }
    },
    clear (){
      this.question = _.cloneDeep(this.questionTemplate)
    },
    save () {
      if(!this.validate())
        return
      addQuestion(this.question).then((res) => {
            if(res.status!=200){
              this.showError('保存失败');
            }else {
              this.showSuccess('保存成功');
            }
            this.clear()
      });
    },

    validate() {
      if(this.question.questionId.length==0 || this.question.type.length==0 ){
        this.showError('还没有填完题目')
        return false
      }
      return true
    },
   
    beforeUploadVideo (file) {
      const isLt1000M = file.size / 1024 / 1024 < 1000;
      if (['video/mp4'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error('请上传正确的视频格式');
        return false;
      }
      if (!isLt1000M) {
        this.$message.error('上传视频大小不能超过1000MB哦!');
        return false;
      }
      this.isShowUploadVideo = false;
    },
    //进度条
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    query(){
      console.log('查询'+this.question_id)
      if(this.question_id!==undefined){
        queryQuestionById(qs.stringify({question_id:this.question_id})).then((res) => {
            if(res.status!=200){
              this.showError('读取失败');
            }else {
              this.question = res.data
            }
            // this.clear()
      });
      }
    },
    update(){
      updateQuestion(this.question).then((res)=>{
        if(res.status!=200){
          this.showError('更新失败');
          this.clear()
        }else {
          this.showSuccess('更新成功');
          this.clear()
          this.query()
        }
      })
    },
    //上传成功回调
    handleVideoSuccess (res, file) {
      this.isShowUploadVideo = true;
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      console.log(res)
      if(res){
        if(this.question.videoList=='')
          this.question.videoList = res
        else
          this.question.videoList += ';' + res
      }
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
    
    showWarning(message) {
        this.$notify({
          title: '警告',
          message: message,
          type: 'warning'
        });
        return false;
      },
      showError(message) {
        this.$notify.error({
          title: '错误',
          message: message
        });
      },
      showSuccess(message) {
        this.$notify({
          title: '成功',
          message: message,
          type: 'success'
        });
      }
    },

  activated(){
    // this.init(),
    // this.query()
  },
  created(){
    this.init()
  },

  computed: {
    ...mapState({
      QuestionnaireTemplate: state => state.QuestionnaireTemplate
    }),
  },

  watch:{
      question_id(newVal,oldVal){
        // if(newVal){
          console.log('我接收到了！');
          //执行。。。。。。
          this.query()
        // }
      }
    }
}
</script>

<style>
</style>
