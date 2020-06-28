<template>
<div class="widthHeight100">
  <el-container>
  <el-main>
    <head-top></head-top>
    <el-row class="row-padding" type="flex" justify="space-between" align="middle" >
      <el-col :span="5" justify="centre"><el-input v-model="title" placeholder="请填写实验名称 " @blur="titleInput"></el-input></el-col>
      <el-col :span="5">
        <router-link :to="{ path: 'questionnaire/preview'}">
          <el-button>预览量表</el-button>
        </router-link>
        <el-button @click="save">保存实验</el-button>
      </el-col>
    </el-row>
    <el-row class="row-padding" type="flex" justify="left" align="top" >
      <el-col :span="24">
        <el-row type="flex" justify="left" align="middle" >
          <h2>题目设置：</h2>
        </el-row>
        <experiment-question></experiment-question>
      </el-col>
      <el-col :span="18">
        <el-row type="flex" justify="left" align="middle" >
          <h2>题目列表：</h2>
        </el-row>
        <question-list></question-list>
      </el-col>
    </el-row>
    </el-main>
    <br>
    <br>
</el-container>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ExperimentQuestion from '../components/ExperimentQuestion';
  import QuestionList from '../components/QuestionList';
  import headTop from '@/components/headTop';
  import {addExperiment} from '@/api/getData'

  export default {
    name: 'SetQuestion',
    data(){
      return {
        title: ''
      }
    },
    methods: {
      ...mapActions(['setQuestionnaireTitle', 'saveQuestionnaireTemplate', 'clearTemplate', 'getQuestionnaireTemplateById']),
      init() {
        this.bindEvent();
        // 编辑模板
        if(this.$route.query.questionnaireTemplateId) {
          this.getQuestionnaireTemplateById({id: this.$route.query.questionnaireTemplateId}).then(y => {
            this.title = _.cloneDeep(this.QuestionnaireTemplate.template.title);
          });
        }else {
          this.title = this.QuestionnaireTemplate.template.title;
        }
      },
      bindEvent() {
      },
      titleInput() {
        this.setQuestionnaireTitle({title: this.title});
      },
      save () {
        if(this.validate()) {
          console.log(this.QuestionnaireTemplate.template)
          addExperiment(this.QuestionnaireTemplate.template).then((error) => {
            console.log('res')
            console.log(error)
            if(error){
              this.showError('保存失败');
            }else {
              this.showSuccess('保存成功');
              this.clear();
              // this.$router.replace({path: '/questionList'});
            }
          });
        }
      },
      validate() {
        if(this.title === '') return this.showWarning('实验名称不能为空');
        if(this.QuestionnaireTemplate.template.questions.length < 1) return this.showWarning('实验至少包含一个问题');
        return true
      },
      clear() {
        this.clearTemplate();
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
    components: {
      ExperimentQuestion,
      QuestionList,
      headTop
    },
    computed: {
      ...mapState({
        QuestionnaireTemplate: state => state.QuestionnaireTemplate
      }),
    },
    mounted() {
      this.init();
    }
  }
</script>

<style>
  .row-padding {
    padding-top: 20px;
  }
  .markSetRow {
    padding-bottom: 25px;
  }
  .backNextRow {
    margin-bottom: 10px;
  }
  .widthHeight100 {
    width: 100%;
    height: 100%;
  }
  .el-header, .el-footer {
    background-color: #5CACEE;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #5CACEE;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

</style>
