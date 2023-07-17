/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: USER DETAIL REDUCER !
 * 
 */

import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	logoutStatus: false,
	logoutMessage: '',
	user: null,
	user_confirmed: false,
	referenceIdMessage: '',
	referenceIdStatus: false,
	referenceId: '',
};
// This reducer stores the data of user details.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.USER_SIGNUP:
	case CONST.SOCIAL_LOGIN:
	case CONST.USER_LOGIN:
	case CONST.RV_USER_LOGIN:
		return {
			...state,
			status: false,
			message: '',
			logoutStatus: false,
			logoutMessage: '',
			user: null,
			user_confirmed: false,
		};
	case CONST.USER_SIGNUP_SUCCESS:
	case CONST.USER_LOGIN_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			user: action.payload.user,
			user_confirmed: action.payload.user_confirmed,
			logoutStatus: false,
			logoutMessage: '',
		};
	case CONST.USER_SIGNUP_FAILED:
	case CONST.USER_LOGIN_FAILED:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
		};
	case CONST.USER_LOGOUT_SUCCESS:
		return {
			...state,
			status: false,
			message: '',
			user: null,
			logoutStatus: action.payload.success,
			logoutMessage: action.payload.message,
		};
	case CONST.USER_LOGOUT_FAILED:
		return {
			...state,
			logoutStatus: action.payload.success,
			logoutMessage: action.payload.message,
		};
	case CONST.RESTORE_USER_SUCCESS:
		return {
			...state,
			user: action.payload,
		};
	case CONST.REFERENCE_ID_SUCCESS:
		return {
			...state,
			referenceIdStatus: action.payload.success,
			referenceIdMessage: action.payload.message,
			referenceId: action.payload.reference_id,
		};
	case CONST.REFERENCE_ID_FAILED:
		return {
			...state,
			referenceIdStatus: action.payload.success,
			referenceIdMessage: action.payload.message,
			referenceId: '',
		};
	default: return state;
	}
}
