/**
 * @author Systango Technologies 
 * Date: Oct 7 2018
 * Description: BOOKMARK ACTIONS !
 * 
 */
import * as CONST from '../utils/Const';

// This action invokes the bookMarkSaga for posting the seektime of episode to back-end.
export function postSeekTimeAct(accessToken,episodeId,seekTime) {
	let data = {
		seek_time: seekTime,
		episode_id: episodeId,
		user:{
			access_token: accessToken
		},
	};
	return {
		type: CONST.POST_SEEK_TIME,
		data:data, 
	};
}
// This action will execute after the success of postSeekTimeAct.
export function postSeekTimeSuccess(data) {
	return {
		type: CONST.POST_SEEK_TIME_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of postSeekTimeAct.
export function postSeekTimeFailure(error) {
	return {
		type: CONST.POST_SEEK_TIME_FAILED,
		payload: error
	};
}