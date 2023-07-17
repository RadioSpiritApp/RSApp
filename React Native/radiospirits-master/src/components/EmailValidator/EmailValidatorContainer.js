/**
 * @author Systango Technologies 
 * Date: Aug 16, 2018
 * Description: Email Validator Screen !
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import EmailValidatorComponent from './EmailValidatorComponent';
import { emailVerificationAct } from '../../actions/emailVerificationAction';
import { startSpinner, stopSpinner } from '../../actions/commonAction';
import resetRoute from '../../utils/resetRoute';

class EmailValidatorContainer extends Component {

	static navigationOptions = {
		title: 'EmailValidator',
		headerStyle: {
			backgroundColor: '#3369c6',
		},
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontWeight: 'bold',
		},
	};
	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			if (this.props.emailStatus) {
				//showToast(this.props.emailMessage);
				resetRoute('TabScreen', this.props.navigation);
			} else if (!this.props.emailStatus && this.props.emailMessage != '') {
				//showToast(this.props.emailMessage);
			}
		}
	}
	render() {
		return (
			<EmailValidatorComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer, configurableTextReducer, emailVerificationReducer } = state;
	return {
		status: userDetailsReducer.status,
		message: userDetailsReducer.message,
		user: userDetailsReducer.user,
		user_confirmed: userDetailsReducer.user_confirmed,
		emailStatus: emailVerificationReducer.status,
		emailMessage: emailVerificationReducer.message,
		emailVerification: configurableTextReducer.emailVerification,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		onEmailVerification: (udid) => {
			dispatch(emailVerificationAct(udid));
		},
		startSpin: () => {
			dispatch(startSpinner());
		},
		stopSpin: () => {
			dispatch(stopSpinner());
		}
	};
};

EmailValidatorContainer.propTypes = {
	navigation: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailValidatorContainer);