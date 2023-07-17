/**
 * @author Systango Technologies 
 * Date: Oct 1, 2018
 * Description: DOWNLOAD EPISODE SAGA !
 * 
 */
import { put, call, select } from 'redux-saga/effects';
import Validators from '../utils/Validator';
import { downloadEpisodeSuccess, downloadEpisodeFailure, updateDownloadList } from '../actions/downloadAction';
import { secureGet } from '../utils/sendJSON';
import RNFetchBlob from 'react-native-fetch-blob';
import { Platform } from 'react-native';

// This action communicates with the back-end for configurable text data.
export function* downloadEpisode(action) {
	const episodeId = action.id;
	const downloadEpisodeReducer = state => state.downloadEpisodeReducer;
	let data = null;
	try {
		let query = 'episodes/download_episode?user[access_token]=' + action.access_token + '&device_udid=' + action.udid + '&episode[id]=' + action.id;
		data = yield call(secureGet, query);
		if (data.success) {
			let isDownloaded = false;
			const { url, artwork, id } = data.episode;
			const artwork_name = `${new Date().getTime()}_${id}.jpg`;
			const audio_name = `${new Date().getTime()}_${id}.mp3`;

			if (artwork && artwork != '') {
				isDownloaded = yield call(downloadArtwork, artwork, artwork_name);
				if (isDownloaded) {
					data.episode.artwork = '/radiospirits/images/' + artwork_name;
				}
				else {
					data.episode.artwork = null;
				}
			}
			if (url && url != '') {
				data.episode.url = Validators.decrypt(url);
				isDownloaded = yield call(downloadAudio, data.episode.url, audio_name);

				if (isDownloaded) {
					let { idArray } = yield select(downloadEpisodeReducer);
					let index = idArray.findIndex((element) => {
						return element.id == episodeId;
					});
					let temp = JSON.parse(JSON.stringify(idArray));
					temp[index].status = 'downloaded';

					data.episode.url = '/radiospirits/audio/' + audio_name;
					if (action.wrwArray.length) {
						yield put(downloadEpisodeSuccess({ ...data.episode, id: action.id, 'wrwList': action.wrwArray }, temp));
					} else {
						yield put(downloadEpisodeSuccess(data.episode, temp));
					}
				}
				else {
					let { idArray } = yield select(downloadEpisodeReducer);
					let index = idArray.findIndex((element) => {
						return element.id == episodeId;
					});
					let temp = JSON.parse(JSON.stringify(idArray));
					temp.splice(index, 1);

					yield put(downloadEpisodeFailure(data, temp));
				}
			}
			else {
				let { idArray } = yield select(downloadEpisodeReducer);
				let index = idArray.findIndex((element) => {
					return element.id == episodeId;
				});
				let temp = JSON.parse(JSON.stringify(idArray));
				temp.splice(index, 1);
				
				yield put(downloadEpisodeFailure(data, temp));
			}
		}
		else {
			let { idArray } = yield select(downloadEpisodeReducer);
			let index = idArray.findIndex((element) => {
				return element.id == episodeId;
			});
			let temp = JSON.parse(JSON.stringify(idArray));
			temp.splice(index, 1);

			yield put(downloadEpisodeFailure(data, temp));
		}
	}
	catch (error) {
		let { idArray } = yield select(downloadEpisodeReducer);
		let index = idArray.findIndex((element) => {
			return element.id == episodeId;
		});
		let temp = JSON.parse(JSON.stringify(idArray));
		temp.splice(index, 1);

		yield put(downloadEpisodeFailure(data, temp));
	}
}

function downloadArtwork(artworkUrl, artworkName) {
	try {
		let dirs = RNFetchBlob.fs.dirs;
		const baseArtworkPath = '/radiospirits/images';

		return RNFetchBlob.config({
			path: dirs.DocumentDir + `${baseArtworkPath}/${artworkName}`,
			fileCache: true,
			appendExt: 'png',
			notification: true,
		}).fetch('GET', `${artworkUrl}`).then(() => {
			return true;
		}).catch(() => {
			return false;
		});
	}
	catch (error) {
		return false;
	}
}

function downloadAudio(audioUrl, audioName) {
	try {
		let dirs = RNFetchBlob.fs.dirs;
		const baseAudioPath = '/radiospirits/audio';
		let progressPercentage = 0;
		return RNFetchBlob.config({
			path: dirs.DocumentDir + `${baseAudioPath}/${audioName}`,
			fileCache: true,
			appendExt: 'mp3',
			notification: true,
		}).fetch('GET', `${audioUrl}`).progress({ interval: 50 }, (received = 0, total = 0) => {
			const progress = parseInt((received / total) * 100);
			progressPercentage = progress;
		}).then(() => {
			if (Platform.OS == 'android') {
				if (progressPercentage < 90) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		}).catch((error) => {
			console.log('$$$$$$$ Audio inner error', error);
			return false;
		});
	}
	catch (error) {
		console.log('$$$$$$$ Audio outer error', error);
		return false;
	}
}

export function* deleteEpisode(action) {
	try {
		const downloadEpisodeReducer = state => state.downloadEpisodeReducer;
		let { episodeArray, idArray } = yield select(downloadEpisodeReducer);
		let { index } = action;
		let defaultPath = RNFetchBlob.fs.dirs.DocumentDir;
		let audioPath = defaultPath + episodeArray[index].url;
		let artworkPath = defaultPath + episodeArray[index].artwork;

		yield call(deleteArtwork, artworkPath);
		let isDeleted = yield call(deleteAudio, audioPath);

		if (isDeleted) {
			let tempEpisodeArray = episodeArray.splice(0, episodeArray.length);
			tempEpisodeArray.splice(index, 1);
			let tempIdArray = idArray.splice(0, idArray.length);
			tempIdArray.splice(index, 1);
			yield put(updateDownloadList(tempEpisodeArray, tempIdArray));
		}
	}
	catch (error) {
		console.log('$$$$$$$ Episode deletion failed', error);
		return false;
	}
}

function deleteArtwork(artworkPath) {
	return RNFetchBlob.fs.unlink(artworkPath)
		.then(() => {
			console.log('artwork deleted');
		})
		.catch((error) => {
			console.log(error);
		});
}

function deleteAudio(audioPath) {
	return RNFetchBlob.fs.unlink(audioPath)
		.then(() => {
			return true;
		})
		.catch(() => {
			return false;
		});
}
