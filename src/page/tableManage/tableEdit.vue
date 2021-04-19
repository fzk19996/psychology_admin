<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 30px;">
            <el-col :span="16" :offset="4">
                <el-form
                    ref="formData"
                    label-width="110px"
                    class="demo-formData"
                >
                    <el-form-item label="量表标题">
                        <el-input
                            v-model="title"
                            placeholder="请输入量表标题"
                        ></el-input>
                    </el-form-item>
                    <el-button
                        size="mini"
                         @click="handleAdd(question_list.length)">
                         插入
                    </el-button>
                    <el-table border :data="question_list" style="width: 100%">
                        <el-table-column label="序号" type="index" show-overflow-tooltip width="50">
                        </el-table-column>
                        <el-table-column property="question_id" label="题目id">
                        </el-table-column>
                        <!-- <el-table-column property="content" label="内容">
                        </el-table-column>
                        <el-table-column property="type" label="类别">
                        </el-table-column> -->
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
                        <el-button @click="updateTable()"
                            >更新</el-button
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
                    placeholder="请输入群发任务名称"
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
import { queryTableById, queryQuestionById, updateTable, isQuestionExist} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import qs from 'qs';
export default {
    data() {
        return {
            title:'',
            table_id:'',
            question_list:[],
            showDialog:false,
            question_index:'',
            question_id:''
        };
    },
    activated(){
        this.table_id = this.$route.params.id;
        this.getTable()
    },
    methods: {
        async getTable() {
            const table_data = await queryTableById({table_id:this.table_id});
            this.question_list = [];
            this.title = table_data.data.title
            table_data.data.questions.forEach((item) => {
                const question = {};
                question.question_id = item.questionId;
                question.type = item.type
                question.content = item.question
                console.log(question)
                this.question_list.push(question);
            });
            console.log(this.question_list)
        },

        async updateTable(){
            var question_id_list = []
            this.question_list.forEach((item) => {
                question_id_list.push(item.question_id)
            })
            const res = await updateTable({
                tableId:this.table_id,
                title: this.title,
                questionIdList: question_id_list.join(';')
            })
            if(res.status!=200){
                this.showError('更新失败')
            }else{
                this.showSuccess('更新成功')
            }
        },

        handleDelete(index){
            this.question_list.splice(index,1)
        },

        handleAdd(index){
            this.question_index = index
            this.showDialog = true
        },
        

        showSuccess(message) {
            this.$notify({
            title: '成功',
            message: message,
            type: 'success'
            });
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
