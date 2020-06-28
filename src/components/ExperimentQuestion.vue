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
          label="按键反应"
        >按键反应</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="根据要求说出词语"
        >根据要求说出词语</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="朗读"
        >朗读</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="看图回答问题"
        >看图回答问题</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="根据提问回答问题"
        >根据提问回答问题</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="记忆测验"
        >记忆测验</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="量表填写"
        >量表填写</el-radio>
    
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
          v-if="question.type=='看图回答问题'"
        >
         <el-button>上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-upload>
      </el-col>
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
      <el-button
          icon="plus"
          class="addLable"
          @click="addAnswer"
        ></el-button>
        <el-button
          style="width: 100px"
          @click="save"
        >保存题目</el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          style="width: 100px"
          @click="clear"
        >清空题目</el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          style="width: 100px"
          @click="remove"
        >删除题目</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
import bus from '../utils/bus';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ExperimentQuestione',
  data () {
    return {
      answerTemplate: {
        content: '',
      },
      questionTemplate: {
        type: '',
        question: '',
        options: [],
        pic_url:''
      },
      question: {},
      selectedIndex: -1,
      showAnswer: true, // 是否可以设置答案
      allowAddReasonDisable: false, // 是否可以设置附加答案
      isEditTitle: false,
      uploadUrl: "",//你要上传视频到你后台的地址
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      fileList:[],
      videoList:[]
    }
  },
  methods: {
    ...mapActions(['setAnswerList', 'unSetAnswerList']),
    init () {
      this.bindEvent();
      this.clear(); // 初始化问题和答案
    },
    bindEvent () {
      // bus.$on('setQuestion', (index) => {
      //   this.selectedIndex = index;
      //   this.question = _.cloneDeep(this.QuestionnaireTemplate.template.topic[index]);
      // });

      this.$watch('question.type', y => {
        
      })
    },
    handlerSubmitPic(response, file, fileList){
      if(response){
        this.question.pic_url = response
      }
    },
    addAnswer () {
      console.log(this.question)
      this.question.options.push(_.cloneDeep(this.answerTemplate));
    },
    removeAnswer (index) {
      this.question.options.splice(index, 1);
    },
    save () {
      this.setAnswerList({ question: this.question, index: this.selectedIndex });
      this.clear();
    },
    clear () {
      this.question = _.cloneDeep(this.questionTemplate);
      this.question.options.push(_.cloneDeep(this.answerTemplate));
      this.selectedIndex = -1;
      this.fileList = []
      this.videoList = []
    },
    remove () {
      this.unSetAnswerList({ index: this.selectedIndex }).then(y => {
        this.clear()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
      });
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
      }
  },

  created(){
    this.init()
  },

  computed: {
    ...mapState({
      QuestionnaireTemplate: state => state.QuestionnaireTemplate
    }),
  },
  mounted () {
    this.init();
  }
}
</script>

<style>
</style>
