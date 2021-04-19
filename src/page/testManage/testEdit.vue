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
                    <el-form-item label="实验id">
                        <el-input
                            v-model="experiment_id"
                            placeholder="请输入实验id"
                        ></el-input>
                    </el-form-item>
                     <el-form-item label="选择是否需要提交音频">
                        <el-radio-group v-model="use_video">
                            <el-radio :label="0">不需要提交音频</el-radio>
                            <el-radio :label="1">需要提交音频</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-button icon="plus" class="addLable" @click="addVar(index)">添加结果式</el-button>
                     <el-form-item label="结果式" v-for="(var_tmp, index) in vars" :key="index">
                            <el-input placeholder="请输入变量名称" v-model="var_tmp.varName"></el-input>
                            <el-input type="textarea" :rows="2" v-model="var_tmp.expression" placeholder="请输入计算公式"></el-input>
                            <el-button icon="plus" class="addLable" @click="addComment(index)">添加分数区间</el-button>
                            <el-button icon="minus" class="addLable" @click="deleteVar(index)">删除结果式</el-button>
                            <el-row
                                type="flex"
                                justify="start"
                                align="middle"
                                class="markSetRow"
                                v-for="(comment, index2) in var_tmp.comments"
                                :key="index2"
                                >
                                <el-col
                                    :span="14"
                                    :offset="1"
                                >
                                    <el-input
                                    placeholder="分数区间"
                                    v-model="var_tmp.scores[index2]"
                                    ></el-input>
                                </el-col>
                                <el-col
                                    :span="28"
                                    :offset="1"
                                >
                                    <span></span>
                                    <el-input
                                    type="textarea"
                                    :rows="2"
                                    v-model="var_tmp.comments[index2]"
                                    placeholder="请输入区间对应文字"
                                    ></el-input>
                                </el-col>
                                <el-col
                                    :span="10"
                                    :offset="2"
                                >
                                <el-button icon="minus" class="addLable" @click="deleteComment(index, index2)">删除分数区间</el-button>
                                </el-col>
                            </el-row>
                    </el-form-item>
                    <el-button
                        size="mini"
                         @click="handleAdd(0)">
                         插入
                    </el-button>
                    <el-table border :data="table_list" style="width: 100%">
                        <el-table-column label="序号" type="index" show-overflow-tooltip >
                        </el-table-column>
                        <el-table-column property="table_id" label="量表id">
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
                                    @click="deleteTable(scope.$index)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form-item class="button_submit">
                        <el-button @click="updateTest()"
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
                <h3 class="dialog-title">量表id</h3>
                <el-input
                    style="width:400px"
                    v-model="table_id"
                    clearable
                    placeholder="请输入量表id"
                ></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false">取 消</el-button>
                    <el-button type="primary" @click="addTable">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
import headTop from "@/components/headTop";
import { queryTestById, updateTest} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import qs from 'qs';
export default {
    data() {
        return {
            title:'',
            table_id:'',
            table_list:[],
            showDialog:false,
            table_index:'',
            experiment_id:'',
            vars:[],
            expressions:[],
            use_video:0,
            var_template:{
                varName: '',
                expression: '',
                scores:[0],
                comments:['']
            },
        };
    },
    activated(){
        this.test_id = this.$route.params.id;
        console.log(this.$route.params)
        this.getTest()
    },
    methods: {
        async getTest() {
            const table_data = await queryTestById(qs.stringify({test_id:this.test_id}));
            this.table_list = [];
            this.title = table_data.data.title
            this.experiment_id = table_data.data.experimentId
            this.vars = table_data.data.varList
            this.use_video = table_data.data.useVideo
            if(table_data.data.tableId==='')
                return
            table_data.data.tableId.split(';').forEach((item) => {
                const table = {};
                table.table_id = item;
                this.table_list.push(table);
            });
            // console.log(this.table_list)
            console.log(this.vars)
        },

        async updateTest(){
            var table_id_list = []
            this.table_list.forEach((item) => {
                table_id_list.push(item.table_id)
            })
            const res = await updateTest({
                tableId: table_id_list.join(';'),
                title: this.title,
                experimentId: this.experiment_id,
                testId: this.test_id,
                varList: this.vars,
                useVideo: this.use_video,
                expressionList: this.expressions.join(';')
            })
            if(res.status!=200){
                this.showError('更新失败')
            }else{
                this.showSuccess('更新成功')
                // location.reload()
                this.timer = setInterval(() =>{
                    clearInterval(this.timer)
                    this.$router.push('/testList');
                },1000* 2)
            }
        },

        deleteTable(index){
            this.table_list.splice(index,1)
        },

        handleAdd(index){
            this.table_index = index
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
        addVar(){
            this.vars.push(JSON.parse(JSON.stringify(this.var_template)))
        },
        addComment(index){
            this.vars[index].scores.push('')
            this.vars[index].comments.push('')
        },
        deleteComment(index1, index2){
            this.vars[index1].comments.splice(index2,1)
            this.vars[index1].scores.splice(index2,1)
        },
        deleteVar(index){
            this.vars.splice(index, 1)
        },

        async addTable(){
            const table = {}
            table.table_id = this.table_id
            this.table_list.splice(this.table_index, 0, table)
            this.table_id = ''
            this.showDialog = false
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
