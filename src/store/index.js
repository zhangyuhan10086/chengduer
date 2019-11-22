import Vue from "vue"
import Vuex from "vuex"
import moduleUser from './modules/User.js';
import moduleVux from './modules/Vux.js';
Vue.use(Vuex)


export default new Vuex.Store({  
	modules : {
		user: moduleUser,
		vux: moduleVux
	}
});
