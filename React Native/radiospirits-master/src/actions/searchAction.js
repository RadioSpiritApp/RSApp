/**
 * @author Systango Technologies
 * Date: Aug 21, 2018
 * Description: SEARCH ACTIONS - SERIES AND EPISODES !
 * 
 */
import * as CONST from '../utils/Const';

// This action invokes the searchSaga for getting the data of searched series from the back-end.
export function searchSeriesAct(keyword,pageNo, sortBy, accessToken='') {
	return {
		type: CONST.SEARCH_SERIES,
		keyword,
		pageNo,
		sortBy,
		accessToken,
	};
}
// This action will execute after the success of searchSeriesAct.
export function searchSeriesSuccess(data) {
	return {
		type: CONST.SEARCH_SERIES_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of searchSeriesAct.
export function searchSeriesFailure(error) {
	return {
		type: CONST.SEARCH_SERIES_FAILED,
		payload: error
	};
}
// This action invokes the searchSaga for getting the data of searched episode from the back-end.
export function searchEpisodeAct(keyword, pageNo, sortBy, accessToken='') {
	return {
		type: CONST.SEARCH_EPISODE,
		keyword,
		pageNo,
		sortBy,
		accessToken,
	};
}
// This action will execute after the success of searchEpisodeAct.
export function searchEpisodeSuccess(data) {
	return {
		type: CONST.SEARCH_EPISODE_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of searchEpisodeAct.
export function searchEpisodeFailure(error) {
	return {
		type: CONST.SEARCH_EPISODE_FAILED,
		payload: error
	};
}
// This action invokes the searchSaga for getting the data of searched when radio was episode from the back-end.
export function searchWhenRadioWasAct(keyword,pageNo) {
	return {
		type: CONST.SEARCH_WHEN_RADIO_WAS_EPISODE,
		keyword,
		pageNo,
	};
}
// This action will execute after the success of searchWhenRadioWasAct.
export function searchWhenRadioWasSuccess(data) {
	return {
		type: CONST.SEARCH_WHEN_RADIO_WAS_EPISODE_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of searchWhenRadioWasAct.
export function searchWhenRadioWasFailure(error) {
	return {
		type: CONST.SEARCH_WHEN_RADIO_WAS_EPISODE_FAILED,
		payload: error
	};
}

export function resetSearchSeries() {
	return {
		type: CONST.RESET_SEARCH_SERIES,
	};
}

export function resetSearchEpisode() {
	return {
		type: CONST.RESET_EPISODE_SERIES,
	};
}

export function resetSearchWhenRadioWasEpisode() {
	return {
		type: CONST.RESET_SEARCH_WHEN_RADIO_WAS_EPISODE,
	};
}