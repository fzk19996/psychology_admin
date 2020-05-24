import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'
import Questionnaire from './questionnaire'
import QuestionnaireEach from './questionnaireEach'
import QuestionnaireTemplate from './questionnaireTemplate'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},

   
  
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	},

    /*modal.vue --start--*/
    closeModal(state){
      state.isFromSubmit=false;
      state.isFromFill=false;
      state.hasCancel=false;
      state.isOpenModal = false;
      state.isDeleteSubmit = false;
      state.isDeleteSaved = false;
      state.isToIndex=false;
    },
 }
const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			}else{
				throw new Error(res.type)
			}
		}catch(err){
			// console.log(err.message)
		}
	},
	//modal点击确定
	confirm({commit,state}){
		if(state.isFromSubmit){
			commit('confirmSubmit')
		}
		if(state.isFromFill){
			commit('confirmFill')
		}
		if(state.isDeleteSaved){
			commit('confirmDeleteSaved');
			commit('updateSurveyList')
		}
		if(state.isDeleteSubmit){
			commit('confirmDeleteSubmit');
			commit('updateSurveyList')
		}
		commit('closeModal')
	}
}

export default new Vuex.Store({
	state,
	actions,
  	mutations,
  strict: process.env.NODE_ENV !== 'production', //在非生产环境下，使用严格模式
  modules: {
    QuestionnaireEach,
    QuestionnaireTemplate,
    Questionnaire
  },

})
