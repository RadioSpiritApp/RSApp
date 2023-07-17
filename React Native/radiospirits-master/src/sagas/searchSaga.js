/**
 * @author Systango Technologies 
 * Date: 
 * Description: SEARCH SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';
import { stopSpinner } from '../actions/commonAction';
import { searchEpisodeSuccess, searchEpisodeFailure, searchSeriesSuccess, searchSeriesFailure, searchWhenRadioWasSuccess, searchWhenRadioWasFailure } from '../actions/searchAction';
import { secureGet } from '../utils/sendJSON';
import tokenExpired from '../utils/tokenExpired';
import { userLogoutSuccess } from '../actions/signinAction';
import * as CONST from '../utils/Const';

// This action communicates with the back-end for searched series data for browse screen.
export function* searchSeries(action) {
	try {
		
		let query = 'episodes/search_episodes?episodes[search_string]=' + action.keyword + '&episodes[page]=' + action.pageNo + '&sort_by=' + action.sortBy + '&user[access_token]=' + action.accessToken;
		let data = yield call(secureGet, query);
		if (data.success) {
			yield put(searchEpisodeSuccess(data));
		} else {
			yield put(searchEpisodeFailure(data));
		}

		query = 'episodes/search_when_radio_was?episodes[search_string]=' + action.keyword + '&episodes[page]=' + action.pageNo;
		data = yield call(secureGet, query);
		if (data.success) {
			yield put(searchWhenRadioWasSuccess(data));
		} else {
			yield put(searchWhenRadioWasFailure(data));
		}
		
		query = 'series/search_series?series[search_string]=' + action.keyword + '&series[page]=' + action.pageNo;
		data = yield call(secureGet, query);
		if (data.success) {
			yield put(searchSeriesSuccess(data));
		} else {
			yield put(searchSeriesFailure(data));
		}

		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(searchSeriesFailure(error));
			yield put(searchEpisodeFailure(error));
			yield put(searchWhenRadioWasFailure(error));
		}
		yield put(stopSpinner());
	}
}
// This action communicates with the back-end for searched episode data for browse screen.
export function* searchEpisode(action) {
	try {
		let query = 'episodes/search_episodes?episodes[search_string]=' + action.keyword + '&episodes[page]=' + action.pageNo + '&sort_by=' + action.sortBy + '&user[access_token]=' + action.accessToken;
		const data = yield call(secureGet, query);
		if (data.success) {
			yield put(searchEpisodeSuccess(data));
		} else {
			yield put(searchEpisodeFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(searchEpisodeFailure(error));
		}
		yield put(stopSpinner());
	}
}
// This action communicates with the back-end for searched when radio was episode data for browse screen.
export function* searchWhenRadioWas(action) {
	try {
		let query = 'episodes/search_when_radio_was?episodes[search_string]=' + action.keyword + '&episodes[page]=' + action.pageNo;
		const data = yield call(secureGet, query);
		if (data.success) {
			yield put(searchWhenRadioWasSuccess(data));
		} else {
			yield put(searchWhenRadioWasFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(searchWhenRadioWasFailure(error));
		}
		yield put(stopSpinner());
	}
}
