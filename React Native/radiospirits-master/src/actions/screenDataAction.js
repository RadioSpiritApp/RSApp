/**
 * @author Systango Technologies
 * Date: Aug 16, 2018
 * Description: AUTHENTICATION ACTIONS - Get screen data actions
 * 
 */
import * as CONST from '../utils/Const';
import AsyncStorageUtil from '../utils/asyncStore';

// This action saves the authorization token into the async storage.
export function saveAuthToken(authToken) {
	AsyncStorageUtil.setAsyncStorage(CONST.AUTH_TOKEN_KEY, authToken);
}

// This action invokes the getHomepageScreenData action of screenDataSaga for getting the data of home screen from the back-end.
export function getHomepageScreenDataAct(udid = '', access_token = '') {
	let data = {
		udid: udid,
		access_token: access_token
	};
	return {
		type: CONST.GET_HOMEPAGE_DATA,
		data: data,
	};
}
// This action will execute after the success of getHomepageScreenDataAct.
export function homepageScreenDataSuccess(data) {
	return {
		type: CONST.GET_HOMEPAGE_DATA_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getHomepageScreenDataAct.
export function homepageScreenDataFailure(error) {
	return {
		type: CONST.GET_HOMEPAGE_DATA_FAILED,
		payload: error
	};
}

// This action invokes the getBrowseScreenData action of screenDataSaga for getting the data of browse screen from the back-end.
export function getBrowseScreenDataAct(genre_id = '',pageNo = 1) {
	let type = genre_id == '' ? CONST.GET_BROWSE_DATA : CONST.GET_GENRE_BROWSE_DATA;
	return {
		type: type,
		genre_id,
		pageNo,
	};
}
// This action will execute after the success of getBrowseScreenDataAct.
export function browseScreenDataSuccess(data, genre_id) {
	let type = genre_id == '' ? CONST.GET_BROWSE_DATA_SUCCESS : CONST.GET_GENRE_BROWSE_DATA_SUCCESS;
	return {
		type: type,
		payload: data
	};
}
// This action will execute after the failure of getBrowseScreenDataAct.
export function browseScreenDataFailure(error, genre_id) {
	let type = genre_id == '' ? CONST.GET_BROWSE_DATA_FAILED : CONST.GET_GENRE_BROWSE_DATA_FAILED;
	return {
		type: type,
		payload: error
	};
}

// This action invokes the getEpisodeScreenData action of screenDataSaga for getting the data of episode screen from the back-end.
export function getEpisodeScreenDataAct(series_id = '',accessToken = '',pageNo=1) {
	return {
		type: CONST.GET_EPISODE_DATA,
		series_id,
		accessToken,
		pageNo,
	};
}
// This action will execute after the success of getEpisodeScreenDataAct.
export function episodeScreenDataSuccess(data) {
	return {
		type: CONST.GET_EPISODE_DATA_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getEpisodeScreenDataAct.
export function episodeScreenDataFailure(error) {
	return {
		type: CONST.GET_EPISODE_DATA_FAILED,
		payload: error
	};
}

export function resetEpisodeData() {
	return {
		type: CONST.RESET_EPISODE_DATA,
	};
}

// This action invokes the whenRadioWasEpisodeData action of screenDataSaga for getting the data of WhenRadioWas screen from the back-end.
export function getWhenRadioWasEpisodeAct(pageNo=1,lastPlayDate='') {
	return {
		type: CONST.GET_WHEN_RADIO_WAS_EPISODE_DATA,
		pageNo,
		lastPlayDate
	};
}
// This action will execute after the success of getWhenRadioWasEpisodeAct.
export function whenRadioWasEpisodeSuccess(data) {
	return {
		type: CONST.GET_WHEN_RADIO_WAS_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getWhenRadioWasEpisodeAct.
export function whenRadioWasEpisodeFailure(error) {
	return {
		type: CONST.GET_WHEN_RADIO_WAS_FAILED,
		payload: error
	};
}
export function resetWrwData() {
	return {
		type: CONST.RESET_WHEN_RADIO_WAS_EPISODE_DATA,
	};
}

// This action invokes the getGenreScreenData action of screenDataSaga for getting the data of genre screen from the back-end.
export function getGenreScreenDataAct() {
	return {
		type: CONST.GET_GENRE_DATA,
	};
}
// This action will execute after the success of getGenreScreenDataAct.
export function genreScreenDataSuccess(data) {
	return {
		type: CONST.GET_GENRE_DATA_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getGenreScreenDataAct.
export function genreScreenDataFailure(error) {
	return {
		type: CONST.GET_GENRE_DATA_FAILED,
		payload: error
	};
}

export function restoreUserSuccess(data) {
	return {
		type: CONST.RESTORE_USER_SUCCESS,
		payload: data
	};
}

export function resetBrowseEpisode() {
	return {
		type: CONST.RESET_BROWSE_DATA,
	};
}

export function resetGenreBrowseData() {
	return {
		type: CONST.RESET_GENRE_BROWSE_DATA,
	};
}
