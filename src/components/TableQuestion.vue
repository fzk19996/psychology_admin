<template>
  <div>
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
          label="填空"
        >填空</el-radio>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <!-- <el-switch
          v-model="question.must"
          on-text="必填"
          off-text="选填"
          off-color="rgb(85, 85, 85)"
        ></el-switch> -->
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="start"
      align="middle"
      class="markSetRow"
    >
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('1')">加载模板1</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('2')">加载模板2</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('3')">加载模板3</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('4')">加载模板4</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('5')">加载模板5</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('6')">加载模板6</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('7')">加载模板7</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('8')">加载模板8</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('9')">加载模板9</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('10')">加载模板10</el-button>
      </el-col>
      <el-col
        :span="3"
        :offset="1"
      >
        <el-button @click="load_template('11')">加载模板11</el-button>
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
      </el-col>
    </el-row>
    <template v-if="question.type=='单选'||question.type=='多选'">
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
          @click="addOption"
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
          @click="removeOption(index)"
        ></el-button>
      </el-col>
     
      <el-col
        :span="14"
        :offset="1"
      >
      </el-col>
    </el-row>
    </template>
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
          @click="addOption"
        ></el-button>
        <el-button
          style="width: 100px"
          @click="save"
        >保存题目</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';
import bus from '../utils/bus';
import { mapActions, mapState } from 'vuex';
import {addQuestion, queryQuestionById, updateQuestion} from '@/api/getData'; 
import qs from 'qs';

export default {
  name: 'TableQuestion',
  props: {
    'question_id':String,
  },
  data () {
    return {
      optionTemplate: {
        content: '',
        score: '',
      },
      questionTemplate: {
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [],
        questionId:''
      },
      questionTemplate1:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '从不',
            score:'1'
          },
          {
            content: '很少',
            score:'2'
          },
          {
            content:'有时',
            score:'3'
          },
          {
            content: '经常',
            score:'4'
          },
          {
            content:'总是',
            score:'5'
          }
        ],
      },
      questionTemplate2:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '从不',
            score:'1'
          },
          {
            content: '很少',
            score:'2'
          },
          {
            content:'有时',
            score:'3'
          },
          {
            content: '经常',
            score:'4'
          }
        ],
      },
      questionTemplate3:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '从不',
            score:'0'
          },
          {
            content: '极少',
            score:'1'
          },
          {
            content:'偶尔',
            score:'2'
          },
          {
            content: '经常',
            score:'3'
          },
          {
            content:'频繁',
            score:'4'
          },
          {
            content:'非常频繁',
            score:'5'
          },
          {
            content:'每天',
            score:'6'
          }
        ],
      },
      questionTemplate4:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '从无',
            score:'1'
          },
          {
            content: '很轻',
            score:'2'
          },
          {
            content:'中等',
            score:'3'
          },
          {
            content: '偏重',
            score:'4'
          },
          {
            content:'严重',
            score:'5'
          }
        ],
      },
      questionTemplate5:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '完全不认同',
            score:'1'
          },
          {
            content: '不太认同',
            score:'2'
          },
          {
            content:'不确定',
            score:'3'
          },
          {
            content: '比较认同',
            score:'4'
          },
          {
            content:'完全认同',
            score:'5'
          }
        ],
      },
     questionTemplate6:{
       questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '完全不符合',
            score:'1'
          },
          {
            content: '不太符合',
            score:'2'
          },
          {
            content:'不确定',
            score:'3'
          },
          {
            content: '比较符合',
            score:'4'
          },
          {
            content:'完全符合',
            score:'5'
          }
        ],
      },
      questionTemplate7:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '从不',
            score:'0'
          },
          {
            content: '很少',
            score:'1'
          },
          {
            content:'有时',
            score:'2'
          },
          {
            content: '经常',
            score:'3'
          },
          {
            content:'总是',
            score:'4'
          }
        ],
      },
      questionTemplate8:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '从不',
            score:'1'
          },
          {
            content: '有时',
            score:'2'
          },
          {
            content:'经常',
            score:'3'
          },
          {
            content: '总是',
            score:'4'
          }
        ],
      },
      questionTemplate9:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '无影响',
            score:'0'
          },
          {
            content: '轻度影响',
            score:'0'
          },
          {
            content:'中度影响',
            score:'0'
          },
          {
            content: '重度影响',
            score:'0'
          },
          {
            content:'极重影响',
            score:'0'
          }
        ],
      },
      questionTemplate10:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '3个月内',
            score:'0'
          },
          {
            content: '半年内',
            score:'0'
          },
          {
            content:'1年内',
            score:'0'
          },
          {
            content: '1年以上',
            score:'0'
          },
        ],
      },
      questionTemplate11:{
        questionId:'',
        type: '单选',
        question: '',
        must: true,  // 是否必填
        options: [
          {
            content: '未发生',
            score:'0'
          },
          {
            content: '1年内发生',
            score:'0'
          },
          {
            content:'更早发生',
            score:'0'
          }
        ],
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
      videoList:[],
      mode: 'insert'
      // question_id:''
    }
  },
  methods: {
    ...mapActions(['setAnswerList', 'unSetAnswerList']),
    init () {
      // this.question_id = this.$route.params.question_id
      console.log('初始化：'+this.question_id)
      if(this.question_id){
          queryQuestionById(qs.stringify({question_id:this.question_id})).then((res) => {
              if(res.status!=200){
                this.showError('读取失败');
              }else {
                this.question = res.data
                this.mode = 'update'
              }
              // this.clear()
        });
      }else{
        this.mode = 'insert'
      }
      console.log(this.question)
      this.bindEvent();
      this.clear(); // 初始化问题和答案
    },
    load_template(index){
      if(index==1)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate1))
      else if(index==2)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate2))
      else if(index==3)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate3))
      else if(index==4)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate4))
      else if(index==5)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate5))
      else if(index==6)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate6))
      else if(index==7)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate7))
      else if(index==8)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate8))
      else if(index==9)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate9))
      else if(index==10)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate10))
      else if(index==11)
        this.question = JSON.parse(JSON.stringify(this.questionTemplate11))
    },
    bindEvent () {
      bus.$on('setQuestion', (index) => {
        this.selectedIndex = index;
        this.question = _.cloneDeep(this.QuestionnaireTemplate.template.questions[index]);
      });

      this.$watch('question.type', y => {
        this.showAnswer = this.question.type === '单选' || this.question.type === '多选';
        this.allowAddReasonDisable = this.question.type !== '单选';
      })
    },
    query(){
      console.log('查询'+this.question_id)
      if(this.question_id){
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

    },
    handlerSubmitPic(response, file, fileList,index){
      if(response){
        if(this.question.options[index].picList=='')
          this.question.options[index].picList += response
        else
        this.question.options[index].picList += ';'+response
      }
    },
    validate() {
      if(this.question.questionId.length==0 || this.question.type.length==0 ){
        this.showError('还没有填完题目')
        return false
      }
      return true
    },
    addOption(){
      this.question.options.push(_.cloneDeep(this.optionTemplate));
    },
    save () {
      if(!this.validate())
        return
      if(this.mode=='update'){
        updateQuestion(this.question).then((res)=>{
          if(res.status!=200){
              this.showError('更新失败');
              this.clear()
            }else {
              this.showSuccess('更新成功');
              this.init()  
            }
        })
      }else if(this.mode=='insert'){
        addQuestion(this.question).then((res) => {
              if(res.status!=200){
                this.showError('保存失败');
              }else {
                this.showSuccess('保存成功');
              }
              this.clear()
        });
      }
    },
    clear () {
      this.question = _.cloneDeep(this.questionTemplate);
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
    removeOption(index){
      this.question.options.splice(index, 1);
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

  // mounted(){
  //   this.init(),
  //   this.query()  
  // },

  activated(){
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
          this.init()
        // }
      }
    }
  
}
</script>

<style>
</style>
