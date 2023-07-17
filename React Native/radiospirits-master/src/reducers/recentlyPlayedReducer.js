/**
 * @author Systango Technologies 
 * Date: OCT 17, 2018
 * Description: RECENT EPISODE REDUCER !
 * 
 */
 
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	episodeList: null,
	episodeTotalPage: 0,
	episodeCurrentPage: 0,
};
// This reducer stores the data of recent episodes.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.GET_RECENT_EPISODE:
		return {
			...state,
			status: false,
			message: '',
			episodeCurrentPage: action.pageNo,
		};
	case CONST.RESET_RECENT_EPISODE:
		return {
			...state,
			status: false,
			message: '',
			episodeList: null,
			episodeCurrentPage: 0,
		};
	case CONST.GET_RECENT_EPISODE_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			episodeTotalPage: action.payload.total_pages,
			episodeList: state.episodeList == null ? action.payload.episodes : [...state.episodeList,...action.payload.episodes],
		};
	case CONST.GET_RECENT_EPISODE_FAILED:
		return {
			...state,
			status: false,
			message: action.payload.message,
		};
	default: return state;
	}
}
