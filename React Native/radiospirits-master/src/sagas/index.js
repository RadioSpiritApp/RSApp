/**
 * @author Systango Technologies 
 * Date: 
 * Description: INDEX SAGA !
 * 
 */
import * as CONST from './../utils/Const';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { createDevice, userSignUp, userLogin, rvUserLogin, userLogout, referenceId } from './loginSaga';
import { getHomepageScreenData, getBrowseScreenData, getEpisodeScreenData, getGenreScreenData, whenRadioWasEpisodeData } from './screenDataSaga';
import { emailVerify } from './emailVerificationSaga';
import { searchEpisode, searchSeries, searchWhenRadioWas } from './searchSaga';
import { getIAPProducts, postIAPProductStatus } from './inAppPurchaseSaga';
import { configureText } from './configureTextSaga';
import { getAdvertisements } from './advertisementSaga';
import { getFreePlayeAudioData, getPremiumPlayeAudioData, playAllEpisodeData, updateStreamCount } from './audioDataSaga';
import { downloadEpisode, deleteEpisode } from './downloadEpisodeSaga';
import { postSeekTime } from './bookmarkSaga';
import { getRecentEpisodes } from './recentlyPlayedSaga';

function* rootSaga() {
	[
		yield takeEvery(CONST.CREATE_DEVICE, createDevice),
		yield takeEvery(CONST.USER_SIGNUP, userSignUp),
		yield takeEvery(CONST.USER_LOGIN, userLogin),
		yield takeEvery(CONST.RV_USER_LOGIN, rvUserLogin),
		yield takeEvery(CONST.USER_LOGOUT, userLogout),
		yield takeEvery(CONST.GET_HOMEPAGE_DATA, getHomepageScreenData),
		yield takeLatest(CONST.GET_BROWSE_DATA, getBrowseScreenData),
		yield takeLatest(CONST.GET_GENRE_BROWSE_DATA, getBrowseScreenData),
		yield takeLatest(CONST.GET_EPISODE_DATA, getEpisodeScreenData),
		yield takeLatest(CONST.GET_GENRE_DATA, getGenreScreenData),
		yield takeEvery(CONST.EMAIL_VERIFIED, emailVerify),
		yield takeEvery(CONST.GET_IAP_PRODUCTS, getIAPProducts),
		yield takeEvery(CONST.POST_IAP_STATUS, postIAPProductStatus),
		yield takeEvery(CONST.SEARCH_EPISODE, searchEpisode),
		yield takeEvery(CONST.SEARCH_SERIES, searchSeries),
		yield takeEvery(CONST.SEARCH_WHEN_RADIO_WAS_EPISODE, searchWhenRadioWas),
		yield takeEvery(CONST.GET_WHEN_RADIO_WAS_EPISODE_DATA, whenRadioWasEpisodeData),
		yield takeEvery(CONST.CONFIGURABLE_TEXT, configureText),
		yield takeEvery(CONST.GET_ADVERTISEMENT, getAdvertisements),
		yield takeEvery(CONST.GET_FREE_PLAYER_DATA, getFreePlayeAudioData),
		yield takeEvery(CONST.GET_PREMIUM_PLAYER_DATA, getPremiumPlayeAudioData),
		yield takeEvery(CONST.PLAY_ALL_EPISODE, playAllEpisodeData),
		yield takeEvery(CONST.DOWNLOAD_EPISODE, downloadEpisode),
		yield takeEvery(CONST.DELETE_DOWNLOADED_EPISODE, deleteEpisode),
		yield takeEvery(CONST.POST_SEEK_TIME, postSeekTime),
		yield takeEvery(CONST.GET_RECENT_EPISODE, getRecentEpisodes),
		yield takeEvery(CONST.REFERENCE_ID, referenceId),
		yield takeLatest(CONST.UPDATE_STREAM_COUNT, updateStreamCount),
	];
}

export default rootSaga;