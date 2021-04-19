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
                    <el-form-item label="推送标题" prop="title">
                        <el-input
                            v-model="formData.title"
                            placeholder="请输入推送标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="请选择文章类别">
                        <el-select v-model="formData.type" placeholder="请选择文章类别">
                            <el-option label="全部可见" value="2"/>
                            <el-option label="不可见" value="-2"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请编辑文章内容">
                        <mavon-editor 
                            v-model="formData.content" 
                            style="min-height: 600px"
                        />
                    </el-form-item>
                    
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
export default {
    data() {
        return {
            formData: {
                title: "", //推送标题
                content: "",
            },
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
