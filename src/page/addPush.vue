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
                    <el-form-item label="推送概要" prop="summary">
                        <el-input
                            v-model="formData.summary"
                            placeholder="请输入推送概要"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择文章" prop="article_id">
                        <el-input
                            v-model="article_name"
                            placeholder="请输入文章标题"
                        ></el-input>
                        <el-button @click="click_queryArticle" >查询</el-button>
                        <el-radio-group v-model="formData.article_id">
                            <el-radio :label="item.article_id" :key="item.article_id" v-for="item in article_list">{{item.title}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="选择测试" prop="article_id">
                        <el-input
                            v-model="test_title"
                            placeholder="请输入测试标题"
                        ></el-input>
                        <el-button @click="click_queryTest" >查询</el-button>
                        <el-radio-group v-model="formData.test_id">
                            <el-radio :label="item.test_id" :key="item.test_id" v-for="item in test_list">{{item.title}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="用户名称" prop="username_list">
                        <el-input
                            v-model="formData.username_list"
                            placeholder="请输入用户名以分号隔开"
                        ></el-input>
                        
                    </el-form-item>
                    <el-form-item>
                        <h4>开始时间</h4>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="formData.start_date"
                                type="date"
                                placeholder="选择日期"
                                @change="change_start_date"
                                value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </div>
                        <h4>结束时间</h4>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="formData.end_date"
                                @change="change_end_date"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </div>
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
import { addPush, queryArticleByName, queryTestByTitle} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            formData: {
                title: "", //推送标题
                summary: "", //概要
                start_date: "",
                end_date: "",
                image_path: "",
                article_id:0,
                test_id:0,
                username_list:""
            },
            article_list:[],
            test_list:[],
            article_name: "",
            test_title:"",
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
                summary: [
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
        quillEditor
    },
    mounted() {
        this.initData();
    },
    methods: {
        change_start_date(val){
            this.formData.start_date = val
        },
        change_end_date(val){
            this.formData.end_date = val
        },
        async click_queryArticle(){
            if(this.article_name=="")
                return
            var data = {
                'name':this.article_name
            }
            const res = await queryArticleByName(data)
            if(res.status==200)
                this.article_list = res.data
        },
        async click_queryTest(){
            if(this.test_title=="")
                return
            var data = {
                'title':this.test_title
            }
            const res = await queryTestByTitle(data)
            if(res.status==200)
                this.test_list = res.data
        },
        onEditorReady(editor) {
            console.log("editor ready!", editor);
        },
        submit() {
            console.log(this.content);
            this.$message.success("提交成功！");
        },
        async initData() {
            try {
                this.city = await cityGuess();
                const categories = await articalCategory();
                categories.forEach((item) => {
                    if (item.sub_categories.length) {
                        const addnew = {
                            value: item.name,
                            label: item.name,
                            children: [],
                        };
                        item.sub_categories.forEach((subitem, index) => {
                            if (index == 0) {
                                return;
                            }
                            addnew.children.push({
                                value: subitem.name,
                                label: subitem.name,
                            });
                        });
                        this.categoryOptions.push(addnew);
                    }
                });
            } catch (err) {
                console.log(err);
            }
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
        submitForm(formName) {
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
                        let result = await addPush(this.formData);
                        if (result.status == 200) {
                            this.$message({
                                type: "success",
                                message: "添加成功",
                            });
                           this.$router.go(0);
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
