/**
 * @author Systango Technologies 
 * Date:
 * Description: COMMON REDUCER FOR SPINNER AND MODAL!
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	isFetching: false,
	isVisible: false,
	playerType: '',
	internetStatus:true,
	bufferState: false,
};

// This reducer stores the state of common spinner and modal.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.START_SPINNER:
		return {
			...state,
			isFetching: true
		};
	case CONST.STOP_SPINNER:
		return {
			...state,
			isFetching: false
		};
	case CONST.SHOW_PREMIUM_MODAL:
		return {
			...state,
			isVisible: true,
		};
	case CONST.HIDE_PREMIUM_MODAL:
		return {
			...state,
			isVisible: false,
		};
	case CONST.PLAYER_TYPE:
		return {
			...state,
			playerType: action.payload,
		};
	case CONST.INTERNET_STATUS:
		return {
			...state,
			internetStatus: action.payload,
		};
	case CONST.TOGGLE_BUFFER_STATE:
		return {
			...state,
			bufferState: action.bufferState,
		};
	default:
		return state;
	}
}
