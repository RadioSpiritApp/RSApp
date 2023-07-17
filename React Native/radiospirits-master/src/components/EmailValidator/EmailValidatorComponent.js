import React, { Component } from 'react';
import {
	View,
	Keyboard,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import commonStyles from '../commonstyles';
import resetRoute from '../../utils/resetRoute';
import * as CONST from '../../utils/Const';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

export default class EmailValidatorComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	componentDidMount() {
		Keyboard.dismiss();
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.EMAIL_VALIDATOR_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name : CONST.EMAIL_VALIDATOR_SCREEN , udid });
	}
	_onSubmit() {
		// Bypassing email verification check.

		resetRoute('TabScreen', this.props.navigation);
	}
	_goToSignUp() {
		resetRoute('SignupScreen', this.props.navigation);
	}
	render() {
		const {
			user,
		} = this.props;
		let email = (user && user.email) ? user.email : '';
		const {
			emailVerification,
		} = this.props;
		const headingText = emailVerification ? emailVerification.heading : '';
		const description = emailVerification ? emailVerification.sub_heading : '';
		const buttonText = emailVerification ? emailVerification.button_text : '';
		return (
			<SafeAreaView style={commonStyles.safeAreaView}>
				<View style={styles.backIconContainer}>
					<TouchableOpacity onPress={() => this._goToSignUp()}>
						<Image style={styles.backIcon} source={CONST.BACK_ICON} />
					</TouchableOpacity>
				</View>
				<View style={styles.emailIconContainer}>
					<Image style={styles.imageStyle} source={CONST.VERIFY_EMAIL_ICON} />
				</View>
				<Text 
					numberOfLines= {2}
					style={styles.titleHeaderStyle}>{headingText}</Text>
				<Text 
					numberOfLines= {3}
					style={styles.titleContentStyle}>{description}{' \n'+email}</Text>
				<View style={{ flex: 1, justifyContent: 'flex-end' }} >
					<TouchableOpacity style={styles.buttonBtnStyle}
						onPress={() => this._onSubmit()}
					>
						<Text 
							numberOfLines = {1}
							style={styles.buttonTextStyle}>{buttonText}</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}
EmailValidatorComponent.propTypes = {
	navigation: PropTypes.object,
	onEmailVerification: PropTypes.func,
	startSpin: PropTypes.func,
	stopSpin: PropTypes.func,
	user: PropTypes.object,
	email: PropTypes.string,
	emailVerification: PropTypes.object,
};