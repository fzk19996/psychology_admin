<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-row>
            <el-col :span=3>
                <el-input v-model="question_id" label="输入题目id"></el-input>
                <el-button @click="mohu_query_question">查询</el-button>
            </el-col>
        </el-row>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
            >
                <!-- <el-table-column type="index" width="100" :index="indexMethod"> </el-table-column> -->
                <el-table-column property="question_id" label="题目id">
                </el-table-column>
                <el-table-column property="question" label="题目内容">
                </el-table-column>
                <el-table-column property="type" label="题目类型">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.row)"
                            >查看题目</el-button
                        >
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.row.question_id)"
                            >删除题目</el-button
                        >
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

                    <!-- <el-form-item label="量表答案" label-width="100px">
                        {{selectTable.table_answer}}
                    </el-form-item>
                    <el-form-item label="实验答案" label-width="100px"> 
                        {{selectTable.experiment_answer}}
                    </el-form-item> -->
                    <el-form-item label="答案下载" label-width="100px">
                        <a >开始下载</a>
                    </el-form-item>
                    <el-form-item label="音频链接" label-width="100px">
                        <a :href="selectTable.video_url" :download="'音频'" style="color:red;margin-left:50px">开始下载</a>
                    </el-form-item>
                    <el-form-item label="填写评论" label-width="100px">
                        <el-input
                            v-model="selectTable.comment"
                            rows="5"
                            style="width:90%"
                            type="textarea"
                        ></el-input>
                    </el-form-item>
                </el-form>
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
import { mohuQueryQuestion, deleteQuestion, queryQuestionList, queryQuestionCount} from "@/api/getData";
import qs from 'qs';
import axios from 'axios';

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
        };
    },
    components: {
        headTop,
    },
    created() {
        this.initData();
    },
    methods: {
        async mohu_query_question(){
          const res = await mohuQueryQuestion(qs.stringify({question_id:this.question_id}))  
          this.count = res.data.length
          this.tableData = []
          res.data.forEach((item) => {
                const tableData = {};
                tableData.question_id = item.questionId;
                tableData.question = item.question
                tableData.type = item.type
                this.tableData.push(tableData);
            });
        },
        indexMethod(index){
            return (this.index-1) * this.size + index + 1
        },
        async initData() {
            try {
                this.getQuestions();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getQuestions() {
            const Count = await(queryQuestionCount());
            this.count = Count.data
            const Tests = await queryQuestionList(qs.stringify({index:this.index, size:this.size}));
            this.tableData = [];
            Tests.data.forEach((item) => {
                const tableData = {};
                tableData.question_id = item.questionId;
                tableData.question = item.question
                tableData.type = item.type
                this.tableData.push(tableData);
            });

        },
        async updateAnswer() {
            this.dialogFormVisible = false;
            try {
                
                const res = await updateAnswer(this.selectTable);
                if (res.status == 200) {
                    this.$message({
                        type: "success",
                        message: res.message,
                    });
                    this.getUsers();
                } else {
                    this.$message({
                        type: "error",
                        message: res.message,
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
        async handleDelete(id) {
          const res = await deleteQuestion(qs.stringify({question_id:id}))
          if(res.status==200){
            this.$message({
                type: "success",
                message: res.message,
            });
            this.getQuestions()
           }else {
                    this.$message({
                        type: "error",
                        message: res.message,
                    });
            }
        },
        handleEdit(row) {
            if(row.type=='单选'||row.type=='多选'){
                this.$router.push({name:'addTableQuestion', params:{question_id:row.question_id}})
            }else{
                this.$router.push({name:'addExperimentQuestion', params:{question_id:row.question_id}})
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
