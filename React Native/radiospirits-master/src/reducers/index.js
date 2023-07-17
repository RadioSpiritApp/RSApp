/**
 * @author Systango Technologies 
 * Date:
 * Description: INDEX REDUCER !
 * 
 */
import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
import userDetailsReducer from './userDetailsReducer';
import createDeviceReducer from './createDeviceReducer';
import homeScreenDataReducer from './homeScreenDataReducer';
import browseScreenDataReducer from './browseScreenDataReducer';
import emailVerificationReducer from './emailVerificationReducer';
import inAppPurchaseReducer from './inAppPurchaseReducer';
import searchReducer from './searchReducer';
import configurableTextReducer from './configurableTextReducer';
import advertisementReducer from './advertisementReducer';
import playerCommonReducer from './playerCommonReducer';
import downloadEpisodeReducer from './downloadEpisodeReducer';
import recentlyPlayedReducer from './recentlyPlayedReducer';
import dateCheckReducer from './dateCheckReducer';

export default combineReducers({
	commonReducer,
	userDetailsReducer,
	createDeviceReducer,
	homeScreenDataReducer,
	browseScreenDataReducer,
	emailVerificationReducer,
	inAppPurchaseReducer,
	searchReducer,
	configurableTextReducer,
	advertisementReducer,
	playerCommonReducer,
	downloadEpisodeReducer,
	recentlyPlayedReducer,
	dateCheckReducer
});