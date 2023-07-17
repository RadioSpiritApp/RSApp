/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: HOME SCREEN TAB REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	page_details: null,
};

// This reducer stores the data of home screen.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.GET_HOMEPAGE_DATA:
		return {
			...state,
			status: false,
			message: '',
			// page_details: null,
		};
	case CONST.GET_HOMEPAGE_DATA_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			page_details: action.payload.page_details,
		};
	case CONST.GET_HOMEPAGE_DATA_FAILED:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
		};
	default: return state;
	}
}
