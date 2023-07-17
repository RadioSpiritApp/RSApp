/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: Signin Screen.
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import RVSigninComponent from './RVSigninComponent';
import showToast from '../../utils/Toast';
import { rvUserLoginAct } from '../../actions/signinAction';
import { emptyPlayerListAct } from '../../actions/playerCommonAction';
import { startSpinner, stopSpinner } from '../../actions/commonAction';
import resetRoute from '../../utils/resetRoute';

class RVSigninContainer extends Component {

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			if (this.props.status) {
				this.props.emptyPlayerListAct();
				resetRoute('TabScreen', this.props.navigation);
			} else if (!this.props.status && this.props.message != '') {
				showToast(this.props.message);
			}
		}
	}

	render() {
		return (
			<RVSigninComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer } = state;
	return {
		status: userDetailsReducer.status,
		message: userDetailsReducer.message,
		user: userDetailsReducer.user,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		onRVUserLogin: (email, password, udid) => {
			dispatch(rvUserLoginAct(email, password, udid));
		},
		startSpin: () => {
			dispatch(startSpinner());
		},
		stopSpin: () => {
			dispatch(stopSpinner());
		},
		emptyPlayerListAct: () => {
			dispatch(emptyPlayerListAct());
		}
	};
};

RVSigninContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	emptyPlayerListAct: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(RVSigninContainer);