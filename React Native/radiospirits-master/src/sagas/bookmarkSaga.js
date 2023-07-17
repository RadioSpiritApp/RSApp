/**
 * @author Systango Technologies 
 * Date: 
 * Description: BOOMARK SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';

import { stopSpinner } from '../actions/commonAction';
import { postSeekTimeFailure, postSeekTimeSuccess } from '../actions/bookmarkAction';
import { securePost } from '../utils/sendJSON';
import tokenExpired from '../utils/tokenExpired';
import { userLogoutSuccess } from '../actions/signinAction';
import * as CONST from '../utils/Const';

// This action communicates with the back-end for seekTime data.
export function* postSeekTime(action) {
	try {
		const data = yield call(securePost, 'episodes/bookmark', action.data);
		if (data.success) {
			yield put(postSeekTimeSuccess(data));
		} else {
			yield put(postSeekTimeFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(postSeekTimeFailure(error));
			console.log('@@@@@@@@@@@@@postSeekTimeFailure', error);
		}
		yield put(stopSpinner());
	}
}
