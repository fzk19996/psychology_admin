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
               <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
                </el-table-column>
                <el-table-column property="tableId" label="量表id">
                </el-table-column>
                <el-table-column property="title" label="量表标题">
                </el-table-column>
                <el-table-column property="question_num" label="题目个数">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.row.tableId)"
                            >编辑</el-button
                        >
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.row.tableId)"
                            >删除</el-button
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

        </div>
    </div>
</template>

<script>
import headTop from "../../components/headTop";
import {queryAllTables, deleteTable} from "@/api/getData";
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
        indexMethod(index){
            return (this.index-1) * this.size + index + 1
        },
        async initData() {
            try {
                this.getTables();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getTables() {
            const Tables = await queryAllTables();
            this.tableData = [];
            Tables.data.forEach((item) => {
                const tableData = {};
                tableData.tableId = item.tableId;
                tableData.title = item.title
                tableData.question_num = item.questionIdList.split(';').length
                this.tableData.push(tableData);
            });

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
          const res = await deleteTable({table_id:id})
          if(res.status==200){
            this.$message({
                type: "success",
                message: res.message,
            });
            this.getTables()
           }else {
                    this.$message({
                        type: "error",
                        message: res.message,
                    });
            }
        },
        handleEdit(table_id) {
            this.$router.push({name:'tableEdit', params:{id:table_id}});
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
