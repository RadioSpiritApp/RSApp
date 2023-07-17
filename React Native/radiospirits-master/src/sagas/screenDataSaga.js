/**
 * @author Systango Technologies 
 * Date: 
 * Description: SCREEN DATA SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';
import {
	homepageScreenDataSuccess,
	homepageScreenDataFailure,
	browseScreenDataSuccess,
	browseScreenDataFailure,
	episodeScreenDataFailure,
	episodeScreenDataSuccess,
	genreScreenDataSuccess,
	genreScreenDataFailure,
	whenRadioWasEpisodeFailure,
	whenRadioWasEpisodeSuccess
} from '../actions/screenDataAction';
import { secureGet } from '../utils/sendJSON';
import { stopSpinner } from '../actions/commonAction';
import tokenExpired from '../utils/tokenExpired';
import { userLogoutSuccess } from '../actions/signinAction';
import * as CONST from '../utils/Const';

// This action communicates with the back-end for home screen data.
export function* getHomepageScreenData(action) {
	try {
		let query = '?user[udid]=' + action.data.udid;
		if (action.data.access_token != '') {
			query = query + '&user[access_token]=' + action.data.access_token;
		}
		const data = yield call(secureGet, 'pages/homepage' + query);
		if (data.success) {
			yield put(homepageScreenDataSuccess(data));
		} else {
			yield put(homepageScreenDataFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(homepageScreenDataFailure(error));
		}
		yield put(stopSpinner());
	}
}
// This action communicates with the back-end for browse screen data.
export function* getBrowseScreenData(action) {
	try {
		let query = '?series[page]=' + action.pageNo;
		if (action.genre_id != '') {
			query = query + '&series[genre_id]=' + action.genre_id;
		}
		const data = yield call(secureGet, 'series' + query);
		if (data.success) {
			yield put(browseScreenDataSuccess(data, action.genre_id));
		} else {
			yield put(browseScreenDataFailure(data, action.genre_id));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(browseScreenDataFailure(error, action.genre_id));
		}
		yield put(stopSpinner());
	}
}

// This action communicates with the back-end for episode screen data.
export function* getEpisodeScreenData(action) {
	try {
		let query = '';
		if (action.series_id != '') {
			query += query + '?episode[series_id]=' + action.series_id + '&sort_by=original_air_date' + '&user[access_token]=' + action.accessToken + '&episode[page]=' + action.pageNo;
		}
		const data = yield call(secureGet, 'episodes' + query);
		if (data.success) {
			yield put(episodeScreenDataSuccess(data));
		} else {
			yield put(episodeScreenDataFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(episodeScreenDataFailure(error));
		}
		yield put(stopSpinner());
	}
}

// This action communicates with the back-end for WhenRadioWas screen data.
export function* whenRadioWasEpisodeData(action) {
	try {
		let query = 'episodes/when_radio_was?episode[page]=' + action.pageNo+'&episode[last_play_date]='+action.lastPlayDate;
		const data = yield call(secureGet, query);
		if (data.success) {
			yield put(whenRadioWasEpisodeSuccess(data));
		} else {
			yield put(whenRadioWasEpisodeFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(whenRadioWasEpisodeFailure(error));
		}
		yield put(stopSpinner());
	}
}

// This action communicates with the back-end for genre screen data.
export function* getGenreScreenData() {
	try {
		const data = yield call(secureGet, 'genres');
		if (data.success) {
			yield put(genreScreenDataSuccess(data));
		} else {
			yield put(genreScreenDataFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(genreScreenDataFailure(error));
		}
		yield put(stopSpinner());
	}
}
