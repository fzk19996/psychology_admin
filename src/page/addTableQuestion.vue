<template>
<div class="widthHeight100">
  <el-container>
  <el-main>
    <head-top></head-top>
    <el-row class="row-padding" type="flex" justify="left" align="top" >
      <el-col :span="24">
        <el-row type="flex" justify="left" align="middle" >
          <h2>题目设置：</h2>
        </el-row>
        <table-question :question_id="question_id"></table-question>
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
  import TableQuestion from '../components/TableQuestion';
  import QuestionList from '../components/QuestionList';
  import headTop from '@/components/headTop';
  import {addTable, updateTable, queryTableById} from '@/api/getData'

  export default {
    name: 'SetQuestion',
    data(){
      return {
        title: '',
        expression:'',
        table_id:'',
        question_id:''
      }
    },
    methods: {
      ...mapActions(['setQuestionnaireTitle', 'saveQuestionnaireTemplate', 'clearTemplate', 'getQuestionnaireTemplateById']),
      init() {
        this.bindEvent();
        // 编辑模板
        console.log("addTabeQuestion.vue被加载了")
        if(this.$route.params){
          this.question_id = this.$route.params.question_id
        }
        if(this.$route.query.questionnaireTemplateId) {
          this.getQuestionnaireTemplateById({id: this.$route.query.questionnaireTemplateId}).then(y => {
             this.title = _.cloneDeep(this.QuestionnaireTemplate.template.title);
             this.expression = _.cloneDeep(this.QuestionnaireTemplate.template.expression);
          });
        }else {
          this.title = this.QuestionnaireTemplate.template.title;
          this.expression = this.QuestionnaireTemplate.template.expression;
        }
      },
      activated(){
        console.log('加载了初始化')
      },
      bindEvent() {
      },
      titleInput() {
        this.setQuestionnaireTitle({title: this.title});
      },
      expressionInput(){
        this.setQuestionnaireTitle({expression: this.expression});
      },
      save () {
        if(this.validate()) {
          console.log(this.QuestionnaireTemplate.template)
          addTable(this.QuestionnaireTemplate.template).then((res) => {
            if(res.status!=200){
              this.showError('保存失败');
            }else {
              this.showSuccess('保存成功');
              this.clear();
              // this.$router.replace({path: '/questionList'});
            }
          });
        }
      },
      async query(){
        const res = await queryTableById({"table_id":this.table_id})
        this.QuestionnaireTemplate.template = res.data
        console.log(res)
      },
      async update(){
        const res = await updateTable(this.QuestionnaireTemplate.template)
        if(res.status!=200){
            this.showError('修改失败');
        }else {
            this.showSuccess('修改成功');
            this.clear();
          // this.$router.replace({path: '/questionList'});
        }
      },
      validate() {
        if(this.title === '') return this.showWarning('量表名称不能为空');
        if(this.expression === '') return this.showWarning('量表计算分数表达式不能为空')
        if(this.QuestionnaireTemplate.template.questions.length < 1) return this.showWarning('问卷模板至少包含一个问题');
        this.QuestionnaireTemplate.template.title = this.title
        this.QuestionnaireTemplate.template.expression = this.expression
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
      TableQuestion,
      QuestionList,
      headTop
    },
    computed: {
      ...mapState({
        QuestionnaireTemplate: state => state.QuestionnaireTemplate
      }),
    },
    activated() {
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
