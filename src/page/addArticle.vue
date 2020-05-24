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
                    <el-form-item label="推送标题" prop="name">
                        <el-input
                            v-model="formData.name"
                            placeholder="请输入推送标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="推送概要" prop="summary">
                        <el-input
                            v-model="formData.summary"
                            placeholder="请输入推送概要"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="推送描述" prop="description">
                        <div>
                            <div class="edit_container">
                                <quill-editor
                                    v-model="formData.content"
                                    ref="myQuillEditor"
                                    class="editer"
                                    @ready="onEditorReady($event)"
                                >
                                </quill-editor>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="推送类型" style="white-space: nowrap;">
                        <span>心理调适</span>
                        <el-switch
                            on-text=""
                            off-text=""
                            v-model="formData.psychological_adjustment"
                        ></el-switch>
                        <span>人际关系</span>
                        <el-switch
                            on-text=""
                            off-text=""
                            v-model="formData.interpersonal_relationship"
                        ></el-switch>
                        <span>抑郁</span>
                        <el-switch
                            on-text=""
                            off-text=""
                            v-model="formData.depression"
                        ></el-switch>
                    </el-form-item>
                    <el-form-item style="white-space: nowrap;">
                        <span>爱情</span>
                        <el-switch
                            on-text=""
                            off-text=""
                            v-model="formData.love"
                        ></el-switch>
                        <span>职场</span>
                        <el-switch
                            on-text=""
                            off-text=""
                            v-model="formData.workplace"
                        ></el-switch>
                        <span>情绪</span>
                        <el-switch
                            on-text=""
                            off-text=""
                            v-model="formData.emotion"
                        ></el-switch>
                    </el-form-item>

                    <el-form-item label="上传推送封面">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/v1/addimg/article'"
                            :show-file-list="false"
                            :on-success="handleShopAvatarScucess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img
                                v-if="formData.image_path"
                                :src="baseImgPath + formData.image_path"
                                class="avatar"
                            />
                            <i
                                v-else
                                class="el-icon-plus avatar-uploader-icon"
                            ></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <router-link to="/addTests" class="build-new btn"
                            >添加问卷</router-link
                        >
                        <h4>开始时间</h4>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="formData.startTime"
                                type="date"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </div>
                        <h4>结束时间</h4>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker
                                v-model="formData.endTime"
                                type="date"
                                placeholder="选择日期"
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
import { addArticle,articalCategory} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            formData: {
                name: "", //推送标题
                description: "", //介绍
                summary: "", //概要
                content: "",
                psychological_adjustment: false,
                interpersonal_relationship: false,
                depression: false,
                love: false,
                workplace: false,
                emotion: false,
                startTime: "",
                endTime: "",
                image_path: "",
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
                name: [
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
                            category: this.selectedCategory.join("/"),
                        }
                    );
                    try {
                        let result = await addArticle(this.formData);
                        if (result.status == 1) {
                            this.$message({
                                type: "success",
                                message: "添加成功",
                            });
                            this.formData = {
                                name: "", //推送标题
                                summary: "", //概要
                                description: "", //描述
                                //选项分类
                                psychological_adjustment: true,
                                interpersonal_relationship: true,
                                depression: true,
                                love: true,
                                workplace: true,
                                emotion: true,
                                startTime: "",
                                endTime: "",
                                image_path: "",
                                business_license_image: "",
                                catering_service_license_image: "",
                            };
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
