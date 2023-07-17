/**
 * @author Systango Technologies
 * Date: Aug 9, 2018
 * Description: AUTHENTICATION ACTIONS - LOGIN,SIGNUP, AND LOGOUT !
 * 
 */
import * as CONST from '../utils/Const';
import AsyncStorageUtil from '../utils/asyncStore';

// This action saves the authorization token into the async storage.
export function saveAuthToken(authToken) {
	AsyncStorageUtil.setAsyncStorage(CONST.AUTH_TOKEN_KEY, authToken);
}
// This action saves the user object into the async storage.
export function saveUserObject(userObj) {
	AsyncStorageUtil.setAsyncStorage(CONST.USER_OBJECT, userObj);
}

export function socialLoginSuccess(data) {
	if (data.user && data.user.access_token) {
		saveAuthToken(data.user.access_token);
		saveUserObject(JSON.stringify(data.user));
	}
	return {
		type: CONST.USER_SIGNUP_SUCCESS,
		payload: data
	};
}
export function socialLoginFailure(error) {
	return {
		type: CONST.USER_SIGNUP_FAILED,
		payload: error
	};
}

export function createDeviceAct(device_info) {
	return {
		type: CONST.CREATE_DEVICE,
		data: device_info,
	};
}
export function createDeviceSuccess(data) {
	return {
		type: CONST.CREATE_DEVICE_SUCCESS,
		payload: data
	};
}
export function createDeviceFailure(error) {
	return {
		type: CONST.CREATE_DEVICE_FAILED,
		payload: error,
	};
}

export function signUpAct(userData) {
	return {
		type: CONST.USER_SIGNUP,
		data: userData,
	};
}
export function signUpSuccess(data) {
	if (data.user && data.user.access_token) {
		saveAuthToken(data.user.access_token);
		saveUserObject(JSON.stringify(data.user));
	}
	return {
		type: CONST.USER_SIGNUP_SUCCESS,
		payload: data
	};
}
export function signUpFailure(error) {
	return {
		type: CONST.USER_SIGNUP_FAILED,
		payload: error,
	};
}

export function userLoginAct(email, udid) {
	return {
		type: CONST.USER_LOGIN,
		email: email,
		udid: udid,
	};
}
export function rvUserLoginAct(email, password, udid) {
	return {
		type: CONST.RV_USER_LOGIN,
		email: email,
		password: password,
		udid: udid,
	};
}
export function userLoginSuccess(data) {
	if (data.user && data.user.access_token) {
		saveAuthToken(data.user.access_token);
		saveUserObject(JSON.stringify(data.user));
	}
	return {
		type: CONST.USER_LOGIN_SUCCESS,
		payload: data
	};
}
export function userLoginFailure(error) {
	return {
		type: CONST.USER_LOGIN_FAILED,
		payload: error,
	};
}

export function userLogoutAct(userData) {
	return {
		type: CONST.USER_LOGOUT,
		userData: userData
	};
}
export function userLogoutSuccess(data) {
	return {
		type: CONST.USER_LOGOUT_SUCCESS,
		payload: data
	};
}
export function userLogoutFailure(error) {
	return {
		type: CONST.USER_LOGOUT_FAILED,
		payload: error
	};
}
export function referenceIdAct(udid) {
	return {
		type: CONST.REFERENCE_ID,
		udid,
	};
}
export function referenceIdSuccess(data) {
	return {
		type: CONST.REFERENCE_ID_SUCCESS,
		payload: data
	};
}
export function referenceIdFailure(error) {
	return {
		type: CONST.REFERENCE_ID_FAILED,
		payload: error,
	};
}