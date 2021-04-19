<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  label="文章id"
                  prop="articleId">
                </el-table-column>
                 <el-table-column
                  label="文章标题"
                  prop="title">
                </el-table-column>
                 <el-table-column
                  label="作者"
                  prop="author">
                </el-table-column>
                 <el-table-column
                  label="创建时间"
                  prop="createTime">
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.row.articleId)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.row.articleId)">删除</el-button>
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
        </div>
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import { queryArticleList, deleteArticle, queryArticleCount} from '@/api/getData'
    import qs from 'qs'
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
                index:0,
                size:10
            }
        }, 
        created(){
            this.initData();
        },
    	components: {
    		headTop,
    	},
        methods: {
            async initData(){
                try{
                    const countData = await queryArticleCount();
                    if (countData.status == 200) {
                        this.count = countData.data;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getArticleList();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getArticleList(){
                const articles = await queryArticleList(qs.stringify({index:this.index, size: this.size}));
                this.tableData = []
                articles.data.forEach(item => {
                    const tableData = {};
                    tableData.articleId = item.articleId
                    tableData.title = item.title
                    tableData.author = item.author
                    tableData.createTime = item.createTime
                    this.tableData.push(tableData)
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.index = val;
                this.offset = (val - 1)*this.limit;
                this.getPushList()
            },
            //编辑推送基本信息
            handleEdit(id) {
                this.$router.push({name:'articleEdit', params:{article_id:id}});
            },
            async handleDelete(id) {
                try{
                    const res = await deleteArticle(qs.stringify({article_id:id}));
                    if (res.status == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除文章成功'
                        });
                        this.getArticleList()
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除文章失败')
                }
            },
        },
    }
</script>

<style lang="less">
	@import '../../style/mixin';
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
