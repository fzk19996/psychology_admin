<template>
  <div>
    <head-top></head-top>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="问卷管理" name="first">
        <set-questionnaire></set-questionnaire>
      </el-tab-pane>
      <el-tab-pane label="模板管理" name="second">
        <set-questionnaire-template></set-questionnaire-template>
        <set-advice-template></set-advice-template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import SetQuestionnaire from '../components/SetQuestionnaire';
  import SetQuestionnaireTemplate from '../components/SetQuestionnaireTemplate';
  import headTop from '@/components/headTop';
  import SetAdviceTemplate from '@/components/SetAdviceTemplate'

  export default {
    name: 'QuestionList',
    data(){
      return {
        activeName: 'first',
      }
    },
    methods: {
      handleClick() {

      }
    },
    components: {
      SetQuestionnaire,
      SetQuestionnaireTemplate,
      headTop,
      SetAdviceTemplate,
    }
  }
</script>

<style>

</style>
