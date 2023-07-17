/**
 * @author 
 * Date: Sept 27 2018
 *
 * COMMON PLAYER REDUCER !
 *
 */
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	isPlay: false,
	playerObject: null,
	freeEpisodeList: null,
	audioList: [],
	playerVolume: 0.5,
	resetEnable: true
};

export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.EMPTY_PLAYER_STATUS:
		return {
			...state,
			status: false,
			message: ''
		};
	case CONST.FREE_EPISODE_LIST:
		return {
			...state,
			freeEpisodeList: action.payload,
		};
	case CONST.CHANGE_PLAYER_STATE:
		return {
			...state,
			isPlay : action.payload.isPlay,
		};
	case CONST.UPDATE_PLAYER_AUDIO_LIST:
		return {
			...state,
			playerObject: action.payload.playerObject,
			audioList : action.payload.audioList,
			resetEnable: action.resetEnable,
		};	
	case CONST.EMPTY_PLAYER_LIST:
		return {
			...state,
			playerObject: null,
			audioList: [],
		};
	case CONST.UPDATE_PLAYER_VOLUME:
		return {
			...state,
			playerVolume: action.payload.playerVolume,
		};
	case CONST.UPDATE_CURRENT_AUDIO:
		return {
			...state,
			playerObject: action.payload,
		};
	case CONST.PLAY_ALL_EPISODE_FAILED:
		return {
			...state,
			playerObject: action.payload.playerObject,
			audioList : action.payload.audioList,
		};	
	case CONST.PLAYER_AUDIO_DATA_FAILURE:
		return {
			...state,
			status:action.payload.status,
			message:action.payload.message,
		};
	case CONST.UPDATE_RESET_ENABLE:
		return {
			...state,
			resetEnable: action.resetEnable,
		};	
	default: return state;
	}
}
