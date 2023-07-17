import React, { Component } from 'react';
import {
	View,
	TextInput,
	ScrollView,
	Keyboard,
	Alert,
	NetInfo,
	Platform,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import commonStyles from '../commonstyles';
import showToast from '../../utils/Toast';
import Validators from '../../utils/Validator';
import resetRoute from '../../utils/resetRoute';
import scale from '../../utils/scale';
import DeviceInfo from 'react-native-device-info';
import * as CONST from '../../utils/Const';
import firebase from 'react-native-firebase';
import TrackPlayer from 'react-native-track-player';

export default class SignupComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			email: '',
			password: '12345',
			isSelected: false,
			userInfo: null,
			error: null,
			isConnected: NetInfo.isConnected,
		};
	}
	async componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.SIGN_UP_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.SIGN_UP_SCREEN , udid });
		if(this.props.all_plans.length <= 0){
			let udid = DeviceInfo.getUniqueID();
			this.props.startSpin();
			this.props.iapActions.getSubscriptionPlans(udid);
		}
		NetInfo.isConnected.addEventListener(
			"connectionChange",
			() => this.handleFirstConnectivityChange
		);

	}
	_clearFields() {
		this.setState({
			email: '',
			password: '',
		})
	}
	_userLogin() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('USER_LOGIN',{event: 'Button Click' , udid});
		const { email } = this.state;
		if (Validators.isEmpty(email)) {
			showToast(CONST.EMAIL_VALIDATION);
		} else if (!Validators.validEmail(email)) {
			showToast(CONST.EMAIL_VALIDATION);
		} else {

			Keyboard.dismiss;
			this.props.startSpin();
			this.props.userLogin(email, DeviceInfo.getUniqueID());
		}
	}
	componentWillUnmount() {
		NetInfo.isConnected.removeEventListener(
			"connectionChange",
			() => this.handleFirstConnectivityChange
		);
	}
	handleFirstConnectivityChange(isConnected) {
		this.setState({
			isConnected: isConnected
		});
	}
	_loginAsRV() {
		this._clearFields();
		const { navigate } = this.props.navigation;
		navigate('RVSigninScreen');
	}
	_onSkipClick() {
		if(this.props.internetStatus) {
			let udid = DeviceInfo.getUniqueID();
			firebase.analytics().logEvent('NEW_USER_SKIP_CLICK',{event: 'Button Click' , udid});
			this.props.startSpin();
			this.props.clickSkip(udid);
			resetRoute('TabScreen', this.props.navigation);
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}
	
	async _restoreAccount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('RESTORE_ACCOUNT',{event: 'Button Click' , udid});
		this._clearFields();
		let response = null ;
		this.props.startSpin();
		response = await Validators.restoreAccount(this.props.all_plans);
		if(response.status){
			let {data} = response;
			TrackPlayer.stop();
			TrackPlayer.reset();
			this.props.stopSpin();
			firebase.analytics().logEvent('RESTORE_ACCOUNT_SUCCESS',{event: 'Button Click' , udid, referenceId: this.props.referenceId});
			Alert.alert('Restore Successful', 'You successfully restored the following purchases: ' + data.restoredTitles);
			data.platform = Platform.OS == 'ios' ? 'ios' : 'android';
			this.props.iapActions.postIAPProductStatusAct(data);
		}else{
			this.props.stopSpin();
			firebase.analytics().logEvent('RESTORE_ACCOUNT_FAILURE',{event: 'Button Click' , udid, referenceId: this.props.referenceId});
			Alert.alert('Restore Unsuccessful', response.message);
		}
	}
	_onClickTerms() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('TERMS_OF_SERVICE',{event: 'Button Click' , udid});
		this._clearFields();
		this.props.navigation.navigate('CommonWebViewScreen',{header:CONST.TERMS_OF_SERVICES,uri:CONST.TERMS_OF_SERVICES_URI});
	}
	_onClickPolicy() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('PRIVACY_POLICY',{event: 'Button Click' , udid});
		this._clearFields();
		this.props.navigation.navigate('CommonWebViewScreen',{header:CONST.PRIVACY_POLICY,uri:CONST.PRIVACY_POLICY_URI})
	}

	renderLogoContainer() {
		return (
			<View style={[commonStyles.center, styles.logoContainer]}>
				<Image style={styles.logoImg} source={CONST.LOGO_IMG} />
			</View>
		);
	}
	renderSubsText(showEmail) {
		let subHeadingText = '';
		const{
			signupWithEmail,
			signupWithoutEmail,
		} = this.props;
		if(showEmail){
			subHeadingText = signupWithEmail ? signupWithEmail.sub_heading : '';
		} else {
			subHeadingText = signupWithoutEmail ? signupWithoutEmail.sub_heading : '';
		}
		return (
			<View style={styles.freeTrialContainer}>
				<Text 
					numberOfLines = {3}
					style={styles.freeTrialTxt}>{subHeadingText}</Text>
			</View>
		);
	}
	renderCenterView() {
		let show_email;
		let show_rv_login;
		const {
			page_details,
		} = this.props;
		if (page_details) {
			show_email = page_details.show_email;
			show_rv_login = page_details.show_rv_login;
		}
		return (
			<View style={commonStyles.signInContainers}>
				{show_email && this.renderInputContainerView()}
				{show_email ? this.renderSubmitButtonView() : this.renderPremiumPlanButton()}
				{this.renderRestoreAccountView()}
				{show_rv_login && this.renderRVLoginView()}
			</View>
		);
	}

	renderRestoreAccountView() {
		const accountName = Platform.OS === "android" ? CONST.PLAYSTORE_TEXT : CONST.APPLESTORE_TEXT;
		return (
			<View>
				<View style={{ flexDirection: 'row', justifyContent: 'center' }} >
					<View style={styles.dashedLine}></View>
					<Text style={styles.orText}>OR</Text>
					<View style={styles.dashedLine}></View>
				</View>
				<TouchableOpacity 
					onPress={() => this._restoreAccount()}
					style={styles.subscriberContainer} >
					<Text
						style={styles.subTitle}>
						Already a Subscriber?{'\n'}Restore subscription with <Text style={commonStyles.appStoreText}>{accountName}</Text>
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	renderRVLoginView() {
		return (
			<View>
				<View style={{ flexDirection: 'row', justifyContent: 'center' }} >
					<View style={styles.dashedLine}></View>
					<Text style={styles.orText}>OR</Text>
					<View style={styles.dashedLine}></View>
				</View>
				<Text style={styles.rvLogin}
					onPress={() => this._loginAsRV()}>
					RadioVault.com Subscriber Login
				</Text>
			</View>
		);
	}

	renderSubmitButtonView() {
		const{
			signupWithEmail,
		} = this.props;
		const buttonText = signupWithEmail ? signupWithEmail.button_text : ''
		return (
			<TouchableOpacity
				style={styles.subsContainer}
				onPress={() => { this._userLogin(); }}>
				<Text 
					numberOfLines = {1}
					style={styles.subsText}>{buttonText}</Text>
			</TouchableOpacity>
		);
	}
	
	renderPremiumPlanButton() {
		const {
			signupWithoutEmail,
		} = this.props;
		const buttonText = signupWithoutEmail ? signupWithoutEmail.button_text : '';
		return (
			<TouchableOpacity
				style={[styles.subsContainer,{marginTop:scale(0)}]}
				onPress={() => { this.props.navigation.navigate('Subscriptionscreen') }}>
				<Text 
					numberOfLines = {1}
					style={styles.subsText}>{buttonText}</Text>
			</TouchableOpacity>
		);
	}

	renderInputContainerView() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.emailIconContainer}>
					<Image source={CONST.EMAIL_ICON} />
				</View>
				<View style={{ flex: 1 }}>
					<TextInput
						underlineColorAndroid={'transparent'}
						returnKeyType='next'
						placeholder='Email'
						value={this.state.email}
						autoCapitalize={'none'}
						ref={component => this.email = component}
						onChangeText={(email) => this.setState({ email })}
						keyboardType={'email-address'}
						style={styles.emailInput}
					/>

				</View>
				{this.state.email !== '' && <View style={styles.crossIconContainer}>
					<TouchableOpacity
						onPress={() => { this.setState({ email: '' }); }}
						style={[styles.crossIcon]}>
						<Image source={CONST.CROSS_ICON} />
					</TouchableOpacity>
				</View>}
			</View>
		);
	}

	renderTermsAndConditionView() {
		return (
			<View style={styles.footerContainer}>
				<Text
					style={styles.termsAndCondition}>
					By signing up you agree to our {'\n'}
					<Text
						style={styles.linkText}
						onPress={() => this._onClickTerms()}>Terms of Service
					</Text> and <Text style={styles.linkText}
						onPress={() => this._onClickPolicy()}>Privacy Policy</Text>
				</Text>
			</View>
		);
	}

	renderSkipButtonView() {
		return (
			<View style={[commonStyles.center, styles.skipContainer]}>
				<Text style={styles.skipText} onPress={() => this._onSkipClick()} >Skip</Text>
			</View>
		);
	}
	render() {
		let show_email = true;
		let show_skip = true;
		let titleText = ''
		const {
			page_details,
			signupWithEmail,
			signupWithoutEmail,
		} = this.props;
		if (page_details) {
			show_email = page_details.show_email;
			show_skip = page_details.show_skip;
		}
		if(show_email){
			titleText = signupWithEmail ? signupWithEmail.heading : '';
		} else {
			titleText = signupWithoutEmail ? signupWithoutEmail.heading : '';
		}
		
		return (
			<SafeAreaView style={commonStyles.safeAreaView}>
				{this.renderLogoContainer()}
				<View style={styles.container}>
					<ScrollView keyboardShouldPersistTaps='handled' >
						<View style={styles.accountHeading}>
							<Text style={styles.titleText}>{titleText}</Text>
						</View>
						{this.renderSubsText(show_email)}
						{this.renderCenterView()}
					</ScrollView>
					{this.renderTermsAndConditionView()}
					{show_skip ? this.renderSkipButtonView() : <View style = {{height: scale(10)}} /> }
				</View>
			</SafeAreaView>
		);
	}
}


SignupComponent.propTypes = {
	navigation: PropTypes.object,
	onSigninClicked: PropTypes.func,
	message: PropTypes.string,
	token: PropTypes.string,
};