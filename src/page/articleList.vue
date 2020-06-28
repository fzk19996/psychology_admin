<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                  <el-table-column
                  type="index"
                  width="100">
                </el-table-column>
                <el-table-column
                  label="推送标题"
                  prop="name">
                </el-table-column>
                <el-table-column
                  label="推送概要"
                  prop="summary">
                </el-table-column>
                <el-table-column
                  label="推送介绍"
                  prop="description">
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="Success"
                      @click="addArticle(scope.$index, scope.row)">添加测试</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
                
            </el-table>
            <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
            </div>

            <el-dialog title="修改推送" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="推送标题" label-width="100px">
                        <el-input v-model="selectTable.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="推送概要" label-width="100px">
                        <el-input v-model="selectTable.summary"></el-input>
                    </el-form-item>
                    <el-form-item label="推送介绍" label-width="100px">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" label-width="100px">
                        <h4>开始时间</h4>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="selectTable.startTime"
                                type="date"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="结束时间" label-width="100px">
                        <h4>结束时间</h4>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="selectTable.endTime"
                                type="date"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="推送封面" label-width="100px">
                        <el-upload
                          class="avatar-uploader"
                          :action="baseUrl + '/v1/addimg/article'"
                          :show-file-list="false"
                          :on-success="handleServiceAvatarScucess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatearticle">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import { getArticle, getArticalCount, articalCategory, updateArticle, deleteArticle} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                categoryOptions: [],
                selectedCategory: [],
                offset:0,
                limit:20
            }
        },
             //时间选择器
             pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            picker.$emit("pick", new Date());
                        },
                    },
                    {
                        text: "昨天",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit("pick", date);
                        },
                    },
                    {
                        text: "一周前",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", date);
                        },
                    },
                ],
            },
           
        created(){
            this.initData();
            console.log(11111)
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    const countData = await getArticalCount();
                    if (countData.status == 200) {
                        this.count = countData.data;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getArticle();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getArticleTest(){
                try{
                    const categories = await articalCategory();
                    categories.forEach(item => {
                        if (item.sub_categories.length) {
                            const addnew = {
                                value: item.name,
                                label: item.name,
                                children: []
                            }
                            item.sub_categories.forEach((subitem, index) => {
                                if (index == 0) {
                                    return
                                }
                                addnew.children.push({
                                    value: subitem.name,
                                    label: subitem.name,
                                })
                            })
                            this.categoryOptions.push(addnew)
                        }
                    })
                }catch(err){
                    console.log('获取推送种类失败', err);
                }
            },
            async getArticle(){
                const article = await getArticle({ offset:this.offset, limit: 10});
                this.tableData = [];
                article.data.forEach(item => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.summary = item.summary;
                    tableData.description = item.description;
                    tableData.id = item.id;
                    tableData.category = item.category;
                    tableData.image_path = item.image_path;
                    this.tableData.push(tableData);
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getArticle()
            },
            //编辑推送基本信息
            handleEdit(index, row) {
                this.selectTable = row;
                this.address.address = row.address;
                this.dialogFormVisible = true;
                this.selectedCategory = row.category.split('/');
                if (!this.categoryOptions.length) {
                    this.getArticleTest();
                }
            },
            addArtical(index, row){
                this.$router.push({ path: 'addTests', query: { articleid: row.id }})
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteArticle(row.id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除推送成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除推送失败')
                }
            },
            async querySearchAsync(queryString, cb) {
                if (queryString) {
                    try{
                        const cityList = await searchplace(this.city.id, queryString);
                        if (cityList instanceof Array) {
                            cityList.map(item => {
                                item.value = item.address;
                                return item;
                            })
                            cb(cityList)
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
            },
            addressSelect(vale){
                const {address, latitude, longitude} = vale;
                this.address = {address, latitude, longitude};
            },
            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectTable.image_path = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
            async updatearticle(){
                this.dialogFormVisible = false;
                try{
                    Object.assign(this.selectTable, this.address);
                    this.selectTable.category = this.selectedCategory.join('/');
                    const res = await updateArticle(this.selectTable)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新推送信息成功'
                        });
                        this.getArticle();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新推送信息失败', err);
                }
            },
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
