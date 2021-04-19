import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addArticle = r => require.ensure([], () => r(require('@/page/addArticle')), 'addArticle');
const addTests = r => require.ensure([], () => r(require('@/page/addTests')), 'addTests');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');

const pushList = r => require.ensure([], () => r(require('@/page/pushList')), 'pushList');
const addPush = r => require.ensure([], () => r(require('@/page/addPush')), 'addPush');
const pushEdit = r => require.ensure([], () => r(require('@/page/pushManage/pushEdit')), 'pushEdit')

// const testList = r => require.ensure([], () => r(require('@/page/testList')), 'testList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const SetQuestion = r => require.ensure([], () => r(require('@/page/SetQuestion')), 'SetQuestion');
const SetAdvice = r => require.ensure([], () => r(require('@/page/SetAdvice')), 'SetAdvice');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');
const Statistics = r => require.ensure([], () => r(require('@/page/Statistics')), 'Statistics');
const Questionnaire = r => require.ensure([], () => r(require('@/page/Questionnaire')), 'Questionnaire');
const Success = r => require.ensure([], () => r(require('@/page/Success')), 'Success');
const Error = r => require.ensure([], () => r(require('@/page/Error')), 'Error');
const Close = r => require.ensure([], () => r(require('@/page/Close')), 'Close');
const addTableQuestion = r => require.ensure([], () => r(require('@/page/addTableQuestion')), 'addTableQuestion');
const addExperimentQuestion = r => require.ensure([], () => r(require('@/page/addExperimentQuestion')), 'addExperimentQuestion');
const addTable = r => require.ensure([], () => r(require('@/page/addTable')), 'addTable');
const addExperiment = r => require.ensure([], () => r(require('@/page/addExperiment')), 'addExperiment');
const answerList = r => require.ensure([], () => r(require('@/page/answerList')), 'answerList');
const answerList_single = r => require.ensure([], () => r(require('@/page/answerList_single')), 'answerList_single');
const questionList = r => require.ensure([], () => r(require('@/page/questionList')), 'questionList');
const tableList = r => require.ensure([], () => r(require('@/page/tableManage/tableList')), 'tableList');
const tableEdit = r => require.ensure([], () => r(require('@/page/tableManage/tableEdit')), 'tableEdit');
const experimentList = r => require.ensure([], () => r(require('@/page/experimentManage/experimentList')), 'experimentList');
const experimentEdit = r => require.ensure([], () => r(require('@/page/experimentManage/experimentEdit')), 'experimentEdit');
const testList = r => require.ensure([], () => r(require('@/page/testManage/testList')), 'testList');
const testEdit = r => require.ensure([], () => r(require('@/page/testManage/testEdit')), 'testEdit')
const testGroupList = r => require.ensure([], () => r(require('@/page/testGroupList')), 'testGroupList')
const articleList = r => require.ensure([], () => r(require('@/page/articleManage/articleList.vue')), 'articleList')
const articleEdit = r => require.ensure([], () => r(require('@/page/articleManage/articleEdit')), 'articleEdit')

const routes = [
	{
		path: '/',
		component: login
	},
 
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			name:'addTableQuestion',
			path:'/addTableQuestion',
			component: addTableQuestion,
			meta: ['添加数据', '添加量表题目']
		},{
			name:'addExperimentQuestion',
			path:'/addExperimentQuestion',
			component: addExperimentQuestion,
			meta: ['添加数据', '添加实验题目']
		},{
			path: '/addArticle',
			component: addArticle,
			meta: ['添加数据', '添加文章'],
		},{
			path: '/addTests',
			component: addTests,
			meta: ['添加数据', '添加测试'],
		},
		{
			path:'/addPush',
			component: addPush,
			meta:['添加数据', '添加推送']
		},
		{
			path:'/addTable',
			component: addTable,
			meta:['添加数据', '添加量表']
		},
		{
			path:'/addExperiment',
			component: addExperiment,
			meta:['添加数据', '添加实验']
		},
		{
			path: '/userList',
			component: userList,
			meta: ['数据管理', '用户列表'],
		},
		{
			path: '/tableList',
			component: tableList,
			meta: ['数据管理', '量表列表'],
		},
		{
			path: '/experimentList',
			component: experimentList,
			meta: ['数据管理', '实验列表'],
		},
		{
			path: '/testList',
			component: testList,
			meta: ['数据管理', '测试列表'],
		},
		{
			path:'/answerList',
			component: answerList,
			meta: ['数据管理', '答案列表']
		},
		{
			path:'/answerList_single',
			component: answerList_single,
			meta: ['数据管理', '单个答案列表']
		},
		{
			path:'/questionList',
			component: questionList,
			meta: ['数据管理', '题目列表']
		},
		{
			path: '/pushList',
			component: pushList,
			meta: ['数据管理', '推送列表'],
    	},{
			path: '/articleList',
			component: articleList,
			meta: ['数据管理', '文章列表'],
		},{
			path: '/testList',
			component: testList,
			meta: ['数据管理', '测试数据'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
		},{
			path: '/testGroupList',
			component: testGroupList,
			meta: ['数据管理', '测试成员组列表'],
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '用户分布'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明', '说明'],
		},
		{
			path: '/tableEdit',
			name: 'tableEdit',
			component: tableEdit
		},
		{
			path: '/experimentEdit',
			name: 'experimentEdit',
			component: experimentEdit
		},
		{
			path: '/testEdit',
			name: 'testEdit',
			component: testEdit
		},
		{
			path: '/pushEdit',
			name: 'pushEdit',
			component: pushEdit
		},
		{
			path: '/articleList',
			name: 'articleList',
			component: articleList
		},
		{
			path: '/articleEdit',
			name: 'articleEdit',
			component: articleEdit
		},
		{
			path: '/setQuestion',
			component: SetQuestion
		},
		{
			path: '/setAdvice',
			component: SetAdvice
		},
		{
			path: '/statistics',
			component: Statistics
		},
		{
			path: '/questionnaire/:id',
			component: Questionnaire,
			meta: ['添加数据', '添加测试','问卷预览'],
		},
		{
			path: '/success',
			component: Success
		},
		{
			path: '/error',
			component: Error
		},
		{
			path: '/close',
			component: Close
		},
	]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
