/**
 * @author Systango Technologies 
 * Date: Sept 27 2018
 * Description: COMMON ACTION FOR BOTH FREE AND PREMIUM OLAYER!
 * 
 */
import * as CONST from '../utils/Const';
import RNFetchBlob from 'react-native-fetch-blob';

// This action dispatches the episode list for free player.
export function freeEpisodeList(data) {
	return {
		type: CONST.FREE_EPISODE_LIST,
		payload: data,
	};
}

// This action will get audio url and details for free user
export function getPlayerDataAct(audioDetails, udid, allData, includeBookmark = false) {
	return {
		type: CONST.GET_FREE_PLAYER_DATA,
		audioId: audioDetails.id,
		udid,
		allData,
		includeBookmark
	};
}

// This action will get audio url and details for subscribed user
export function getPremiumPlayerDataAct(audioDetails, udid, accessToken, allData, includeBookmark = false) {
	return {
		type: CONST.GET_PREMIUM_PLAYER_DATA,
		audioId: audioDetails.id,
		udid,
		accessToken,
		allData,
		includeBookmark,
	};
}

export function changeState(isPlay) {
	return {
		type: CONST.CHANGE_PLAYER_STATE,
		payload: {
			isPlay,
		},
	};
}

export function updatePlayerAudioList(audioList, playerObject, resetEnable = true) {
	return {
		type: CONST.UPDATE_PLAYER_AUDIO_LIST,
		payload: {
			audioList,
			playerObject,
		},
		resetEnable,
	};
}

export function updateResetEnable(resetEnable) {
	return {
		type: CONST.UPDATE_RESET_ENABLE,
		resetEnable,
	};
}

export function emptyPlayerListAct() {
	return {
		type: CONST.EMPTY_PLAYER_LIST,
	};
}

export function updatePlayerVolumeAct(playerVolume) {
	return {
		type: CONST.UPDATE_PLAYER_VOLUME,
		payload: {
			playerVolume,
		},
	};
}

export function playAllEpisodeAct(accessToken, udid, seriesId) {
	return {
		type: CONST.PLAY_ALL_EPISODE,
		accessToken,
		udid,
		seriesId,
	};
}

export function updateCurrentAudioDetail(data) {
	return {
		type: CONST.UPDATE_CURRENT_AUDIO,
		payload: data,
	};
}

export function playAllEpisodeFailure(error) {
	return {
		type: CONST.PLAY_ALL_EPISODE_FAILED,
		payload: error,
	};
}

export function emptyPlayerStatus() {
	return { 
		type: CONST.EMPTY_PLAYER_STATUS,
	};
}

export function playerAudioDataFailure(error) {
	return {
		type: CONST.PLAYER_AUDIO_DATA_FAILURE,
		payload: error,
	};
}
export function getPremiumPlayerOfflineAct(item, resetEnable = true) {
	let url = 'file://' + RNFetchBlob.fs.dirs.DocumentDir + item.url;
	let artwork = null;
	if(item.artwork) {
		artwork = 'file://' + RNFetchBlob.fs.dirs.DocumentDir + item.artwork;
	}
	let isplayFromDownload = true;
	let playerObject = {...item,url,artwork,isplayFromDownload};
	let audioList = [playerObject];

	return {
		type: CONST.UPDATE_PLAYER_AUDIO_LIST,
		payload: {
			audioList,
			playerObject
		},
		resetEnable,
	};
}

export function updateStreamCountAct(episodeId) {
	return {
		type: CONST.UPDATE_STREAM_COUNT,
		episodeId,
	};
}