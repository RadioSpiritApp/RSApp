/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: IN APP PURCHASE REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState ={
	inAppPostStatus: false,
	inAppPostMessage: '',
	inAppStatus: false,
	inAppMessage: '',
	plans: [],
	all_plans: [],
	redirect_to: null,
};

// This reducer stores the data of products of In app purchase.
export default function(state = initialState, action){
	switch(action.type){
	case CONST.GET_IAP_PRODUCTS:	
		return{
			...state,
			inAppStatus: false,
			inAppMessage: '',
			inAppPostStatus: false,
			inAppPostMessage: '',
			plans: [],
			all_plans: [],
		};
	case CONST.GET_IAP_PRODUCTS_SUCCESS:
		return{
			...state,
			inAppStatus: action.payload.success,
			inAppMessage: action.payload.message, 
			plans: action.payload.plans,
			all_plans: action.payload.all_plans,
		};
	case CONST.GET_IAP_PRODUCTS_FAILED:
		return{
			...state,
			inAppStatus: action.payload.success,
			inAppMessage: action.payload.message, 
		};
	case CONST.POST_IAP_STATUS:	
		return{
			...state,
			inAppPostStatus: false,
			inAppPostMessage: '',
		};
	case CONST.POST_IAP_STATUS_SUCCESS:
		return{
			...state,
			inAppPostStatus: action.payload.success,
			inAppPostMessage: action.payload.message, 
			redirect_to: action.payload.redirect_to,
		};
	case CONST.POST_IAP_STATUS_FAILED:
		return{
			...state,
			inAppPostStatus: action.payload.success,
			inAppPostMessage: action.payload.message, 
			redirect_to: action.payload.redirect_to,
		};
	default: return state;
	}	
}
