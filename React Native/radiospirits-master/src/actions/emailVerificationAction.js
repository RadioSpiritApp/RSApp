/**
 * @author Systango Technologies
 * Date: Aug 21 2018
 * Description: AUTHENTICATION ACTIONS - EMAIL_VERFICATION !
 * 
 */
import * as CONST from '../utils/Const';
// This action invokes the emailVerificationSaga for getting the status of email from back-end.
export function emailVerificationAct(udid) {
	return {
		type: CONST.EMAIL_VERIFIED,
		udid: udid,
	};
}
// This action will execute after the success of emailVerificationAct.
export function emailVerificationSuccess(data) {
	return {
		type: CONST.EMAIL_VERIFIED_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of emailVerificationAct.
export function emailVerificationFailure(error) {
	return {
		type: CONST.EMAIL_VERIFIED_FAILED,
		payload: error
	};
}