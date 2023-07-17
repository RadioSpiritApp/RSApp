/**
 * @author Systango Technologies 
 * Date: 
 * Description: IN APP PURCHASE SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';
import { stopSpinner } from '../actions/commonAction';
import { getIAPProductsSuccess, getIAPProductsFailure, postIAPProductStatusSuccess, postIAPProductStatusFailure } from '../actions/inAppPurchaseAction';
import { dateCheckStatusUpdate } from '../actions/dateCheckAction';
import { securePost, secureGet } from '../utils/sendJSON';
import { getHomepageScreenDataAct } from '../actions/screenDataAction';
import { socialLoginSuccess, userLogoutSuccess } from '../actions/signinAction';
import { emptyPlayerListAct } from '../actions/playerCommonAction';
import tokenExpired from '../utils/tokenExpired';
import * as CONST from '../utils/Const';

// This action gets the subscribed plans from the back-end.
export function* getIAPProducts(action) {
	try {
		let query = 'subscription_plans?udid=' + action.udid;
		const data = yield call(secureGet, query);
		if (data.success) {
			yield put(getIAPProductsSuccess(data));
		} else {
			yield put(getIAPProductsFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(getIAPProductsFailure(error));
		}
		yield put(stopSpinner());
	}
}

// This action posts a subscription plan to the back-end.
export function* postIAPProductStatus(action) {
	try {
		const data = yield call(securePost, 'subscriptions', action.data);
		if (data.success) {
			yield put(emptyPlayerListAct());
			yield put(getHomepageScreenDataAct(action.data.udid, data.user.access_token));
			yield put(socialLoginSuccess(data));
			yield put(postIAPProductStatusSuccess(data));
		} else {
			yield put(postIAPProductStatusFailure(data));
		}
		yield put(dateCheckStatusUpdate());
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(postIAPProductStatusFailure(error));
		}
		yield put(dateCheckStatusUpdate());
		yield put(stopSpinner());
	}
}
