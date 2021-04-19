<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 30px;">
            <el-col :span="16" :offset="4">
                <el-form
                    :model="formData"
                    ref="formData"
                    label-width="110px"
                    class="demo-formData"
                >
                    <el-form-item label="推送名称"> 
                        <el-input
                            v-model="formData.title"
                            placeholder="请输入推送标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="选择文章">
                        <el-input
                            v-model="article_title"
                            placeholder="请输入文章标题"
                        ></el-input>
                        <el-button @click="click_queryArticle" >查询</el-button>
                        <el-radio-group v-model="formData.articleId">
                            <el-radio :label="item.articleId" :key="item.articleId" v-for="item in article_list">{{item.title}}</el-radio>
                        </el-radio-group>
                        已经选择文章：{{formData.articleId}}
                    </el-form-item>

                    <el-form-item label="选择测试">
                        <el-input
                            v-model="test_title"
                            placeholder="请输入测试名称"
                        ></el-input>
                        <el-button @click="click_queryTest" >查询</el-button>
                        <el-radio-group v-model="formData.testId">
                            <el-radio :label="item.testId" :key="item.testId" v-for="item in test_list">{{item.title}}</el-radio>
                        </el-radio-group>
                        已经选择测试：{{formData.testId}}
                    </el-form-item>

                    <el-form-item label="选择用户">
                        <el-input
                            v-model="user_name"
                            placeholder="请输入用户名称"
                        ></el-input>
                        <el-button @click="click_queryUser" >查询</el-button>
                        <el-radio-group v-model="user_add_info">
                            <el-radio  :label="item" :key="item.userid" v-for="item in user_list" >{{item.username}}</el-radio>
                        </el-radio-group>
                        <el-button @click="click_add" >添加</el-button>
                        <el-table border :data="user_add_list" style="width: 100%">
                            <el-table-column label="序号" type="index" show-overflow-tooltip >
                            </el-table-column>
                            <el-table-column property="username" label="用户名">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        @click="handleDelete(scope.$index)"
                                        >删除</el-button
                                    >
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="选择日期">
                        <el-date-picker v-model="date" size="small"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="selectTime">
                        </el-date-picker>
                        有效日期：{{formData.startDate}} 至 {{formData.endDate}}
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
import { mohuQueryUser, mohuQueryArticle, mohuQueryTest, addPush, queryPushById, queryUserById, updatePush} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
import { quillEditor } from "vue-quill-editor";
import { mapState, mapMutations } from "vuex";
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import qs from 'qs';
export default {
    data() {
        return {
            formData: {
                articleId: "",
                testId:"",
                userIds:"",
                title:"",
                type:"",
                startDate:"",
                endDate:""
            },
            date:"",
            article_title:"",
            test_title:"",
            user_name:"",
            user_ids:[],
            article_list:[],
            test_list:[],
            user_list:[],
            user_add_info:{},
            user_add_list:[],
            push_id:""
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
        this.push_id = this.$route.params.push_id;
        if(this.push_id==undefined){
            alert("缺少参数")
            this.$router.push({path:"/pushList"})
        }
        this.getPush()

    },
    methods: {
        async getPush() {
            const pushData = await queryPushById(qs.stringify({push_id:this.push_id}));
            if(pushData.status==200){
                this.formData = pushData.data
                var user_id_list = this.formData.userIds.substring(1,this.formData.userIds.length-1).split(";")
                console.log(this.formData.userIds.substring(1,this.formData.userIds.length-1))
                for(var i=0;i<user_id_list.length;i++){
                    const userData = await queryUserById(qs.stringify({user_id:user_id_list[i]}))
                    if(userData.status==200){
                        this.user_add_list.push(userData.data)
                    }
                }
            }
        },

        selectTime(val){
            this.formData.startDate = val.split("至")[0]
            this.formData.endDate = val.split("至")[1]
        },

        click_add(){
            this.user_add_list.push(this.user_add_info)
        },

        handleDelete(index) {
            this.user_add_list.splice(index, 1);
        },
        
        async click_queryArticle(){
            let res = await mohuQueryArticle(qs.stringify({title:this.article_title}))
            if(res.status==200){
                this.article_list = res.data
            }
        },

        async click_queryTest(){
            let res = await mohuQueryTest(qs.stringify({title:this.test_title}))
            if(res.status==200){
                this.test_list = res.data
            }
        },

        async click_queryUser(){
            let res = await mohuQueryUser(qs.stringify({username:this.user_name}))
            if(res.status==200){
                this.user_list = res.data
            }
        },

    
        async submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    
                    try {
                        var user_ids = ""
                        for(var i=0;i<this.user_add_list.length;i++){
                            user_ids += ';' + this.user_add_list[i].userid
                        }
                        this.formData.userIds = user_ids+";"
                        let result = await updatePush(this.formData);
                        if (result.status == 200) {
                            this.$message({
                                type: "success",
                                message: "更新成功",
                            });
                            this.timer = setInterval(() =>{
                                clearInterval(this.timer)
                                this.$router.push('/pushList');
                            },1000* 2)
                            // location.reload();
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
