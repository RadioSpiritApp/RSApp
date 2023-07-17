/**
 * @author Systango Technologies 
 * Date: Oct 17 2018
 * Description: RECENTLY PLAYED ACTIONS !
 * 
 */
import * as CONST from '../utils/Const';

// This action invokes the recentlyPlayedSaga for getting recent episode from back-end.
export function getRecentEpisodesAct(accessToken, pageNo) {
	return {
		type: CONST.GET_RECENT_EPISODE,
		accessToken,
		pageNo,
	};
}
// This action will execute after the success of getRecentEpisodesAct.
export function getRecentEpisodesSuccess(data) {
	return {
		type: CONST.GET_RECENT_EPISODE_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getRecentEpisodesAct.
export function getRecentEpisodesFailure(error) {
	return {
		type: CONST.GET_RECENT_EPISODE_FAILED,
		payload: error
	};
}

export function resetRecentlyPlayedEpisode() {
	return {
		type: CONST.RESET_RECENT_EPISODE,
	};
}