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
                    <mavon-editor v-model="formData.content" ref="md" @imgAdd="imgAdd" />
                    
                    <el-form-item class="button_submit">
                        <el-button @click="submitForm('formData')"
                            >立即创建</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import headTop from "@/components/headTop";
import { addArticle,articalCategory} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'

export default {
    data() {
        return {
            formData: {
                author: "",
                title: "", //推送标题
                content: "",
                type: "",
                abstractContent: ""
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入推送名称",
                        trigger: "blur",
                    },
                ],
                content: [
                    {
                        required: true,
                        message: "请输入推送概要",
                        trigger: "blur",
                    },
                ],
            },
            baseUrl,
            baseImgPath,
            categoryOptions: [],
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
    mounted() {
        
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
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    
                    try {
                        let result = await addArticle(this.formData);
                        if (result.status == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功",
                            });
                            Object.assign(
                                this.formData,
                                {
                                    title:"",
                                    content:"",
                                    type:""
                                }
                            );
                        } else {
                            this.$message({
                                type: "error",
                                message: result.message,
                            });
                        }
                        console.log(result);
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    this.$notify.error({
                        title: "错误",
                        message: "请检查输入是否正确",
                        offset: 100,
                    });
                    return false;
                }
            });
        },
    },
};
</script>

<style lang="less">
@import "../style/mixin";
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
