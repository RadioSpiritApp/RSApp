/**
 * @author Systango Technologies
 * Date: Aug 2, 2018 
 * Description: Settings Screen.
 * 
 */
import React, {
	Component
} from 'react';

import {
	connect
} from 'react-redux';
import PropTypes from 'prop-types';
import SettingsComponent from './SettingsComponent';
import showToast from '../../utils/Toast';
import AsyncStorageUtil from '../../utils/asyncStore';
import { userLogoutAct } from '../../actions/signinAction';
import { startSpinner, stopSpinner } from '../../actions/commonAction';
import resetRoute from '../../utils/resetRoute';
import * as CONST from '../../utils/Const';
import { getRootNavigation } from '../../AppRoot';
import { bindActionCreators } from 'redux';
import * as iapActions from '../../actions/inAppPurchaseAction';
import * as playerCommonAction from '../../actions/playerCommonAction';
import * as downloadAction from '../../actions/downloadAction';
import TrackPlayer from 'react-native-track-player';
import * as commonAction from '../../actions/commonAction';
class SettingsContainer extends Component {

	componentDidUpdate(prevProps) {
		if (this.props.status !== prevProps.status) {
			if (this.props.status && this.props.message != '' && !this.props.user) {
				AsyncStorageUtil.removeAsyncstorage(CONST.AUTH_TOKEN_KEY);
				AsyncStorageUtil.removeAsyncstorage(CONST.USER_OBJECT);
				this.props.playerCommonAction.emptyPlayerListAct();
				TrackPlayer.stop();
				TrackPlayer.reset();
				resetRoute('SignupScreen', getRootNavigation());
			} else if (!this.props.status && this.props.message != '') {
				showToast(this.props.message);
			}
		}
	}
	render() {
		return (
			<SettingsComponent {...this.props} />
		);
	}
}

function mapStateToProps(state) {
	const { userDetailsReducer, inAppPurchaseReducer, createDeviceReducer, commonReducer, downloadEpisodeReducer } = state;
	return {
		status: userDetailsReducer.logoutStatus,
		message: userDetailsReducer.logoutMessage,
		user: userDetailsReducer.user,
		all_plans: inAppPurchaseReducer.all_plans,
		page_details: createDeviceReducer.page_details,
		referenceId: userDetailsReducer.referenceId,
		internetStatus: commonReducer.internetStatus,
		userId: downloadEpisodeReducer.userId,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		iapActions: bindActionCreators(iapActions, dispatch),
		playerCommonAction: bindActionCreators(playerCommonAction, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
		commonAction: bindActionCreators(commonAction, dispatch),
		userLogout: (userData) => {
			dispatch(userLogoutAct(userData));
		},
		startSpin: () => {
			dispatch(startSpinner());
		},
		stopSpin: () => {
			dispatch(stopSpinner());
		}
	};
};

SettingsContainer.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	status: PropTypes.bool,
	message: PropTypes.string,
	user: PropTypes.object,
	playerCommonAction: PropTypes.object,
	internetStatus: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);