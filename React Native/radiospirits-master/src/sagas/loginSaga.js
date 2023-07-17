/**
 * @author Systango Technologies 
 * Date: 
 * Description: LOGIN SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';
import {
	createDeviceSuccess, createDeviceFailure,
	signUpSuccess, signUpFailure,
	userLoginSuccess, userLoginFailure,
	userLogoutSuccess, userLogoutFailure,
	referenceIdFailure, referenceIdSuccess,
} from '../actions/signinAction';
import { securePost, secureGet } from '../utils/sendJSON';
import { stopSpinner, startSpinner } from '../actions/commonAction';
import { getHomepageScreenDataAct } from '../actions/screenDataAction';
import { dateCheckStatusUpdate } from '../actions/dateCheckAction';
import tokenExpired from '../utils/tokenExpired';
import * as CONST from '../utils/Const';

export function* createDevice(action) {
	try {
		const data = yield call(securePost, 'devices/create', action.data);
		if (data.success) {
			let udid = action.data.device.udid;
			//TODO remove this, this is for testing home page landing 
			//if(1){
			if (data.redirect_to.toUpperCase() == 'HOMEPAGE') {
				if (data.user && data.user.access_token) {
					yield put(userLoginSuccess(data));
					yield put(getHomepageScreenDataAct(udid, data.user.access_token));
				}
				yield put(getHomepageScreenDataAct(udid));
			}
			yield put(createDeviceSuccess(data));
		} else {
			yield put(createDeviceFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		yield put(createDeviceFailure(error));
		yield put(stopSpinner());
	}
}

export function* userSignUp(action) {
	try {
		const data = yield call(securePost, 'users/sign_up', action.data);
		yield put(signUpSuccess(data));
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(signUpFailure(error));
		}
		yield put(stopSpinner());
	}
}

export function* userLogin(action) {
	let userdata = {};
	userdata['user'] = {
		email: action.email,
		udid: action.udid,
	};
	try {
		const data = yield call(securePost, 'users/sign_up', userdata);
		if (data.success) {
			yield put(getHomepageScreenDataAct(action.udid, data.user.access_token));
			yield put(userLoginSuccess(data));
		} else {
			yield put(userLoginFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(userLoginFailure(error));
		}
		yield put(stopSpinner());
	}
}

export function* rvUserLogin(action) {
	try {
		const data = yield call(securePost, 'users/rv_login', { email: action.email, password: action.password, udid: action.udid });
		if (data.success) {
			yield put(getHomepageScreenDataAct(action.udid, data.user.access_token));
			yield put(userLoginSuccess(data));
		} else {
			yield put(userLoginFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(userLoginFailure(error));
		}
		yield put(stopSpinner());
	}
}

export function* userLogout(action) {
	try {
		const data = yield call(securePost, 'users/logout', action.userData);
		if (data.success) {
			yield put(userLogoutSuccess(data));
		} else {
			yield put(userLogoutFailure(data));
		}
		yield put(dateCheckStatusUpdate());
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(userLogoutFailure(error));
		}
		yield put(dateCheckStatusUpdate());
		yield put(stopSpinner());
	}
}

export function* referenceId(action) {
	let query = 'devices/reference_id?device[udid]=' + action.udid;
	try {
		yield put(startSpinner());
		const data = yield call(secureGet, query);
		if (data.success) {
			yield put(referenceIdSuccess(data));
		} else {
			yield put(referenceIdFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		yield put(referenceIdFailure(error));
		yield put(stopSpinner());
	}
}