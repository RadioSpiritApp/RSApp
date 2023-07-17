/**
 * @author Systango Technologies 
 * Date: 
 * Description: EMAIL VERIFICATION SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';
import { stopSpinner } from '../actions/commonAction';
import { emailVerificationSuccess, emailVerificationFailure } from '../actions/emailVerificationAction';
import { getHomepageScreenDataAct } from '../actions/screenDataAction';
import { userLoginSuccess, userLogoutSuccess } from '../actions/signinAction';
import { secureGet } from '../utils/sendJSON';
import tokenExpired from '../utils/tokenExpired';
import * as CONST from '../utils/Const';

// This action communicates with the back-end for the staus of email verification.
export function* emailVerify(action) {
	try {
		const data = yield call(secureGet, 'devices/email_confirmed?udid=' + action.udid);
		if (data.success) {
			yield put(getHomepageScreenDataAct(action.udid, data.user.access_token));
			yield put(userLoginSuccess(data));
			yield put(emailVerificationSuccess(data));
		} else {
			yield put(emailVerificationFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(emailVerificationFailure(error));
		}
		yield put(stopSpinner());
	}
}
