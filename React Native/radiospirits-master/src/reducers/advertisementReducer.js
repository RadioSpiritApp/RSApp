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
	adObject: null,
};
// This reducer stores the data of advertisements.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.GET_ADVERTISEMENT:
		return {
			...state,
			message: '',
			adObject: null,
		};
	case CONST.GET_ADVERTISEMENT_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			adObject: action.payload.ad,
		};
	case CONST.GET_ADVERTISEMENT_FAILED:
		return {
			...state,
			message: action.payload.message,
		};
	default: return state;
	}
}
