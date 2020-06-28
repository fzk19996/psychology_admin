<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
            >
                <el-table-column type="index" width="100"> </el-table-column>
                <el-table-column property="user_id" label="用户id">
                </el-table-column>
                <el-table-column property="test_id" label="测试id">
                </el-table-column>
                <el-table-column property="create_time" label="提交时间">
                </el-table-column>
                <el-table-column property="state" label="状态">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                            >查看答案</el-button
                        >
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除答案</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <div class="Pagination" style="text-align: left; margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :total="count"
                >
                </el-pagination>
            </div>

            <el-dialog title="修改用户信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">

                    <el-form-item label="量表答案" label-width="100px">
                        {{selectTable.table_answer}}
                    </el-form-item>
                    <el-form-item label="实验答案" label-width="100px"> 
                        {{selectTable.experiment_answer}}
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
import { getAnswerList, updateAnswer } from "@/api/getData";
export default {
    data() {
        return {
            tableData: [],
            currentRow: null,
            count: 0,
            currentPage: 1,
            selectTable: {},
            pageSize:20,
            dialogFormVisible: false,
        };
    },
    components: {
        headTop,
    },
    created() {
        this.initData();
    },
    methods: {
        async initData() {
            try {
                this.getAnswers();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getAnswers() {
            const Answers = await getAnswerList({
                index: parseInt((this.currentPage-1)*this.pageSize),
                size: parseInt(this.pageSize),
            });
            this.tableData = [];
            Answers.data.forEach((item) => {
                const tableData = {};
                tableData.user_id = item.user_id;
                tableData.test_id = item.test_id;
                tableData.create_time = item.create_time;
                tableData.state = item.state
                tableData.table_answer = item.table_answer
                tableData.experiment_answer = item.experiment_answer
                tableData.video_url = item.video_url
                tableData.answer_id = item.answer_id
                tableData.comment = item.comment
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
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getUsers();
        },
        handleDelete(index) {
            this.tableData.splice(index, 1);
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.selectTable = row;
            // this.address.address = row.address;
            // this.selectedCategory = row.category.split("/");
            console.log(this.selectTable)
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
