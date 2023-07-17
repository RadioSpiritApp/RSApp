/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: Subscription Screen.
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import SubsComponent from './SubsComponent';
import { bindActionCreators } from 'redux';
import showToast from '../../utils/Toast';
import * as iapActions from '../../actions/inAppPurchaseAction';
import { startSpinner, stopSpinner } from '../../actions/commonAction';
import resetRoute from '../../utils/resetRoute';


class SubsContainer extends Component {

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			if (this.props.status && this.props.user && this.props.user.subscription) {
				showToast(this.props.message);
				resetRoute('TabScreen', this.props.navigation);
			} else if (!this.props.status && this.props.message != '') {
				showToast(this.props.message);
			}
		}
	}

	static navigationOptions = {
		title: 'Subs',
		headerStyle: {
			backgroundColor: '#3369c6',
		},
		headerTintColor: '#fff',
		headerTitleStyle: {
			fontWeight: 'bold',
		},
	};

	render() {
		return (
			<SubsComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { inAppPurchaseReducer, userDetailsReducer, configurableTextReducer, commonReducer, createDeviceReducer } = state;
	return {
		status: inAppPurchaseReducer.inAppPostStatus,
		message: inAppPurchaseReducer.inAppPostMessage,
		user: userDetailsReducer.user,
		plans: inAppPurchaseReducer.plans,
		all_plans: inAppPurchaseReducer.all_plans,
		inAppStatus: inAppPurchaseReducer.inAppStatus,
		inAppMessage: inAppPurchaseReducer.inAppMessage,
		subscriptionPlanTerms: configurableTextReducer.subscriptionPlan,
		internetStatus: commonReducer.internetStatus,
		page_details: createDeviceReducer.page_details,
		referenceId: userDetailsReducer.referenceId,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		iapActions: bindActionCreators(iapActions, dispatch),
		startSpin: () => {
			dispatch(startSpinner());
		},
		stopSpin: () => {
			dispatch(stopSpinner());
		},
	};
};

SubsContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	internetStatus: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubsContainer);