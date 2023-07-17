/**
 * @author Systango Technologies 
 * Date: Aug 2, 2018
 * Description: Bonus Screen !
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import BonusComponent from './BonusComponent';
import showToast from '../../utils/Toast';
import { signinAct } from '../../actions/signinAction';
import { startSpinner, stopSpinner } from '../../actions/commonAction';

class BonusContainer extends Component {

	componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			if (this.props.status) {
				//resetRoute('SignupScreen',this.props.navigation);
			} else if (!this.props.status && this.props.message != '') {
				showToast(this.props.message);
			}
		}
	}
	static navigationOptions = {
		title: 'BONUS',
	};

	render() {
		return (
			<BonusComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer, commonReducer } = state;
	return {
		status: userDetailsReducer.status,
		message: userDetailsReducer.message,
		user: userDetailsReducer.user,
		internetStatus: commonReducer.internetStatus,
		referenceId: userDetailsReducer.referenceId,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {

	};
};

BonusContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	internetStatus: PropTypes.bool,
	referenceId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(BonusContainer);