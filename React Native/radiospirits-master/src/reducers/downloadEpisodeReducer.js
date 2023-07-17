/**
 * @author Systango Technologies 
 * Date: Oct 1, 2018
 * Description: DOWNLOAD EPISODE REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	userId:'',
	episodeArray:[],
	idArray:[]
};
// This reducer stores the data of configurable text.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.DOWNLOAD_EPISODE:
		return {
			...state,
			idArray:[...state.idArray,{id:action.id,status:'fetching'}]
		};
	case CONST.DOWNLOAD_EPISODE_SUCCESS:
		return {
			...state,
			episodeArray : [...state.episodeArray,action.payload.data],
			idArray : action.payload.idStatusArray,
		};
	case CONST.DOWNLOAD_EPISODE_FAILED:
		return {
			...state,
			idArray : action.payload.idStatusArray,
		};
	case CONST.UPDATE_DOWNLOAD_LIST:
		return {
			...state,
			episodeArray : action.payload.episodeArray,
			idArray : action.payload.idArray,
		};
	case CONST.CLEAR_DOWNLOAD_LIST:
		return {
			...state,
			userId: action.payload.userId,
			episodeArray : [],
			idArray : [],
		};
	default: return state;
	}
}
