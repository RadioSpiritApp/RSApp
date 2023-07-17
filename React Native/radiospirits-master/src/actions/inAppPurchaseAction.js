/**
 * @author Systango Technologies
 * Date: Sept 4, 2018
 * Description: IN APP PURCHASE!
 * 
 */
import * as CONST from '../utils/Const';

// This action invokes the getIAPProducts action of inAppPurchaseSaga for getting the data of currently subscribed plans of user from back-end.
export function getSubscriptionPlans(udid) {
	return {
		type: CONST.GET_IAP_PRODUCTS,
		udid 
	};
}
// This action will execute after the success of getSubscriptionPlans.
export function getIAPProductsSuccess(data) {
	return {
		type: CONST.GET_IAP_PRODUCTS_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getSubscriptionPlans.
export function getIAPProductsFailure(error) {
	return {
		type: CONST.GET_IAP_PRODUCTS_FAILED,
		payload: error
	};
}
// This action invokes the postIAPProductStatus action of inAppPurchaseSaga for posting a subcribed plan for the user to the back-end.
export function postIAPProductStatusAct(data) {
	return {
		type: CONST.POST_IAP_STATUS,
		data,
	};
}
// This action will execute after the success of postIAPProductStatusAct.
export function postIAPProductStatusSuccess(data) {
	return {
		type: CONST.POST_IAP_STATUS_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of postIAPProductStatusAct.
export function postIAPProductStatusFailure(error) {
	console.log("@@@@@@@@@@@@@@ postIAPProductStatusFailure",error);
	return {
		type: CONST.POST_IAP_STATUS_FAILED,
		payload: error
	};
}


