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
                <el-table-column property="test_id" label="测试id">
                </el-table-column>
                <el-table-column property="title" label="测试名称">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="downloadAnswer(scope.row.test_id)"
                            >下载答案</el-button
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
import { queryTestCnt, queryTestList} from "@/api/getData";
import qs from 'qs';
import axios from 'axios';

export default {
    data() {
        return {
            tableData: [],
            currentRow: null,
            count: 10,
            currentPage: 1,
            selectTable: {},
            pageSize:5,
            dialogFormVisible: false,
            offset: 0, 
        };
    },
    components: {
        headTop,
    },
    created() {
        this.initData();
    },
    methods: {
        downloadAnswer(test_id){
            axios({
                method: 'post',
                url: '/test/downloadAllAnswer',
                data: qs.stringify({
                    test_id:test_id
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: 'blob'
            }).then((res) => {
                console.log(res)
                const link = document.createElement('a')
                let blob = new Blob([res.data],{type: 'application/vnd.ms-excel'});
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob);
                link.setAttribute('download', '答案.xls')
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }).catch(error => {
                // this.$Notice.error({
                // title: '错误',
                // desc: '网络连接错误'
                // })
                console.log(error)
            })
        },

        async initData() {
            try {
                const TestsCnt = await queryTestCnt();
                this.count = TestsCnt.data;
                this.getAnswers();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getAnswers() {
            const Tests = await queryTestList(qs.stringify({index:this.currentPage, limit:this.pageSize}));
            this.tableData = [];
            Tests.data.forEach((item) => {
                const tableData = {};
                tableData.test_id = item.testId;
                tableData.title = item.title
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
            this.offset = (val - 1) * this.pageSize;
            this.getAnswers();
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
