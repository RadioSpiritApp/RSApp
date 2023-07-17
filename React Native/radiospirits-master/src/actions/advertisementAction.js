/**
 * @author Systango Technologies 
 * Date: Sept 7 2018
 * Description: ADVERTISEMENT ACTIONS !
 * 
 */
import * as CONST from '../utils/Const';

// This action invokes the advertisementSaga for getting the data of advertisements from back-end.
export function getAdvertisementAct() {
	return {
		type: CONST.GET_ADVERTISEMENT,
	};
}
// This action will execute after the success of getAdvertisementAct.
export function getAdvertisementSuccess(data) {
	return {
		type: CONST.GET_ADVERTISEMENT_SUCCESS,
		payload: data
	};
}
// This action will execute after the failure of getAdvertisementAct.
export function getAdvertisementFailure(error) {
	return {
		type: CONST.GET_ADVERTISEMENT_FAILED,
		payload: error
	};
}