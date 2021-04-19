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
                    <el-form-item label="填写实验标题" prop="title">
                        <el-input
                            v-model="formData.title"
                            placeholder="填写实验标题"
                        ></el-input>
                    </el-form-item>
                    <el-button
                        size="mini"
                        @click="handleAdd(0)"
                    >插入</el-button>
                    <el-table border :data="question_list" style="width: 100%">
                        <el-table-column label="序号" type="index" show-overflow-tooltip >
                        </el-table-column>
                        <el-table-column property="question_id" label="题目id">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    @click="handleAdd(scope.$index)"
                                    >插入</el-button
                                >
                                <el-button
                                    size="mini"
                                    @click="handleDelete(scope.$index)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form-item class="button_submit">
                        <el-button @click="submitForm()"
                            >立即创建</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
         <el-dialog
                :visible.sync="showDialog"
                title="添加题目"
                width="600px"
                class="dialog"
                destroy-on-close
            >
            <h3 class="dialog-title">题目id</h3>
            <el-input
                style="width:400px"
                v-model="question_id"
                clearable
                placeholder="请输如题目id"
            ></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="addQuestion">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import headTop from "@/components/headTop";
import { addExperiment, isQuestionExist} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import qs from "qs";
export default {
    data() {
        return {
            formData: {
                title: "", //推送标题
                questionIdList: ""       
            },
            question_list:[],
            article_name: "",
            table_title:"",
            experiment_title:"",
            table_id: '', 
            question_index: 0,
            question_id:'',
            showDialog:false
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
        quillEditor
    },
    mounted() {
      
    },

    methods: {
        handleAdd(index){
            this.question_index = index
            this.showDialog = true
        },
        showError(message) {
            this.$notify.error({
            title: '错误',
            message: message
            });
        },
        async addQuestion(){
            let res = await isQuestionExist(qs.stringify({question_id:this.question_id}))
            if(res.status!=200){
                this.showError(res.msg)
                return 
            }
            const question = {}
            question.question_id = this.question_id
            this.question_list.splice(this.question_index, 0, question)
            this.question_id = ''
            this.showDialog = false
        },
        handleDelete(index) {
            this.question_list.splice(index, 1);
        },
        async submitForm(formName) {
            if(this.question_list.length==0){
                this.showError("还没有添加题目")
                return
            }
            for(var i=0;i<this.question_list.length;i++){
                if(i==0){
                    this.formData.questionIdList = this.question_list[i].question_id
                }else{
                    this.formData.questionIdList += ';'+this.question_list[i].question_id
                }
            }
            let result = await addExperiment(this.formData);
            if (result.status == 200) {
                this.$message({
                    type: "success",
                    message: "添加成功",
                });
                this.formData = {}
                this.timer = setInterval(() =>{
                    clearInterval(this.timer)
                    location.reload()
                },1000* 2)
            } else {
                this.$message({
                    type: "error",
                    message: result.message,
                });
            }
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
