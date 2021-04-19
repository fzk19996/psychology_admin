<template>
    <div class="fillcontain">
        <head-top></head-top>
            <div>
                <el-form>
                    <el-form-item label="测试id" label-width="100px">
                                <el-input
                                    v-model="test_id"
                                    placeholder="填写测试id"
                                ></el-input>
                                <el-button type="primary" @click="click_query"
                                >查询</el-button>
                                <el-button type="primary" @click="handleInsert"
                                >添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
            >
                <el-table-column type="index" width="100"> </el-table-column>
                <el-table-column property="testId" label="测试id">
                </el-table-column>
                <el-table-column property="userId" label="用户Id">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.row.testGroupId)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="index"
                  :page-size="size"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>

            <el-dialog title="添加测试用户组" v-model="dialogFormVisible">
                <el-form >
                    <el-form-item label="用户id" label-width="100px">
                        <el-input
                            v-model="formData.user_id"
                            placeholder="用户输入用户id"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="测试id" label-width="100px">
                        <el-input
                            v-model="formData.test_id"
                            placeholder="用户输入测试id"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="formData = {}; dialogFormVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="submitTestGroups"
                        >确 定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import { insertTestGroup, insertTestGroups, deleteTestGroup, queryTestGroupsByTestId, queryTestListByUserId, queryTestGroupList, queryTestGroupCount} from "@/api/getData";
import qs from 'qs';
import axios from 'axios';

export default {
    data() {
        return {
            tableData: [],
            formData: {},
            currentRow: null,
            count: 0,
            index:0,
            size:20,
            dialogFormVisible: false,
            test_id:''
        };
    },
    components: {
        headTop,
    },
    created() {
        this.initData()
    },
    methods: {
        async initData(){
            const countData = await queryTestGroupCount();
            if (countData.status == 200) {
                this.count = countData.data;
            }else{
                console.log('获取数据失败');
            }
            this.getTestGroupList();
        },
        async getTestGroupList(){
            const testGroups = await queryTestGroupList(qs.stringify({index:this.index, size:this.size}))
            this.tableData = []
            testGroups.data.forEach(item=>{
                const data = {}
                data.testId = item.testId
                data.userId = item.userId
                data.testGroupId = item.testGroupId
                this.tableData.push(data)
            })
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.index = val;
            this.offset = (val - 1)*this.limit;
            this.getTestGroupList()
        },
        async click_query(){
            let res = await queryTestGroupsByTestId(qs.stringify({test_id:this.test_id}))
            if(res.status==200){
                this.tableData = res.data
            }
        },
        async handleDelete(id) {
            console.log(id)
            const res = await deleteTestGroup(qs.stringify({testGroupId:id}))
            if(res.status==200){
                this.$notify({
                    title: '正确提示',
                    message: '删除成功',
                    type: 'success'
                }); 
                this.getTestGroupList()
            }else{
               this.$notify({
                    title: '错误提示',
                    message: '删除失败',
                    type: 'error'
                }); 
            }
        },
        handleInsert() {
            this.dialogFormVisible = true;
        },
        async submitTestGroups(){
            let res = await insertTestGroup(qs.stringify(this.formData))
            if(res.status==200){
                this.$notify({
                    title: '添加成功',
                    message: '添加测试组成功',
                    type: 'success'
                });
            }
            this.dialogFormVisible = false
            this.getTestGroupList()
        }
    },
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
    padding: 20px;
}
</style>
