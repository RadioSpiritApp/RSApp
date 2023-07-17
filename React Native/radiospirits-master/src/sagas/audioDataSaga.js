/**
 * @author Systango Technologies 
 * Date: 20 Sep 2018
 * Description: GET AUDIO DATA SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';
import Validators from '../utils/Validator';
import { changeState, updatePlayerAudioList, playAllEpisodeFailure } from '../actions/playerCommonAction';
import { secureGet, securePost } from '../utils/sendJSON';
import { startSpinner, stopSpinner } from '../actions/commonAction';
import { emptyPlayerStatus, playerAudioDataFailure, freeEpisodeList, updateStreamCountAct } from '../actions/playerCommonAction';
import tokenExpired from '../utils/tokenExpired';
import { userLogoutSuccess } from '../actions/signinAction';
import * as CONST from '../utils/Const';

export function* getFreePlayeAudioData(action) {
	try {
		yield put(startSpinner());
		yield put(emptyPlayerStatus());
		let query = 'episodes/play_episode?device_udid=' + action.udid + '&episode[id]=' + action.audioId + '&include_bookmark=' + action.includeBookmark;
		let data = yield call(secureGet, query);
		if (data.success) {
			let audioList = [];
			if (data.episode && data.episode.url && data.episode.url != '') {
				let decryptedUrl = Validators.decrypt(data.episode.url);
				data.episode.url = decryptedUrl;
				if (data.episode.advertisement && data.episode.advertisement.url && data.episode.advertisement.url != '') {
					let decryptedUrl = Validators.decrypt(data.episode.advertisement.url);
					data.episode.advertisement.url = decryptedUrl;
					data.episode.advertisement.play_date = data.episode.play_date;
					audioList.push(data.episode.advertisement);
				}
				audioList.push(data.episode);
				yield put(updatePlayerAudioList(audioList, data.episode.advertisement ? data.episode.advertisement : data.episode, true));
				if (action.allData) {
					yield put(freeEpisodeList(action.allData));
				}
				yield put(changeState(true));
			}
			else {
				yield put(playerAudioDataFailure({ status: false, message: 'No audio url available' }));
			}
		} else {
			yield put(playerAudioDataFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(playerAudioDataFailure(error));
		}
		yield put(stopSpinner());
	}
}

export function* getPremiumPlayeAudioData(action) {
	let query = 'episodes/play_episode?user[access_token]=' + action.accessToken + '&device_udid=' + action.udid + '&episode[id]=' + action.audioId + '&include_bookmark=' + action.includeBookmark;
	try {
		yield put(startSpinner());
		yield put(emptyPlayerStatus());
		const data = yield call(secureGet, query);
		if (data.success) {
			let audioList = [];
			if (data.episode && data.episode.url && data.episode.url != '') {
				let decryptedUrl = Validators.decrypt(data.episode.url);
				data.episode.url = decryptedUrl;
				audioList.push(data.episode);
				yield put(updatePlayerAudioList(audioList, data.episode, true));
				if (action.allData) {
					yield put(freeEpisodeList(action.allData));
				}
				yield put(changeState(true));
			}
			else {
				yield put(playerAudioDataFailure({ status: false, message: 'No audio url available' }));
			}
		} else {
			yield put(playerAudioDataFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(playerAudioDataFailure(error));
		}
		yield put(stopSpinner());
	}
}

export function* playAllEpisodeData(action) {
	try {
		yield put(startSpinner());
		yield put(emptyPlayerStatus());
		let query = 'episodes/play_all?user[access_token]=' + action.accessToken + '&device_udid=' + action.udid + '&episode[series_id]=' + action.seriesId;
		const data = yield call(secureGet, query);
		if (data.success) {
			let audioList = [];
			let index = 0;
			let prev;
			let next;
			for (let i in data.episode) {
				if (data.episode[i].url && data.episode[i].url != '') {
					data.episode[i].url = Validators.decrypt(data.episode[i].url);
					audioList[index] = data.episode[i];
					index++;
				}
			}
			for (let i = 0; i < audioList.length; i++) {
				prev = audioList[i - 1] ? true : false;
				next = audioList[i + 1] ? true : false;
				audioList[i]['isPrev'] = prev;
				audioList[i]['isNext'] = next;
			}
			yield put(updatePlayerAudioList(audioList, audioList[0], true));
			yield put(changeState(true));
		} else {
			yield put(playAllEpisodeFailure(data));
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		yield put(stopSpinner());
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			yield put(userLogoutSuccess(CONST.LOGOUT_OBJECT));
		}
		else {
			yield put(playAllEpisodeFailure(error));
		}
		yield put(stopSpinner());
	}
}

export function* updateStreamCount(action) {
	try {
		let query = 'episodes/update_stream_count';	
		yield call(securePost, query, { episode_id: action.episodeId });
	} catch (error) {
		if (error.status == 401 || error.status == 403) {
			tokenExpired(error.message);
			console.log('update stream count falied ',error.message);
		}
		else {
			console.log('update stream count falied ',error.message);
		}
	}
}
