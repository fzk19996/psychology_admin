<template>
	<div class="manage_page fillcontain">
		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="min-height: 100%; background-color: #324057;">
				<el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
						<template slot="title"><i class="el-icon-document"></i>数据管理</template>
						<el-menu-item index="userList">用户列表</el-menu-item>
						<el-menu-item index="pushList">推送列表</el-menu-item>
						<el-menu-item index="articleList">文章列表</el-menu-item>
						<el-menu-item index="testList">测试列表</el-menu-item>
						<el-menu-item index="adminList">管理员列表</el-menu-item>
						<el-menu-item index="answerList">答案列表</el-menu-item>
						<el-menu-item index="answerList_single">单个答案列表</el-menu-item>
						<el-menu-item index="questionList">题目列表</el-menu-item>
						<el-menu-item index="tableList">量表列表</el-menu-item>
						<el-menu-item index="experimentList">实验列表</el-menu-item>
						<el-menu-item index="testList">测试列表</el-menu-item>
						<el-menu-item index="testGroupList">测试分组列表</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title"><i class="el-icon-plus"></i>添加数据</template>
						<el-menu-item index="addArticle">添加文章</el-menu-item>
						<el-menu-item index="addTests">添加测试</el-menu-item>
						<el-menu-item index="addPush">添加推送</el-menu-item>
						<el-menu-item index="addTable">添加量表</el-menu-item>
						<el-menu-item index="addExperiment">添加实验</el-menu-item>
						<el-menu-item index="addTableQuestion">添加量表题目</el-menu-item>
						<el-menu-item index="addExperimentQuestion">添加实验题目</el-menu-item>
					</el-submenu>
					<el-submenu index="4">
						<template slot="title"><i class="el-icon-star-on"></i>图表</template>
						<el-menu-item index="visitor">用户分布</el-menu-item>
						<!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
					</el-submenu>
					<el-submenu index="6">
						<template slot="title"><i class="el-icon-setting"></i>设置</template>
						<el-menu-item index="adminSet">管理员设置</el-menu-item>
						<!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
					</el-submenu>
					<el-submenu index="7">
						<template slot="title"><i class="el-icon-warning"></i>说明</template>
						<el-menu-item index="explain">说明</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.manage_page{
		// background-color: #ff0000 !important;
		// *background-color: #fff000 !important;
		// *background-color: #0000ff;
		// background-color: #000000;
	}
</style>
