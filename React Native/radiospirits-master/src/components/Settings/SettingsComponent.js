import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image,
	ScrollView,
	Alert,
	Platform,
	Linking,
	NetInfo
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import scale from '../../utils/scale';
import AsyncStorageUtil from '../../utils/asyncStore';
import * as CONST from '../../utils/Const';
import { getRootNavigation } from '../../AppRoot';
import DeviceInfo from 'react-native-device-info';
import Validators from '../../utils/Validator';
import commonstyles from '../commonstyles';
import NoInternetView from '../Offline/NoInternetView';
import firebase from 'react-native-firebase';
import TrackPlayer from 'react-native-track-player';
const {
	ImageCacheManager,
} = require('react-native-cached-image');
const defaultImageCacheManager = ImageCacheManager();

export default class SettingsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSource: CONST.SOURCE,
			flag: 1,
		};
	}
	componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.SETTINGS_TAB_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.SETTINGS_TAB_SCREEN , udid });
		if (this.props.all_plans.length <= 0) {
			this.props.startSpin();
			this.props.iapActions.getSubscriptionPlans(udid);
		}
	}

	async _userLogout() {
		defaultImageCacheManager.clearCache()
			.then(() => {
				console.log('image cache cleared');
			});
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('USER_LOGOUT',{event: 'Button Click' , udid});
		let accessToken = await AsyncStorageUtil.getAsyncStorage(CONST.AUTH_TOKEN_KEY);
		let userData = {};
		userData['user'] = {
			access_token: accessToken
		};
		this.props.startSpin();
		this.props.userLogout(userData);
	}

	renderTopContainer() {
		return (
			<View style={styles.topContainer} >
				<Image
					source={CONST.LOGO_IMG}
				/>
			</View>
		);
	}
	_onPressFAQ() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('FAQ_BUTTON',{event: 'Button Click' , udid});
		getRootNavigation().navigate('CommonWebViewScreen', { header: CONST.FAQS, uri: CONST.FAQS_URI + '?referenceId=' + this.props.referenceId });
	}
	renderUserSetiing(userType) {
		return (
			<View>
				{userType == 'RadioVault' ? this.renderRVCurrentPlanContainer() : this.renderRSCurrentPlanContainer()}
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => { this._onPressFAQ(); }}>
					<Text style={styles.buttonText}>FAQs</Text>
					<Image style={[styles.buttonIcon]} source={CONST.FAQS_ICON} resizeMode='contain' />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => { this._userLogout(); }}>
					<Text style={styles.buttonText}>Logout</Text>
					<Image style={[styles.buttonIcon]} source={CONST.LOGOUT_ICON} resizeMode='contain' />
				</TouchableOpacity>
			</View>
		);
	}

	cancelSubscription() {
		if (Platform.OS === 'ios') {
			Linking.openURL(CONST.CANCEL_SUBSCRIPTION_URL_IOS);
		}
		else {
			Linking.openURL(CONST.CANCEL_SUBSCRIPTION_URL_ANDROID);
		}
	}

	renderRSCurrentPlanContainer() {
		const {
			is_paid_user,
			subscription,
		} = this.props.user;
		let renewDatePrefix = (subscription && subscription.autoRenewal) ? 'Renews on ' : 'Expires on ';
		let subPlanDetail = subscription && `${subscription.plan_validity_text + ' @ ' + '$' + subscription.plan_amount + '\n'}`
		let renewDate = subscription && `${renewDatePrefix + Validators.dateFormatter(subscription.expiry_date)}`
		if (!is_paid_user) {
			return (
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => { getRootNavigation().navigate('Subscriptionscreen'); }}>
					<Text style={styles.buttonText}>View Premium Plans</Text>
					<Image style={[styles.buttonIcon]} source={CONST.PREMIUM_PLAN_ICON} resizeMode='contain' />
				</TouchableOpacity>
			);
		}
		return (
			<View style={styles.rsCurrentPlanContainer} >
				<View style={{ flex: 0.7 }} >
					<Text style={styles.currentPlanHeadingText} >
						Current Plan
					</Text>
					<Text style={styles.subscriptionPlanHeadingText} >
						{subscription.plan_name ? subscription.plan_name : 'Subscription Plan'}
					</Text>
					<Text style={styles.subscriptionPlanDetail} >
						{subPlanDetail}{renewDate}
					</Text>
				</View>
				<View style={{ flex: 0.3, alignItems: 'flex-end' }} >
					<TouchableOpacity style={styles.cancelButtonContainer}
						onPress={() => this.cancelSubscription()}
					>
						<Text style={styles.cancelButtonText} >
							Cancel
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.changeButtonContainer}
						onPress={() => { getRootNavigation().navigate('Subscriptionscreen') }}>
						<Text style={styles.changeButtonText} >
							Change
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderRVCurrentPlanContainer() {
		const {
			email,
		} = this.props.user;
		return (
			<View >
				<View style={styles.rvCurrentPlanContainer} >
					<Text style={styles.currentPlanHeadingText} >
						Current Plan
					</Text>
					<View style={{ paddingTop: scale(15) }} >
						<Text style={styles.userTypeTextDetails} >
							Logged in a RadioVault.com Account
						</Text>
						<Text style={styles.userTypeTextDetails} >
							{email}
						</Text>
					</View>
				</View>
			</View>
		);
	}
	_loginAsRV() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('RV_USER_LOGIN',{event: 'Button Click' , udid});
		getRootNavigation().navigate('RVSigninScreen');
	}
	async _restoreAccount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('SETTING_RESTORE_ACCOUNT',{event: 'Button Click' , udid});
		let response = null ;
		this.props.startSpin();
		response = await Validators.restoreAccount(this.props.all_plans);
		if (response.status) {
			let {data} = response;
			Alert.alert(
				'Restore Successful',
				'You successfully restored the following purchases: ' + data.restoredTitles,
				[
					{
						text: 'OK', onPress: () => {
							// To empty the download list for new user.
							if (this.props.user && this.props.user.is_paid_user) {
								let { id } = this.props.user;
								if (this.props.userId != id) {
									this.props.downloadAction.clearDownloadList(id);
								}
							}
						}
					}
				]
			);
			TrackPlayer.stop();
			TrackPlayer.reset();
			data.platform = Platform.OS == 'ios' ? 'ios' : 'android';
			this.props.iapActions.postIAPProductStatusAct(data);
			this.props.navigation.goBack();
			firebase.analytics().logEvent('SETTING_RESTORE_ACCOUNT_SUCCESS',{event: 'Button Click' , udid, referenceId: this.props.referenceId});
		} else {
			this.props.stopSpin();
			Alert.alert('Restore Unsuccessful', response.message);
			firebase.analytics().logEvent('SETTING_RESTORE_ACCOUNT_FAILURE',{event: 'Button Click' , udid, referenceId: this.props.referenceId});
		}
	}
	renderFreeUserContainer() {
		const {
			page_details,
		} = this.props;
		let show_rv_login = page_details && page_details.show_rv_login;
		return (
			<View>
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => { getRootNavigation().navigate('Subscriptionscreen'); }}>
					<Text style={styles.buttonText}>View Premium Plans</Text>
					<Image style={[styles.buttonIcon]} source={CONST.PREMIUM_PLAN_ICON} resizeMode='contain' />
				</TouchableOpacity>
				{show_rv_login &&
					<TouchableOpacity
						style={styles.buttonContainer}
						onPress={() => { this._loginAsRV() }}>
						<Text style={styles.buttonText}>Login using RadioVault.com Account</Text>
						<Image style={[styles.buttonIcon]} source={CONST.LOGIN_ICON} resizeMode='contain' />
					</TouchableOpacity>
				}
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => { this._restoreAccount() }}>
					<Text style={styles.buttonText}>Restore Subscription</Text>
					<Image style={[styles.buttonIcon]} source={CONST.RE_SUBSCRIPTION_ICON} resizeMode='contain' />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttonContainer}
					onPress={() => { this._onPressFAQ() }}>
					<Text style={styles.buttonText}>FAQs</Text>
					<Image style={[styles.buttonIcon]} source={CONST.FAQS_ICON} resizeMode='contain' />
				</TouchableOpacity>
			</View>
		);
	}
	renderReferenceIdView() {
		return (
			<View style = {styles.referenceIdContainer} >
				<Text style = {commonstyles.referenceIdStyle} >
					{this.props.referenceId}
				</Text>
			</View>
		);
	}
	checkInternetStatus() {
		NetInfo.isConnected.fetch().then((isConnected)=>{
			this.props.commonAction.internetStatus(isConnected);
		});
	}
	render() {
		const {
			user,
		} = this.props;
		const userType = user && user.user_type;
		const isRadioSpiritUser = user && user.user_type == 'RadioSpirits';
		const isRadioVaultUser = user && user.user_type == 'RadioVault';
		if (this.props.internetStatus) {
			return (
				<SafeAreaView style={styles.container}>
					{this.renderTopContainer()}
					<ScrollView>
						{(isRadioSpiritUser || isRadioVaultUser) && this.renderUserSetiing(userType)}
						{(!isRadioSpiritUser && !isRadioVaultUser) && this.renderFreeUserContainer()}
					</ScrollView>
					{this.renderReferenceIdView()}
				</SafeAreaView>
			);
		} else {
			return (
				<View style={{flex:1,justifyContent:'center'}}>
					<View style={styles.viewContainer}>
						<Text style={styles.title}>
							No Internet Connection
						</Text>
						<TouchableOpacity style={{backgroundColor:'grey'}}
							onPress={()=>{this.checkInternetStatus()}}
						>
							<Text style={styles.retryButtonStyle}>
								Retry
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	}
}


SettingsComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	userLogout: PropTypes.func,
	startSpin: PropTypes.func,
};

