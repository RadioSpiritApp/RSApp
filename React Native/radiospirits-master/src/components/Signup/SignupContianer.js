/**
 * @author Systango Technologies
 * Date: Aug2, 2018 
 * Description: SignUp Screen.
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import SignupComponent from './SignupComponent';
import showToast from '../../utils/Toast';
import { bindActionCreators } from 'redux';
import { signinAct, createDeviceAct, signUpAct, userLoginAct } from '../../actions/signinAction';
import { startSpinner, stopSpinner } from '../../actions/commonAction';
import Orientation from 'react-native-orientation';
import resetRoute from '../../utils/resetRoute';
import { getHomepageScreenDataAct } from '../../actions/screenDataAction';
import * as iapActions from '../../actions/inAppPurchaseAction';

class SignupContainer extends Component {

	componentDidMount() {
		Orientation.lockToPortrait();
	}

	componentDidUpdate(prevProps) {
		const { navigate } = this.props.navigation;
		if (this.props !== prevProps) {
			if(this.props.restore_redirect_to != 'signup'){
				if (this.props.status && this.props.user_confirmed) {
					resetRoute('TabScreen', this.props.navigation);
				} else if (this.props.status && this.props.user && this.props.user.user_type != 'RadioVault') {
					if(!this.props.user_confirmed && !this.props.user.subscription || (this.props.user.subscription && this.props.user.subscription.is_expired)){
						navigate('EmailValidatorScreen');
					}else{
						resetRoute('TabScreen', this.props.navigation);
					}
				} else if (!this.props.status && this.props.message != '') {
					showToast(this.props.message);
				}
			}
		}
	}

	render() {
		return (
			<SignupComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer, createDeviceReducer, inAppPurchaseReducer, configurableTextReducer ,commonReducer} = state;
	return {
		status: userDetailsReducer.status,
		message: userDetailsReducer.message,
		user: userDetailsReducer.user,
		user_confirmed: userDetailsReducer.user_confirmed,
		page_details: createDeviceReducer.page_details,
		plans: inAppPurchaseReducer.plans,
		all_plans: inAppPurchaseReducer.all_plans,
		signupWithEmail: configurableTextReducer.signupWithEmail,
		signupWithoutEmail: configurableTextReducer.signupWithoutEmail,
		internetStatus: commonReducer.internetStatus,
		restore_redirect_to: inAppPurchaseReducer.redirect_to,
		referenceId: userDetailsReducer.referenceId,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		iapActions: bindActionCreators(iapActions,dispatch),
		onSigninClicked: (email, password) => {
			dispatch(signinAct(email, password));
		},
		createDevice: (device_info) => {
			dispatch(createDeviceAct(device_info));
		},
		signUp: (userData) => {
			dispatch(signUpAct(userData));
		},
		userLogin: (email, udid) => {
			dispatch(userLoginAct(email, udid));
		},
		startSpin: () => {
			dispatch(startSpinner());
		},
		stopSpin: () => {
			dispatch(stopSpinner());
		},
		clickSkip: (udid) => {
			dispatch(getHomepageScreenDataAct(udid));
		}
	};
};

SignupContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	user_confirmed: PropTypes.bool,
	user: PropTypes.object,
	user_type: PropTypes.string,
	restore_redirect_to: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer);