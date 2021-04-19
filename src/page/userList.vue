<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-button @click="handleAddUser">添加用户</el-button>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%;"
            >
                <el-table-column type="index" width="100"> </el-table-column>
                <el-table-column property="userid" label="用户id">
                </el-table-column>
                <el-table-column property="username" label="用户名">
                </el-table-column>
                <el-table-column property="password" label="密码">
                </el-table-column>
                <el-table-column label="权限">
                    <template slot-scope="scope">
                        <span v-if="scope.row.authority==0">无权限</span>
                        <span v-if="scope.row.authority==4">普通用户</span>
                        <span v-if="scope.row.authority==5">中级用户</span>
                        <span v-if="scope.row.authority==6">高级用户</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                            >修改账户</el-button
                        >
                        <el-button
                            size="mini"
                            @click="handleDelete(scope.row)"
                            >删除账户</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <div class="Pagination" style="text-align: left; margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count"
                >
                </el-pagination>
            </div>

            <el-dialog title="修改用户信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">

                    <el-form-item label="用户名" label-width="100px">
                        <el-input v-model="selectTable.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" label-width="100px"> 
                        <el-input v-model="selectTable.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="权限" label-width="100px">
                        <!-- <el-radio-group v-model="selectTable.authority">
                            <el-radio label="0">无权限</el-radio>
                            <el-radio label="4">普通用户</el-radio>
                            <el-radio label="5">中级用户</el-radio>
                            <el-radio label="6">高级用户</el-radio>
                        </el-radio-group> -->
                        <el-radio v-model="selectTable.authority" :label="0">无权限</el-radio>
                        <el-radio v-model="selectTable.authority" :label="4">普通用户</el-radio>
                        <el-radio v-model="selectTable.authority" :label="5">中级用户</el-radio>
                        <el-radio v-model="selectTable.authority" :label="6">高级用户</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="click_submit"
                        >确 定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import qs from 'qs'
import { getUserList, getUserCount, updateUser, addUser, deleteUser} from "@/api/getData";
export default {
    data() {
        return {
            tableData: [],
            currentRow: null,
            offset: 0,
            limit: 20,
            count: 0,
            currentPage: 1,
            selectTable: {},
            dialogFormVisible: false,
            is_add: false
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
                const countData = await getUserCount();
                if (countData.status == 200) {
                    this.count = countData.data;
                } else {
                    console.log("获取数据失败")
                }
                this.getUsers();
            } catch (err) {
                console.log("获取数据失败");
            }
        },
        async getUsers() {
            const Users = await getUserList({
                offset: parseInt(this.offset),
                limit: parseInt(this.limit),
            });
            this.tableData = [];
            Users.data.forEach((item) => {
                const tableData = {};
                tableData.username = item.username;
                tableData.registe_time = item.register_time;
                tableData.password = item.password;
                tableData.email = item.email
                tableData.userid = item.userid
                tableData.authority = item.authority
                this.tableData.push(tableData);
            });
        },
        async click_submit() {
            this.dialogFormVisible = false;
            if(this.is_add==false){
                try {
                    const res = await updateUser(this.selectTable);
                    if (res.status == 200) {
                        this.$message({
                            type: "success",
                            message: "更新用户成功",
                        });
                        this.getUsers();
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                        });
                    }
                } catch (err) {
                    console.log("更新用户失败", err);
                }
            }else{
                try {
                    const res = await addUser(this.selectTable);
                    if (res.status == 200) {
                        this.$message({
                            type: "success",
                            message: "添加用户成功",
                        });
                        this.getUsers();
                    } else {
                        this.$message({
                            type: "error",
                            message: res.message,
                        });
                    }
                } catch (err) {
                    console.log("添加用户失败", err);
                }
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
        async handleDelete(row) {
            // this.tableData.splice(index, 1);
            const res = await deleteUser(qs.stringify({user_id:row.userid}));
            if (res.status == 200) {
                this.$message({
                    type: "success",
                    message: "删除用户成功"
                });
                this.getUsers();
            } else {
                this.$message({
                    type: "error",
                    message: res.message
                });
            }
        },
        handleEdit(index, row) {
            this.is_add = false
            this.selectTable = row;
            this.dialogFormVisible = true;
        },
        handleAddUser(){
            this.is_add = true
            this.selectTable = {}
            this.dialogFormVisible = true;
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
