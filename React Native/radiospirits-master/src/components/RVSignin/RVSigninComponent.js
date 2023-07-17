import React, { Component } from 'react';
import {
	View,
	TextInput,
	ScrollView,
	Keyboard,
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
import DeviceInfo from 'react-native-device-info';
import * as CONST from '../../utils/Const';
import scale from '../../utils/scale';
import firebase from 'react-native-firebase';
import TrackPlayer from 'react-native-track-player';

export default class RVSignupComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			email: '',
			password: '',
			isSelected: false
		};
	}
	componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.RV_LOGIN_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.RV_LOGIN_SCREEN , udid });
	}
	_clearFields() {
		this.setState({
			email: '',
			password: '',
		});
	}
	_onFocus(value) {
		this.setState({
			isSelected: value
		});
	}

	_onSubmit() {
		const { email, password } = this.state;
		if (Validators.isEmpty(email)) {
			showToast(CONST.EMAIL_VALIDATION);
		} else if (!Validators.validEmail(email)) {
			showToast(CONST.EMAIL_VALIDATION);
		} else if (Validators.isEmpty(password)) {
			showToast(CONST.PASSWORD_VALIDATION);
		} else {
			const udid = DeviceInfo.getUniqueID();
			firebase.analytics().setCurrentScreen(CONST.RV_LOGIN_SCREEN);
			firebase.analytics().logEvent('RV_USER_LOGIN',{event: 'Button Click' , email , udid });
			Keyboard.dismiss;
			this.props.startSpin();
			TrackPlayer.stop();
			TrackPlayer.reset();
			this.props.onRVUserLogin(email, password, udid);
		}
	}
	//TODO need to integrate API for get new RV password
	_onRetrive() {
		this._clearFields();
		this.props.navigation.navigate('CommonWebViewScreen', { header: CONST.RV_FORGOT_PASSWORD, uri: CONST.RV_FORGOT_PASSWORD_URI });
	}
	render() {
		return (
			<SafeAreaView style={commonStyles.safeAreaView}>
				<View style={styles.backIconContainer}>
					<TouchableOpacity
						style={{ paddingRight: scale(30) }}
						onPress={() => { this._clearFields(); this.props.navigation.goBack(); }}>
						<Image style={styles.backIcon} source={CONST.BACK_ICON} />
					</TouchableOpacity>
				</View>
				<View style={[commonStyles.center, styles.logoContainer]}>
					<Image source={CONST.LOGO_IMG} />
				</View>
				<View style={styles.container}>
					<ScrollView>
						<View style={styles.accountHeading}>
							<Text style={styles.titleText}>RadioVault.com Subscribers are eligible for free Premium Access. Use your <Text style={styles.boldText}>RadioVault.com</Text> login below</Text>
						</View>
						<View style={styles.signInContainers}>
							<View style={{ flexDirection: 'row' }}>
								<View style={[styles.emailIconContainer, { borderBottomWidth: 0, borderRightWidth: 0 }]}>
									<Image source={CONST.EMAIL_ICON} />
								</View>
								<View style={{ flex: 1, }}>
									<TextInput
										underlineColorAndroid={'transparent'}
										returnKeyType='next'
										placeholder='Email'
										value={this.state.email}
										autoCapitalize={'none'}
										ref={component => this.email = component}
										onChangeText={(email) => this.setState({ email })}
										keyboardType={'email-address'}
										style={[styles.emailInput, { borderBottomWidth: 0 }]}
									/>

								</View>
								{this.state.email !== '' &&
									<View style={styles.crossIconContainer}>
										<TouchableOpacity onPress={() => { this.setState({ email: '' }); }} style={[styles.crossIcon]}>
											<Image source={CONST.CROSS_ICON} />
										</TouchableOpacity>
									</View>
								}
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={styles.emailIconContainer}>
									<Image source={CONST.PASSWORD_ICON} />
								</View>
								<View style={{ flex: 1, }}>
									<TextInput
										underlineColorAndroid={'transparent'}
										returnKeyType='next'
										placeholder='Password'
										value={this.state.password}
										autoCapitalize={'none'}
										secureTextEntry={true}
										ref={component => this.password = component}
										onChangeText={(password) => this.setState({ password })}
										style={styles.emailInput}
									/>

								</View>
								{this.state.password !== '' &&
									<View style={styles.crossIconContainer}>
										<TouchableOpacity onPress={() => { this.setState({ password: '' }); }} style={[styles.crossIcon]}>
											<Image source={CONST.CROSS_ICON} />
										</TouchableOpacity>
									</View>
								}
							</View>
							<TouchableOpacity style={styles.subsContainer} onPress={() => this._onSubmit()}>
								<Text style={styles.subsText}>SUBMIT</Text>
							</TouchableOpacity>
							<View style={styles.forgetRVContainer}>
								<Text style={[styles.forgotText]}>Forgot your RadioVault.com Password?{'\n'}<Text style={styles.semiBoldText} onPress={() => this._onRetrive()}>Retrieve Here</Text></Text>
							</View>
						</View>
					</ScrollView>
					<Text style={styles.bottomText}>Learn more about RadioVault.com on Bonus Page</Text>
				</View>
			</SafeAreaView>
		);
	}
}


RVSignupComponent.propTypes = {
	navigation: PropTypes.object,
	onSigninClicked: PropTypes.func,
	message: PropTypes.string,
	token: PropTypes.string,
	onRVUserLogin: PropTypes.func,
	startSpin: PropTypes.func,
	playerCommonAction: PropTypes.func,
};