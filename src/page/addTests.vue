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
                    <el-form-item label="测试标题" prop="title">
                        <el-input
                            v-model="formData.title"
                            placeholder="请输入测试标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择量表">
                        <el-input
                            v-model="table_title"
                            placeholder="请输入量表标题"
                        ></el-input>
                        <el-button @click="click_queryTable" >查询</el-button>
                        <el-checkbox-group v-model="table_ids">
                            <el-checkbox  :label="item.tableId" :key="item.tableId" v-for="item in table_list">{{item.title}}</el-checkbox>
                        </el-checkbox-group>
                        已经选中{{table_ids.length}}个量表
                    </el-form-item>
                    <el-form-item label="选择实验">
                        <el-input
                            v-model="experiment_title"
                            placeholder="请输入实验标题"
                        ></el-input>
                        <el-button @click="click_queryExperiment" >查询</el-button>
                        <el-radio-group v-model="formData.experimentId">
                            <el-radio :label="item.experimentId" :key="item.experimentId" v-for="item in experiment_list">{{item.title}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-button icon="plus" class="addLable" @click="addVar(index)">添加结果式</el-button>
                    <el-form-item label="选择是否需要提交音频">
                        <el-radio-group v-model="formData.useVideo">
                            <el-radio :label="0">不需要提交音频</el-radio>
                            <el-radio :label="1">需要提交音频</el-radio>
                        </el-radio-group>
                    </el-form-item>
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
import { addTest, queryExperimentByTitle, queryTableByTitle, mohuQueryTableByTitle} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import qs from 'qs';
export default {
    data() {
        return {
            formData: {
                title: "", //推送标题
                experimentId: 0,
                tableId: "",
                varList:[],
                useVideo:0
            },
            var_template:{
                varName: '',
                expression: '',
                scores:[0],
                comments:['']
            },
            expressions:[],
            vars:[],     
            table_list:[],
            experiment_list:[],
            article_name: "",
            table_title:"",
            experiment_title:"",
            table_ids: [], 
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入推送名称",
                        trigger: "blur",
                    },
                ],
                summary: [
                    {
                        required: true,
                        message: "请输入推送概要",
                        trigger: "blur",
                    },
                ],
            },
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
        change_start_date(val){
            this.formData.start_date = val
        },
        change_end_date(val){
            this.formData.end_date = val
        },
        click_addTable(){
          if(this.formData.tableId==''){
            this.formData.tableId = this.table_id
          }else{
            this.formData.tableId += ';' + this.table_id
          }
          this.table_list = []
          this.table_id = ''
          this.table_title = ''
        },
        async click_queryTable(){
            if(this.table_title=="")
                return
            const res = await mohuQueryTableByTitle(qs.stringify({title:this.table_title}))
            if(res.status==200)
                this.table_list = res.data
        },
        async click_queryExperiment(){
            if(this.experiment_title=="")
                return
            var data = {
                'title':this.experiment_title
            }
            const res = await queryExperimentByTitle(data)
            if(res.status==200)
                this.experiment_list = res.data
        },
        onEditorReady(editor) {
            console.log("editor ready!", editor);
        },
        async querySearchAsync(queryString, cb) {
            if (queryString) {
                try {
                    const cityList = await searchplace(
                        this.city.id,
                        queryString
                    );
                    if (cityList instanceof Array) {
                        cityList.map((item) => {
                            item.value = item.summary;
                            return item;
                        });
                        cb(cityList);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        },
        addVar(){
            this.vars.push(JSON.parse(JSON.stringify(this.var_template)))
        },
        addComment(index){
            console.log('coment按钮被点击了')
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
        addressSelect(summary) {
            this.formData.latitude = summary.latitude;
            this.formData.longitude = summary.longitude;
            console.log(this.formData.latitude, this.formData.longitude);
        },
        handleShopAvatarScucess(res, file) {
            if (res.status == 1) {
                this.formData.image_path = res.image_path;
            } else {
                this.$message.error("上传图片失败！");
            }
        },
        handleBusinessAvatarScucess(res, file) {
            if (res.status == 1) {
                this.formData.business_license_image = res.image_path;
            } else {
                this.$message.error("上传图片失败！");
            }
        },
        handleServiceAvatarScucess(res, file) {
            if (res.status == 1) {
                this.formData.catering_service_license_image = res.image_path;
            } else {
                this.$message.error("上传图片失败！");
            }
        },
        beforeAvatarUpload(file) {
            const isRightType =
                file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isRightType) {
                this.$message.error("上传图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isRightType && isLt2M;
        },
        tableRowClassName(row, index) {
            if (index === 1) {
                return "info-row";
            } else if (index === 3) {
                return "positive-row";
            }
            return "";
        },
        handleDelete(index) {
            this.activities.splice(index, 1);
        },
        showError(message) {
            this.$notify.error({
            title: '错误',
            message: message
            });
        },
        submitForm(formName) {
            if(this.vars.length==0){
                this.showError("没有添加结果式")
                return
            }
            this.formData.tableId = this.table_ids.join(';')
            this.formData.varList = this.vars
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    Object.assign(
                        this.formData,
                        { activities: this.activities },
                        {
                            category: 'none'
                        }
                    );
                    try {
                        let result = await addTest(this.formData);
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
                            // location.reload();
                        //    this.$router.go(0);
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
