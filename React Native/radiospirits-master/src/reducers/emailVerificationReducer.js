/**
 * @author Systango Technologies 
 * Date: Aug 9, 2018
 * Description: EMAIL VERIFICATION REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	status: false,
	message: '',
	email: null,
};

// This reducer stores the status of email verification.
export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.EMAIL_VERIFIED:
		return {
			...state,
			_status: false,
			get status() {
				return this._status;
			},
			set status(value) {
				this._status = value;
			},
			message: '',
			email: null,
		};
	case CONST.EMAIL_VERIFIED_SUCCESS:
		return {
			...state,
			status: action.payload.success,
			message: action.payload.message,
		};
	case CONST.EMAIL_VERIFIED_FAILED:
		return {
			...state,
			message: action.payload.message,
		};
	default: return state;
	}
}
