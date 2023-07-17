/**
 * @author Systango Technologies 
 * Date: APR 12 2019
 * Description: DATE CHECK REDUCER !
 * 
 */
import * as CONST from '../utils/Const';

const initialState = {
	dateCheck:false,
};

export default function (state = initialState, action) {
	switch (action.type) {
	case CONST.DATE_CHECK_STATUS_UPDATE:
		return {
			...state,
			dateCheck:true,
		};
	default: return state;
	}
}
