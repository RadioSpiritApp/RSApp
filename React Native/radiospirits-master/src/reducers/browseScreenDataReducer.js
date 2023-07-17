/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: BROWSE SCREEN TAB REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	series_details: null,
	seriesTotalPages:0,
	seriesCurrentPage:0,
	episodes_details: null,
	episodeTotalPages:0,
	episodeCurrentPage:0,
	genreListStatus: false,
	genreListMessage: '',
	genres: null,
	genreSeriesTotalPages:0,
	genreSeriesCurrentPage:0,
	genre_series_details:null,
	wrwTotalPages:0,
	wrwCurrentPage:0,
	wrwEpisodesList:null,
	wrwEpisodeStatus:false,
	wrwEpisodeMessage:'',
	reRenderObject: {},
};
// This reducer stores the data of browse screen.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.GET_BROWSE_DATA:
		return {
			...state,
			status: false,
			message: '',
			seriesCurrentPage: action.pageNo,
		};
	case CONST.RESET_BROWSE_DATA:
		return {
			...state,
			status: false,
			series_details: null,
			message: '',
			seriesCurrentPage: 0,
		};
	case CONST.GET_BROWSE_DATA_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			seriesTotalPages: action.payload.total_pages,
			series_details: state.series_details == null ? action.payload.series : [...state.series_details,...action.payload.series],
		};
	case CONST.GET_BROWSE_DATA_FAILED:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
		};
	case CONST.RESET_GENRE_BROWSE_DATA:
		return {
			...state,
			status: false,
			genre_series_details: null,
			message: '',
			genreSeriesCurrentPage: 0,
		};
	case CONST.GET_GENRE_BROWSE_DATA:
		return {
			...state,
			genreSeriesStatus: false,
			genreSeriesMessage: '',
			genreSeriesCurrentPage: action.pageNo,
		};
	case CONST.GET_GENRE_BROWSE_DATA_SUCCESS:
		return {
			...state,
			genreSeriesStatus: action.payload.success,
			genreSeriesMessage: action.payload.message,
			genreSeriesTotalPages: action.payload.total_pages,
			genre_series_details: state.genre_series_details == null ? action.payload.series : [...state.genre_series_details,...action.payload.series],
		};
	case CONST.GET_GENRE_BROWSE_DATA_FAILED:
		return {
			...state,
			genreSeriesStatus: action.payload.success,
			genreSeriesMessage: action.payload.message,
		};
	case CONST.GET_GENRE_DATA:
		return {
			...state,
			genreListStatus: false,
			genreListMessage: '',
			genres: null,
		};
	case CONST.GET_GENRE_DATA_SUCCESS:
		return {
			...state,
			genreListStatus: action.payload.success,
			genreListMessage: action.payload.message,
			genres: action.payload.genres,
		};
	case CONST.GET_GENRE_DATA_FAILED:
		return {
			...state,
			genreListStatus: action.payload.success,
			genreListMessage: action.payload.message,
		};
	case CONST.RESET_EPISODE_DATA:
		return {
			...state,
			status: false,
			episodes_details: null,
			message: '',
			episodeCurrentPage: 0,
		};
	case CONST.GET_EPISODE_DATA:
		return {
			...state,
			status: false,
			message: '',
			episodeCurrentPage: action.pageNo,
		};
	case CONST.GET_EPISODE_DATA_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			episodeTotalPages: action.payload.total_pages,
			episodes_details: state.episodes_details == null ? action.payload.episodes : [...state.episodes_details,...action.payload.episodes],
		};
	case CONST.GET_EPISODE_DATA_FAILED:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
		};
	case CONST.RESET_WHEN_RADIO_WAS_EPISODE_DATA:
		return {
			...state,
			wrwEpisodeStatus: false,
			wrwEpisodeMessage: '',
			wrwEpisodesList: null,
			wrwCurrentPage: 0,
			wrwTotalPages:0,
		};
	case CONST.GET_WHEN_RADIO_WAS_EPISODE_DATA:
		return {
			...state,
			wrwEpisodeStatus: false,
			wrwEpisodeMessage: '',
			wrwCurrentPage: action.pageNo,
		};
	case CONST.GET_WHEN_RADIO_WAS_SUCCESS:
		return {
			...state,
			wrwEpisodeStatus: action.payload.success,
			message: action.payload.message,
			wrwTotalPages:action.payload.total_pages,
			wrwEpisodesList: state.wrwEpisodesList == null ? action.payload.when_radio_was : [...state.wrwEpisodesList,...action.payload.when_radio_was],
		};
	case CONST.GET_WHEN_RADIO_WAS_FAILED:
		return {
			...state,
			wrwEpisodeStatus: action.payload.success,
			wrwEpisodeMessage: action.payload.message,
		};
	case CONST.RE_RENDER_BROWSE_TAB:
		return {
			...state,
			reRenderObject: action.payload,
		};
	default: return state;
	}
}
