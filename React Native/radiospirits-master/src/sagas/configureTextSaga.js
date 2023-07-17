/**
 * @author Systango Technologies 
 * Date: 
 * Description: CONFIGURE TEXT SAGA !
 * 
 */
import { put, call } from 'redux-saga/effects';

import { stopSpinner } from '../actions/commonAction';
import { configureTextSuccess, configureTextFailure } from '../actions/configurableTextAction';
import { secureGet } from '../utils/sendJSON';

// This action communicates with the back-end for configurable text data.
export function* configureText() {
	try {
		const data = yield call(secureGet, 'configurable_texts');
		if (data.success) {
			yield put(configureTextSuccess(data));
		} else {
			yield put(configureTextFailure(data));
		}
		yield put(stopSpinner());
	} catch (error) {
		yield put(configureTextFailure(error));
		yield put(stopSpinner());
	}
}
