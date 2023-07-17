/**
 * @author Systango Technologies 
 * Date: Sept 7 2018
 * Description: COMMON SPINNER AND MODAL ACTIONS!
 * 
 */
import * as CONST from '../utils/Const';
// This action starts the common spinner.
export function startSpinner() {
	return { type: CONST.START_SPINNER };
}
// This action stops the common spinner.
export function stopSpinner() {
	return { type: CONST.STOP_SPINNER };
}
// This action shows the premium modal.
export function showPremiumModal() {
	return { type: CONST.SHOW_PREMIUM_MODAL };
}
// This action hides the premium modal.
export function hidePremiumModal() {
	return { type: CONST.HIDE_PREMIUM_MODAL };
}
// This action tells the player type.
export function playerType(type) {
	return { 
		type: CONST.PLAYER_TYPE,
		payload: type, 
	};
}
// This action tells the status of internet.
export function internetStatus(type) {
	return { 
		type: CONST.INTERNET_STATUS,
		payload: type, 
	};
}

export function reRenderBrowseScreen(data) {
	return {
		type: CONST.RE_RENDER_BROWSE_TAB,
		payload: data,
	};
}

export function toggleBufferState(bufferState) {
	return { 
		type: CONST.TOGGLE_BUFFER_STATE,
		bufferState  
	};
}