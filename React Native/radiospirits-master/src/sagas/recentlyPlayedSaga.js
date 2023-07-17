/**
 * @author Systango Technologies 
 * Date: OCT 17 2018
 * Description: RECENT EPISODE SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';

import { stopSpinner } from '../actions/commonAction';
import { getRecentEpisodesSuccess, getRecentEpisodesFailure } from '../actions/recentlyPlayedAction';
import { secureGet } from '../utils/sendJSON';
import tokenExpired from '../utils/tokenExpired';
import { userLogoutSuccess } from '../actions/signinAction';
import * as CONST from '../utils/Const';

// This action communicates with the back-end for getting recent episodes data.
export function* getRecentEpisodes(action) {
	let query = 'episodes/recent_episodes?user[access_token]=' + action.accessToken + '&page=' + action.pageNo;
	try {
		const data = yield call(secureGet, query);
		if (data.success) {
			yield put(getRecentEpisodesSuccess(data));
		} else {
			yield put(getRecentEpisodesFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(getRecentEpisodesFailure(error));
			console.log('@@@@@@@@@@@@@getRecentEpisodesFailure', error);
		}
		yield put(stopSpinner());
	}
}
