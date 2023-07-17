/**
 * @author Systango Technologies
 * Date: Sept 7 2018
 * Description: CONFIGURATION TEXT ACTIONS !
 * 
 */

import * as CONST from '../utils/Const';

// This action invokes the configureTextSaga for getting the data of configurable text from back-end.
export function configureTextAct() {
	return {
		type: CONST.CONFIGURABLE_TEXT,
	};
}
// This action will execute after the success of configureTextAct.
export function configureTextSuccess(data) {
	return {
		type: CONST.CONFIGURABLE_TEXT_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of configureTextAct.
export function configureTextFailure(error) {
	return {
		type: CONST.CONFIGURABLE_TEXT_FAILED,
		payload: error
	};
}