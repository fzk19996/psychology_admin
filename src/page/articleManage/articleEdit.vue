<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 30px;">
            <el-col :span="16" :offset="4">
                <el-form
                    :model="formData"
                    :rules="rules"
                    ref="formData"
                    label-width="110px"
                    class="demo-formData"
                >
                    <el-form-item label="作者" prop="title">
                        <el-input
                            v-model="formData.author"
                            placeholder="请输入作者"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="文章标题" prop="title">
                        <el-input
                            v-model="formData.title"
                            placeholder="请输入文章标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="请编辑文章摘要">
                       <el-input
                            v-model="formData.abstractContent"
                            placeholder="请输入文章摘要"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择文章类型">
                        <el-radio-group v-model="formData.type">
                            <el-radio :label="1">心理调适</el-radio>
                            <el-radio :label="2">门户页面文章</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="请编辑文章内容">
                       <el-input
                            v-model="formData.content"
                            placeholder="请输入文章内容"
                        ></el-input>
                    </el-form-item> -->
                    <mavon-editor v-model="formData.content" ref="md" @imgAdd="imgAdd"/>
                    
                    <el-form-item class="button_submit">
                        <el-button @click="submit_update()"
                            >立即更新</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import headTop from "@/components/headTop";
import {queryArticleById, updateArticle} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'
import qs from 'qs';
export default {
    data() {
        return {
            formData: {
                articleId: "",
                abstractContent:"",
                content:"",
                author:"",
                type:"",
            },
            articleId:""
        };
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },

        ...mapState(["isAddQuestion", "survey", "savedIndex"]),
    },
    components: {
        headTop,
        quillEditor,
        mavonEditor
    },
    activated() {
        this.articleId = this.$route.params.article_id;
        if(this.articleId==undefined){
            alert("缺少参数")
            this.$router.push({path:"/articleList"})
        }
        this.getArticle()

    },
    methods: {

        imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           formdata.append('file', $file);
           axios({
               url: '/img/upload',
               method: 'post',
               data: formdata,
               headers: { 'Content-Type': 'multipart/form-data' },
           }).then((url) => {
               let name = $file.name
                if (name.includes('-')) {
                    name = name.replace(/-/g, '')
                }
                let content = this.formData.content
                if (content.includes(name)) {
                    let oStr = `(${pos})`
                    // let nStr = `(${url})`
                    let nStr = '('+'http://127.0.0.1:8081'+url.data+')'
                    let index = content.indexOf(oStr)
                    let str = content.replace(oStr, '')
                    let insertStr = (soure, start, newStr) => {
                        return soure.slice(0, start) + newStr + soure.slice(start)
                    }
                    this.formData.content = insertStr(str, index, nStr)
                }
           })
        },

        async getArticle() {
            const articleData = await queryArticleById(this.articleId);
            if(articleData.status==200){
                this.formData = articleData.data
            }
        },

        async submit_update(){
            let result = await updateArticle(this.formData)
            if (result.status == 200) {
                this.$message({
                    type: "success",
                    message: "更新成功",
                });
                this.timer = setInterval(() =>{
                    clearInterval(this.timer)
                    this.$router.push('/articleList');
                },1000* 2)
            } else {
                this.$message({
                    type: "error",
                    message: result.message,
                });
            }
        }

    
        
    },
};
</script>

<style lang="less">
@import "../../style/mixin";
.button_submit {
    text-align: center;
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
.el-table .info-row {
    background: #c9e5f5;
}

.el-table .positive-row {
    background: #e2f0e4;
}

.edit_container {
    padding: 40px;
    margin-bottom: 40px;
}
.editer {
    height: 350px;
}
.submit_btn {
    text-align: center;
}
</style>
