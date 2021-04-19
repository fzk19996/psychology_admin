<template>
  <div>
    <el-row type="flex" justify="left" align="middle" class="markSetRow" >
      <el-col :offset="1"> 
        <el-row type="flex">
          <el-col :span="3">
            <el-button @click="turn_page(-1)">上一页</el-button>
          </el-col>
          <el-col :span="3">
            <el-button @click="turn_page(1)">下一页</el-button>
          </el-col>
        </el-row>
        <el-row type="flex" justify="left" align="middle" class="questionListRow" v-for="(item,index) in QuestionnaireTemplate.template.questions" :key="index" v-if="index>=page*10&&index<(page+1)*10">
          <el-col><el-button  @click="selectedRow(index)"  class="questionListText" style="background: aliceblue">问题{{index + 1}}({{item.type}})：{{item.question}}</el-button ></el-col>
        </el-row>
      </el-col>
     
    </el-row>
  </div>
</template>

<script>
  import bus from '../utils/bus';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'QuestionList',
    data(){
      return {
        tagColor: 'gray',
        selectRow: -1,
        page:0
      }
    },
    methods: {
      selectedRow(index) {
        this.selectRow=index;
        bus.$emit('setQuestion', index);
        console.log("点击信号")
      },

      turn_page(index){
        this.page += index
      }
    },
    computed: {
      ...mapState({
        QuestionnaireTemplate: state => state.QuestionnaireTemplate
      }),
    }
  }
</script>

<style>
  .questionListText {
    font-size: 16px;
  }
  .questionListRow {
    padding-bottom: 10px
  }
</style>
