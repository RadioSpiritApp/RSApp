/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: SEARCH REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	searchEpisodeStatus: false,
	searchEpisodeMessage: '',
	searchSeriesStatus: false,
	searchSearchMessage: '',
	searchEpisodeList:null,
	searchSeriesList:null,
	searchSeriesTotalPages:0,
	searchSeriesCurrentPage:0,
	searchEpisodeTotalPages:0,
	searchEpisodeCurrentPages:0,
	searchWrwStatus: false,
	searchWrwMessage: '',
	searchWrwTotalPages:0,
	searchWrwList:null,
};
// This reducer stores the data of searched series and episode.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.SEARCH_EPISODE:
		return {
			...state,
			searchEpisodeStatus: false,
			searchEpisodeMessage: '',
			searchEpisodeCurrentPages: action.pageNo,
		};
	case CONST.RESET_EPISODE_SERIES:
		return {
			...state,
			searchSeriesStatus: false,
			searchSearchMessage: '',
			searchEpisodeCurrentPages: 0,
			searchEpisodeList: null,
		};
	case CONST.SEARCH_EPISODE_SUCCESS:
		return {
			...state,
			searchEpisodeStatus: action.payload.success,
			searchEpisodeMessage: action.payload.message,
			searchEpisodeList: action.payload.episodes,
			searchEpisodeTotalPages: action.payload.total_pages,
		};
	case CONST.SEARCH_EPISODE_FAILED:
		return {
			...state,
			searchEpisodeMessage: action.payload.message,
		};
	case CONST.SEARCH_SERIES:
		return {
			...state,
			searchSeriesStatus: false,
			searchSearchMessage: '',
			searchSeriesCurrentPage: action.pageNo,
		};
	case CONST.RESET_SEARCH_SERIES:
		return {
			...state,
			searchSeriesStatus: false,
			searchSearchMessage: '',
			searchSeriesCurrentPage: 0,
			searchSeriesList: null,
		};
	case CONST.SEARCH_SERIES_SUCCESS:
		return {
			...state,
			searchSeriesStatus: action.payload.success,
			searchSearchMessage: action.payload.message,
			searchSeriesList: state.searchSeriesList == null ? action.payload.series : [...state.searchSeriesList,...action.payload.series],
			searchSeriesTotalPages: action.payload.total_pages,
		};
	case CONST.SEARCH_SERIES_FAILED:
		return {
			...state,
			searchSearchMessage: action.payload.message,
		};
	case CONST.SEARCH_WHEN_RADIO_WAS_EPISODE:
		return {
			...state,
			searchWrwStatus: false,
			searchWrwMessage: '',
			searchWrwList: null,
		};
	case CONST.RESET_SEARCH_WHEN_RADIO_WAS_EPISODE:
		return {
			...state,
			searchWrwStatus: false,
			searchWrwMessage: '',
			searchWrwList: null,
		};
	case CONST.SEARCH_WHEN_RADIO_WAS_EPISODE_SUCCESS:
		return {
			...state,
			searchWrwStatus: action.payload.success,
			searchWrwMessage: action.payload.message,
			searchWrwList: state.searchWrwList == null ? action.payload.when_radio_was : [...state.searchWrwList,...action.payload.when_radio_was],
			searchWrwTotalPages: action.payload.total_pages,
		};
	case CONST.SEARCH_WHEN_RADIO_WAS_EPISODE_FAILED:
		return {
			...state,
			searchWrwMessage: action.payload.message,
		};
	default: return state;
	}
}
