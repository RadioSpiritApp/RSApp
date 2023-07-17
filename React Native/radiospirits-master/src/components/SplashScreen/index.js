/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: Splash Screen
 * 
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Platform,
} from 'react-native';
import {
	connect
} from 'react-redux';
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types';
import resetRoute from '../../utils/resetRoute';
import { createDeviceAct, } from '../../actions/signinAction';
import { userLogoutAct } from '../../actions/signinAction';
import showToast from '../../utils/Toast';
import styles from './style';
import AsyncStorageUtil from '../../utils/asyncStore';
import * as CONST from '../../utils/Const';
import * as screenDataAction from '../../actions/screenDataAction';
import * as dateCheckAction from '../../actions/dateCheckAction';
import * as configurableTextAction from '../../actions/configurableTextAction';
import { getIsConnectedStatus } from '../Offline/Offline.js';
import moment from 'moment';
import Validators from '../../utils/Validator';
import * as iapActions from '../../actions/inAppPurchaseAction';
import DeviceInfo from 'react-native-device-info';
import TrackPlayer from 'react-native-track-player';
const {
    ImageCacheManager,
} = require('react-native-cached-image');
const defaultImageCacheManager = ImageCacheManager();
let userObj;
let accessToken;
class SplashScreen extends Component {
	constructor(props) {
		super(props);
	}

	async _restoreAccount(plans) {
		let response = null ;
		response = await Validators.restoreAccount(plans);
		let {data, status} = response;
		if(status){
			TrackPlayer.stop();
			TrackPlayer.reset();
			data.platform = Platform.OS == 'ios' ? 'ios' : 'android';
			this.props.iapActions.postIAPProductStatusAct(data);
		}
		else
		{
			let userData = {};
			userData['user'] = {
				access_token: accessToken
			};
			this.props.userLogout(userData);
		}
	}
	async componentDidMount() {
		defaultImageCacheManager.getCacheInfo()
            .then(({size, files}) => {
				let timeDiff = Math.abs(new Date().getTime() - files[0].lastModified);
				let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
				if(diffDays >= 30){
					defaultImageCacheManager.clearCache()
					.then(() => {
						console.log('image cache cleared');
					});
				}
			});
		userObj = await AsyncStorageUtil.getAsyncStorage(CONST.USER_OBJECT);
		accessToken = await AsyncStorageUtil.getAsyncStorage(CONST.AUTH_TOKEN_KEY);
		userObj = JSON.parse(userObj);
		let device_info = {};
		let udid = DeviceInfo.getUniqueID();
		device_info['device'] = {
			udid,
			device_name: DeviceInfo.getBrand(),
			fcm_token: 'dummy_token',
			device_type: Platform.OS,
			device_locale: DeviceInfo.getDeviceLocale(),
			timezone: DeviceInfo.getTimezone()
		};
		if (userObj) {
			if (getIsConnectedStatus()) {	
				let storedDate = await AsyncStorageUtil.getAsyncStorage(CONST.TODAY_DATE);
				storedDate = JSON.parse(storedDate)
				let todayDate = new Date(); 
				todayDate = moment((new Date(todayDate)).setHours(0,0,0,0)).valueOf();
				if(userObj.subscription && userObj.subscription.transaction_identifier && (!storedDate || (moment((new Date(storedDate)).setHours(0,0,0,0)).valueOf() < todayDate))){
					let plans = [];
					let plan = {};
					Platform.OS == 'ios' ? plan.itunes_id = userObj.subscription.plan_itunes_id : plan.play_store_id = userObj.subscription.plan_playstore_id;
					plans.push(plan);
					await AsyncStorageUtil.setAsyncStorage(CONST.TODAY_DATE, JSON.stringify(todayDate));
					await this._restoreAccount(plans)
				}
				else{
					this.props.dateCheckAction.dateCheckStatusUpdate();
				}
				this.props.screenDataAction.getHomepageScreenDataAct(udid, userObj.access_token);
			} else {
				resetRoute('TabScreen', this.props.navigation);
				this.props.screenDataAction.restoreUserSuccess(userObj);
			}
		} else {
			if (getIsConnectedStatus()) {								// getIsConnectedStatus returns true when net is connected
				this.props.createDevice(device_info);
				this.props.configurableTextAction.configureTextAct();
				this.props.dateCheckAction.dateCheckStatusUpdate();
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			if(this.props.dateCheck){
				if(userObj && this.props.restore_redirect_to){
					if(this.props.restore_redirect_to.toUpperCase() == 'HOMEPAGE'){
						resetRoute('TabScreen', this.props.navigation);
					}
					else if(this.props.restore_redirect_to.toUpperCase() == 'SIGNUP'){
						resetRoute('SignupScreen', this.props.navigation);
						let userData = {};
						userData['user'] = {
							access_token: accessToken
						};
						this.props.userLogout(userData);
					}
				}
				else if (this.props.status && this.props.redirect_to != '') {
					if (this.props.redirect_to.toUpperCase() == 'SIGNUP') {
						resetRoute('SignupScreen', this.props.navigation);
					} else if (this.props.redirect_to.toUpperCase() == 'HOMEPAGE') {
						resetRoute('TabScreen', this.props.navigation);
					} else if (this.props.redirect_to.toUpperCase() == 'CONFIRMATION_PENDING') {
						this.props.navigation.navigate('EmailValidatorScreen');
					}
				} else if (this.props.restoreStatus && this.props.restoreMessage) {
					resetRoute('TabScreen', this.props.navigation);
					this.props.screenDataAction.restoreUserSuccess(userObj);
				} else if (!this.props.status && this.props.message != '') {
					showToast(this.props.message);
				}
			}
		}
	}
	render() {
		return (
			<View style={styles.container}>
				<Image source={CONST.SPLASH_SCREEN} style={styles.backgroundImage} />
			</View>
		);
	}
}
function mapStateToProps(state) {
	const { createDeviceReducer, homeScreenDataReducer, inAppPurchaseReducer, dateCheckReducer } = state;
	return {
		status: createDeviceReducer.status,
		message: createDeviceReducer.message,
		redirect_to: createDeviceReducer.redirect_to,
		page_details: createDeviceReducer.page_details,
		restoreStatus: homeScreenDataReducer.status,
		restoreMessage: homeScreenDataReducer.message,
		all_plans: inAppPurchaseReducer.all_plans,
		restore_redirect_to: inAppPurchaseReducer.redirect_to,
		dateCheck: dateCheckReducer.dateCheck
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		iapActions: bindActionCreators(iapActions,dispatch),
		createDevice: (device_info) => {
			dispatch(createDeviceAct(device_info));
		},
		userLogout: (userData) => {
			dispatch(userLogoutAct(userData));
		},
		screenDataAction: bindActionCreators(screenDataAction, dispatch),
		configurableTextAction: bindActionCreators(configurableTextAction, dispatch),
		dateCheckAction: bindActionCreators(dateCheckAction, dispatch)
	};
};
SplashScreen.propTypes = {
	navigation: PropTypes.object,
	createDevice: PropTypes.func,
	status: PropTypes.bool,
	message: PropTypes.string,
	redirect_to: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

