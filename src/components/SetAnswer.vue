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
          label="单选"
        >单选</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="多选"
        >多选</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="问答"
        >问答</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="录音"
        >录音</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="反应"
        >反应</el-radio>
        <el-radio
          class="radio"
          v-model="question.type"
          label="打分"
        >打分</el-radio>
    
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-switch
          v-model="question.must"
          on-text="必填"
          off-text="选填"
          off-color="rgb(85, 85, 85)"
        ></el-switch>
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
          class="upload"
          action="/video/upload"
          :show-file-list="true"
          :on-success="handleVideoSuccess"
          :before-upload="beforeUploadVideo"
          :on-progress="uploadVideoProcess"
          :file-list="videoList"
        >
          <li>上传问题材料</li>
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
        <el-input
          type="textarea"
          :rows="2"
          v-model="answer.score"
          placeholder="请输入分值"
        ></el-input>
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

        <el-upload
          class="upload-demo"
          action="/img/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :on-success='(response, file, fileList)=>handlerSubmitPic(response, file, fileList,index)'
        >
          <el-button>上传图片<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
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
  name: 'SetAnswer',
  data () {
    return {
      answerTemplate: {
        content: '',
        score: '',
        allowAddReasonStatus: false, 
        pictureList: "", //问卷选项图片
        picList:''
      },
      questionTemplate: {
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [],
        videoList:''
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
        this.showAnswer = this.question.type === '单选' || this.question.type === '多选';
        this.allowAddReasonDisable = this.question.type !== '单选';
      })
    },
    handlerSubmitPic(response, file, fileList,index){
      if(response){
        if(this.question.options[index].picList=='')
          this.question.options[index].picList += response
        else
        this.question.options[index].picList += ';'+response
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
      if (this.question.type === '打分' || this.question.type === '问答') {
        this.question = _.omit(this.question, 'options')
      }
      this.question.type === '多选'
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
