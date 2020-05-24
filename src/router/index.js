import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addArticle = r => require.ensure([], () => r(require('@/page/addArticle')), 'addArticle');
const addTests = r => require.ensure([], () => r(require('@/page/addTests')), 'addTests');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const articleList = r => require.ensure([], () => r(require('@/page/articleList')), 'articleList');
const testList = r => require.ensure([], () => r(require('@/page/testList')), 'testList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const SetQuestion = r => require.ensure([], () => r(require('@/page/SetQuestion')), 'SetQuestion');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');
const Statistics = r => require.ensure([], () => r(require('@/page/Statistics')), 'Statistics');
const Questionnaire = r => require.ensure([], () => r(require('@/page/Questionnaire')), 'Questionnaire');
const Success = r => require.ensure([], () => r(require('@/page/Success')), 'Success');
const Error = r => require.ensure([], () => r(require('@/page/Error')), 'Error');
const Close = r => require.ensure([], () => r(require('@/page/Close')), 'Close');


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
			path: '/addArticle',
			component: addArticle,
			meta: ['添加数据', '添加推送'],
		},{
			path: '/addTests',
			component: addTests,
			meta: ['添加数据', '添加测试'],
		},{
			path: '/userList',
			component: userList,
			meta: ['数据管理', '用户列表'],
		},{
			path: '/articleList',
			component: articleList,
			meta: ['数据管理', '推送列表'],
    	},
    	{
			path: '/testList',
			component: testList,
			meta: ['数据管理', '测试数据'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
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
			path: '/setQuestion',
			component: SetQuestion
		},
		{
			path: '/statistics',
			component: Statistics
		},
		{
			path: '/questionnaire/:id',
			component: Questionnaire
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
