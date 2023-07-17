/**
 * @author Systango Technologies
 * Date: Oct 1, 2018
 * Description: DOWNLOAD EPISODE ACTIONS !
 * 
 */

import * as CONST from '../utils/Const';
import Validators from '../utils/Validator';
import RNFetchBlob from 'react-native-fetch-blob';

// This action invokes the 
export function downloadEpisodeAct(access_token, udid, id, wrwArray=[], includeBookmark = false) {

	return {
		type: CONST.DOWNLOAD_EPISODE,
		access_token,
		udid,
		id,
		wrwArray,
		includeBookmark
	};
}

// This action will execute after the success of downloadEpisodeAct.
export function downloadEpisodeSuccess(data,idStatusArray) {
	return {
		type: CONST.DOWNLOAD_EPISODE_SUCCESS,
		payload: {
			data,
			idStatusArray
		}
	};
}
// This action will execute after the failure of downloadEpisodeAct.
export function downloadEpisodeFailure(error,idStatusArray) {
	return {
		type: CONST.DOWNLOAD_EPISODE_FAILED,
		payload: {
			error,
			idStatusArray
		}
	};
}
export function deleteDownloadEpisodeAct(index) {
	return {
		type: CONST.DELETE_DOWNLOADED_EPISODE,
		index,
	};
}
export function updateDownloadList(episodeArray, idArray) {
	return {
		type: CONST.UPDATE_DOWNLOAD_LIST,
		payload: {
			episodeArray,
			idArray,
		}
	};
}

export function clearDownloadList(userId) {
	RNFetchBlob.fs.unlink(RNFetchBlob.fs.dirs.DocumentDir+'/radiospirits/audio')
		.then(() => {
			console.log('audio folder deleted');
		})
		.catch((error) => {
			console.log('audio folder not deleted');
		});
	return {
		type: CONST.CLEAR_DOWNLOAD_LIST,
		payload: {
			userId,
		}
	};
}