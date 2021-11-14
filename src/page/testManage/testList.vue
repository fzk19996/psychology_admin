<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
            >
                <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
                </el-table-column>
                <el-table-column property="test_id" label="测试id">
                </el-table-column>
                <el-table-column property="title" label="测试标题">
                </el-table-column>
                <el-table-column property="question_num" label="题目个数">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.row.test_id)"
                            >编辑</el-button
                        >
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.row.test_id)"
                            >删除</el-button
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

        </div>
    </div>
</template>

<script>
import headTop from "../../components/headTop";
import {queryTestList, queryTestCnt} from "@/api/getData";
import qs from 'qs';

export default {
    data() {
        return {
            tableData: [],
            currentRow: null,
            count: 0,
            currentPage: 1,
            pageSize:5,
            selectTable: {},
            dialogFormVisible: false,
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
        indexMethod(index){
            return (this.index-1) * this.size + index + 1
        },
        async initData() {
            try {
                const TestsCnt = await queryTestCnt();
                this.count = TestsCnt.data;
                this.getTests();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getTests() {
            const Tests = await queryTestList(qs.stringify({index:this.currentPage, limit:this.pageSize}));
            this.tableData = [];
            Tests.data.forEach((item) => {
                const tableData = {};
                tableData.test_id = item.testId;
                tableData.title = item.title
                this.tableData.push(tableData);
            });

        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTests();
        },
        handleDelete(index) {
            this.tableData.splice(index, 1);
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.selectTable = row;
        },
    },
};
</script>

<style lang="less">
@import "../../style/mixin";
.table_container {
    padding: 20px;
}
</style>
