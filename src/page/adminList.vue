<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%;">
                <el-table-column prop="adminname" label="姓名">
                </el-table-column>
                <el-table-column prop="id" label="管理员ID" >
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="建立日期"
                >
                </el-table-column>
                <el-table-column prop="password" label="密码">
                </el-table-column>
                <el-table-column prop="admin" label="权限"> </el-table-column>
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
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count"
                >
                </el-pagination>
            </div>
            <el-dialog title="修改管理员信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="姓名" label-width="100px">
                        <el-input
                            v-model="selectTable.adminname"
                            auto-complete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="管理员密码" label-width="100px">
                        <el-input v-model="selectTable.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="权限" label-width="100px">
                        <el-input v-model="selectTable.admin"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="updateadmin"
                        >确 定</el-button
                    >
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import { adminList, adminCount } from "@/api/getData";
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
                const countData = await adminCount();
                if (countData.status == 1) {
                    this.count = countData.count;
                } else {
                    throw new Error("获取数据失败");
                }
                this.getAdmin();
            } catch (err) {
                console.log("获取数据失败", err);
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.offset = (val - 1) * this.limit;
            this.getAdmin();
        },
        async getAdmin() {
            try {
                const res = await adminList({
                    offset: this.offset,
                    limit: this.limit,
                });
                if (res.status == 1) {
                    this.tableData = [];
                    res.data.forEach((item) => {
                        const tableItem = {
                            create_time: item.create_time,
                            adminname: item.adminname,
                            id: item.id,
                            admin: item.admin,
                            password: item.password,

                        };
                        this.tableData.push(tableItem);
                    });
                } else {
                    throw new Error(res.message);
                }
            } catch (err) {
                console.log("获取数据失败", err);
            }
        },
          async updateadmin() {
            this.dialogFormVisible = false;
            try {
                Object.assign(this.selectTable, this.address);
                this.selectTable.category = this.selectedCategory.join("/");
                const res = await updateAdmin(this.selectTable);
                if (res.status == 1) {
                    this.$message({
                        type: "success",
                        message: "更新用户信息成功",
                    });
                    this.getAdmin();
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
        handleDelete(index) {
            this.tableData.splice(index, 1);
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.selectTable = row;
            this.address.address = row.address;
            this.selectedCategory = row.category.split("/");
            if (!this.categoryOptions.length) {
                this.getArticleTest();
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
