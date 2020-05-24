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
                <el-table-column property="registe_time" label="激活日期">
                </el-table-column>
                <el-table-column property="username" label="用户名">
                </el-table-column>
                <el-table-column property="email" label="邮箱">
                </el-table-column>
                <el-table-column property="level" label="等级">
                </el-table-column>
                <el-table-column property="testday" label="有效天数">
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
                            @click="handleDelete(scope.$index, scope.row)"
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

                    <el-form-item label="用户邮箱" label-width="100px">
                        <el-input v-model="selectTable.email"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" label-width="100px"> 
                        <el-input v-model="selectTable.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="等级" label-width="100px">
                        <el-input v-model="selectTable.level"></el-input>
                    </el-form-item>
                    <el-form-item label="激活时间" label-width="100px">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="selectTable.registe_time"
                                type="date"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="有效天数" label-width="100px">
                        <el-input
                            v-model="selectTable.testday"
                            auto-complete="off"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="updateuser"
                        >确 定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import { getUserList, getUserCount } from "@/api/getData";
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
                if (countData.status == 1) {
                    this.count = countData.count;
                } else {
                    throw new Error("获取数据失败");
                }
                this.getUsers();
            } catch (err) {
                console.log("获取数据失败", err);
            }
        },
        async getUsers() {
            const Users = await getUserList({
                offset: this.offset,
                limit: this.limit,
            });
            this.tableData = [];
            Users.forEach((item) => {
                const tableData = {};
                tableData.username = item.username;
                tableData.registe_time = item.registe_time;
                tableData.password = item.password;
                this.tableData.push(tableData);
            });
        },
        async updateuser() {
            this.dialogFormVisible = false;
            try {
                Object.assign(this.selectTable, this.address);
                this.selectTable.category = this.selectedCategory.join("/");
                const res = await updateUser(this.selectTable);
                if (res.status == 1) {
                    this.$message({
                        type: "success",
                        message: "更新用户信息成功",
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
            this.address.address = row.address;
            this.selectedCategory = row.category.split("/");
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
