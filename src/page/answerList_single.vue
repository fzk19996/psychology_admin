<template>
    <div class="fillcontain">
        <head-top></head-top>
        <!-- <el-row>
            <el-col :span=3>
                <el-input v-model="question_id" label="输入题目id"></el-input>
                <el-button @click="mohu_query_question">查询</el-button>
            </el-col>
        </el-row> -->
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
            >
                <!-- <el-table-column type="index" width="100" :index="indexMethod"> </el-table-column> -->
                <el-table-column property="answerId" label="答案id">
                </el-table-column>
                <el-table-column property="userId" label="用户id">
                </el-table-column>
                <el-table-column property="testId" label="测试id">
                </el-table-column>
                <el-table-column label="音频链接" >
                    <template slot-scope="scope">
                        <a :href="scope.row.videoUrl" style="color:red" :download="'音频'" class="buttonText">音频下载</a>
                    </template>
                </el-table-column>
                <el-table-column label="编辑结果" >
                    <template slot-scope="scope">
                         <el-button
                            size="mini"
                            @click="handleEdit(scope.row)"
                            >编辑</el-button>
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.row.answerId)"
                            >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="Pagination" style="text-align: left; margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="index"
                    :page-size="size"
                    layout="total, prev, pager, next"
                    :total="count"
                >
                </el-pagination>
            </div>

            <el-dialog title="修改用户信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item>
                        <el-row v-for="(tmp,index) in varNameList">
                            <el-col>
                                变量名：{{varNameList[index]}}
                            </el-col>
                            <el-col>
                                分数值：{{scoreList[index]}}
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="load_muban()">加载模板</el-button>
                    </el-form-item>
                    
                    
                </el-form>
                <mavon-editor v-model="answer.comment"  @imgAdd="imgAdd"/>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="updateAnswer"
                        >确 定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import {getAnswerList, queryAnswerResult, deleteAnswer, updateAnswer} from "@/api/getData";
import qs from 'qs';
import axios from 'axios';
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
    data() {
        return {
            tableData: [],
            currentRow: null,
            count: 0,
            currentPage: 1,
            selectTable: {},
            index:0,
            size:20,
            dialogFormVisible: false,
            count:0,
            question_id:'',
            commentList: [],
            varNameList: [],
            scoreList: [],
            answer: {}
        };
    },
    components: {
        headTop,
        mavonEditor
    },
    created() {
        this.initData();
    },
    methods: {
        load_muban(){
            this.answer.comment += this.selectTable.comment
        },
        imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           formdata.append('file', $file);
           axios({
               url: '/img/upload',
               method: 'post',
               data: formdata,
               headers: { 'Content-Type': 'multipart/form-data' },
           }).then((url) => {
               console.log("上传成功")
               let name = $file.name
                if (name.includes('-')) {
                    name = name.replace(/-/g, '')
                }
                let content = this.answer.comment
                if (content.includes(name)) {
                    let oStr = `(${pos})`
                    // let nStr = `(${url})`
                    let nStr = '('+url.data+')'
                    let index = content.indexOf(oStr)
                    let str = content.replace(oStr, '')
                    let insertStr = (soure, start, newStr) => {
                        return soure.slice(0, start) + newStr + soure.slice(start)
                    }
                    this.answer.comment = insertStr(str, index, nStr)
                }
           })
        },
        indexMethod(index){
            return (this.index-1) * this.size + index + 1
        },
        async initData() {
            try {
                this.getAnswers();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getAnswers() {
            const Answers = await getAnswerList({index:0, size:100});
            this.tableData = [];
            Answers.data.forEach((item) => {
                const tableData = {};
                tableData.answerId = item.answerId;
                tableData.userId = item.userId
                tableData.testId = item.testId
                tableData.videoUrl = item.videoUrl
                tableData.comment = item.comment
                this.tableData.push(tableData);
            });
        },
        async updateAnswer() {
            try {
                this.selectTable.state = "已经审阅"
                const res = await updateAnswer(this.answer);
                if (res.status == 200) {
                    this.$message({
                        type: "success",
                        message: res.data,
                    });
                    this.getAnswers()
                    this.dialogFormVisible = false;
                } else {
                    this.$message({
                        type: "error",
                        message: res.data,
                    });
                }
            } catch (err) {
                console.log("更新用户信息失败", err);
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            // this.index = (val-1)*this.size;
            this.index = val
            this.getQuestions();
        },
        async handleEdit(row) {
            this.answer = row
            console.log(this.ans)
            const res = await queryAnswerResult(qs.stringify({answer_id: row.answerId}))
            if(res.status==200){
                this.scoreList = res.data.scoreList
                this.commentList = res.data.commentList
                this.varNameList = res.data.varNameList
                this.selectTable.comment = ""
                this.commentList.forEach((item) => {
                    this.selectTable.comment += '\n' + item
                });

            }
            this.dialogFormVisible = true
        },

        async handleDelete(id){
            const res = await deleteAnswer(qs.stringify({answer_id: id}))
            if(res.status==200){
                this.$message({
                    type: "success",
                    message: res.data,
                });
                this.getAnswers()
            }else{
                this.$message({
                    type: "error",
                    message: res.data,
                });
            }
        },
    },
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
    padding: 20px;
}
</style>
