/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: CREATE DEVICE REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	page_details: null,
	redirect_to: '',
};
// This reducer stores the data of device.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.CREATE_DEVICE:
		return {
			...state,
			status: false,
			message: '',
			page_details: null,
			redirect_to: '',
		};
	case CONST.CREATE_DEVICE_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
			page_details: action.payload.page_details,
			redirect_to: action.payload.redirect_to,
		};
	case CONST.CREATE_DEVICE_FAILED:
		return {
			...state,
			page_details: null,
			status: action.payload.success,
			message: action.payload.message,
		};
	default: return state;
	}
}
