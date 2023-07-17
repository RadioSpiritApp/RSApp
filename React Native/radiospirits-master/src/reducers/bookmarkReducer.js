/**
 * @author Systango Technologies 
 * Date: Sept 7, 2018
 * Description: ADVERTISEMENT REDUCER !
 * 
 */
 
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
};
// This reducer stores the data of advertisements.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.POST_SEEK_TIME:
		return {
			...state,
			message: '',
		};
	case CONST.POST_SEEK_TIME_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
		};
	case CONST.POST_SEEK_TIME_FAILED:
		return {
			...state,
			message: action.payload.message,
		};
	default: return state;
	}
}
