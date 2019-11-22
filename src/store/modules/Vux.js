import {SCROLL_STATUS} from './types'
export default{
	state:{
		isLoading:false,	//loding图标
		isScroll:false,		//暂时没没用上
		hasHeade:true,		//有没有头部
		hasMess:false,		//有没有未读消息
        sysUnreadNum:0,			//未读系统消息数量
        commentUnreadNum:0,		//未读评论消息
        aiteUnreadNum:0,		//未读被@消息
        tabArr:1,		//导航
	},
	getters:{
		// getAccid:function(state){
		// 	return state.accid;
		// }
	},
	mutations:{
		updateLoadingStatus(state,payload){
			state.isLoading=payload.isLoading
		},
		updateHasHeader(state,obj){
			state.hasHeade=obj.hasHeade
		},
		updateHasMess(state,obj){
			state.hasMess=obj.hasMess
		},
		updateCommentUnreadNum(state,obj){
			state.commentUnreadNum=obj.commentUnreadNum
		},
		updateSysUnreadNum(state,obj){
			state.sysUnreadNum=obj.sysUnreadNum
		},
		updateaiteUnreadNum(state,obj){
			state.aiteUnreadNum=obj.aiteUnreadNum
		},
		uptabArr(state,obj){
			state.tabArr=obj.tabArr
		},
		// updateisScrollStatus(state,payload){
		// 	state.isScroll=payload.isScroll
		// }
		[SCROLL_STATUS](state,obj){
			state.isScroll=obj.isScroll
		},
	},
	actions:{
		scrollC({commit},obj){
			commit(SCROLL_STATUS,obj);
		},
	}
}