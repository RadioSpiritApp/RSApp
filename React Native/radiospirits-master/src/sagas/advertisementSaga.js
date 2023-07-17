/**
 * @author Systango Technologies 
 * Date: 
 * Description: ADVERTISEMENT SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';

import { stopSpinner } from '../actions/commonAction';
import { getAdvertisementSuccess, getAdvertisementFailure } from '../actions/advertisementAction';
import { secureGet } from '../utils/sendJSON';
import tokenExpired from '../utils/tokenExpired';
import { userLogoutSuccess } from '../actions/signinAction';
import * as CONST from '../utils/Const';

// This action communicates with the back-end for advertisement data.
export function* getAdvertisements() {
	try {
		const data = yield call(secureGet, 'advertisements');
		if (data.success) {
			yield put(getAdvertisementSuccess(data));
		} else {
			yield put(getAdvertisementFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(getAdvertisementFailure(error));
		}
		yield put(stopSpinner());
	}
}
