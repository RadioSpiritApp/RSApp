/**
 * @author Systango Technologies 
 * Date: Sept 6, 2018
 * Description: CONFIGURABLE TEXT REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	signupWithEmail: null,
	signupWithoutEmail: null,
	freeUserBlockPopup: null,
	subscriptionPlan: null,
	freeUserMyLibrary: null,
	emailVerification: null,
	downloadLimit:0,
};
// This reducer stores the data of configurable text.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.CONFIGURABLE_TEXT:
		return {
			...state,
		};
	case CONST.CONFIGURABLE_TEXT_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			signupWithEmail: action.payload.signup_with_email,
			signupWithoutEmail: action.payload.signup_without_email,
			freeUserBlockPopup: action.payload.free_user_block_popup,
			subscriptionPlan: action.payload.subscription_plan,
			freeUserMyLibrary: action.payload.free_user_my_library,
			emailVerification: action.payload.email_verification,
			downloadLimit: action.payload.download_limit
		};
	case CONST.CONFIGURABLE_TEXT_FAILED:
		return {
			...state,
			message: action.payload.message,
		};
	default: return state;
	}
}
