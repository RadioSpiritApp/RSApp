/**
 * @author Systango Technologies 
 * Date: 
 * Description: Common Modal Screen !
 * 
 */
import React, { Component } from 'react';
import {
	View,
	ScrollView,
	TouchableOpacity,
	Text,
	Image,
	Platform,
	Alert,
} from 'react-native';
import styles from './style';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import scale from '../../utils/scale';
import { hidePremiumModal } from '../../actions/commonAction';
import { getRootNavigation } from '../../AppRoot';
import DeviceInfo from 'react-native-device-info';
import Validators from '../../utils/Validator';
import { startSpinner, stopSpinner } from '../../actions/commonAction';
import { bindActionCreators } from 'redux';
import * as iapActions from '../../actions/inAppPurchaseAction';
import * as downloadAction from '../../actions/downloadAction';
import * as CONST from '../../utils/Const';
import commonStyles from '../commonstyles';
import TrackPlayer from 'react-native-track-player';
import firebase from 'react-native-firebase';

class CommonModal extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	componentDidUpdate(prevProps) {
		if(prevProps.inAppPostStatus !== this.props.inAppPostStatus ) {
			if (this.props.user && this.props.user.is_paid_user) {
				let { id } = this.props.user;
				if (this.props.userId != id) {
					this.props.downloadAction.clearDownloadList(id);
				}
			}
		}
	}
	componentDidMount() {
		if (this.props.all_plans.length <= 0) {
			let udid = DeviceInfo.getUniqueID();
			this.props.startSpin();
			this.props.iapActions.getSubscriptionPlans(udid);
		}
	}
	renderHeaderSection() {
		const {
			headingStyle,
			configureTextObj,
		} = this.props;
		return (
			<View>
				<Text style={[styles.headingTextStyle, headingStyle]} >
					{configureTextObj.heading}
				</Text>
				<Text style={styles.modalContentText}>
					{configureTextObj.sub_heading}
				</Text>
				<Text style={styles.modalParagraphText}>
					{configureTextObj.description_1}
				</Text>
			</View>
		);
	}

	renderRectangleView() {
		const {
			configureTextObj,
		} = this.props;
		return (
			<View style={styles.benefitContainer}>
				<View style={styles.benefitContent}>
					<Image source={CONST.TICK_ICON} />
					<Text style={styles.benefitContentText}>
						{configureTextObj.pointer_1}
					</Text>
				</View>
				<View style={styles.benefitContent}>
					<Image source={CONST.TICK_ICON} />
					<Text style={styles.benefitContentText}>
						{configureTextObj.pointer_2}
					</Text>
				</View>
				<View style={styles.benefitContent}>
					<Image source={CONST.TICK_ICON} />
					<Text style={styles.benefitContentText}>
						{configureTextObj.pointer_3}
					</Text>
				</View>
				<View style={[styles.benefitContent, {}]}>
					<Image source={CONST.TICK_ICON} />
					<Text style={styles.benefitContentText}>
						{configureTextObj.pointer_4}
					</Text>
				</View>
			</View>
		);
	}

	renderButtonContainer() {
		const {
			configureTextObj,
		} = this.props;
		return (
			<View>
				<Text style={styles.buttonHeadingText}>
					{configureTextObj.description_2}
				</Text>
				<TouchableOpacity
					onPress={() => this.onPressPremiumPlanButton()}
					style={styles.premiumButton}
				>
					<Text
						numberOfLines={1}
						style={styles.premiumButtonText}>{configureTextObj.button_text}</Text>
				</TouchableOpacity>
			</View>
		);
	}

	onPressPremiumPlanButton() {
		this.props.hidePremiumModal();
		getRootNavigation().navigate('Subscriptionscreen');
	}

	redirectToRvLogin() {
		this.props.hidePremiumModal();
		getRootNavigation().navigate('RVSigninScreen');
	}
	async _restoreAccount() {
		const udid = DeviceInfo.getUniqueID();
		let response = null ;
		this.props.hidePremiumModal();
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
							this.props.stopSpin();
						}
					}
				]
			);
			TrackPlayer.stop();
			TrackPlayer.reset();
			data.platform = Platform.OS == 'ios' ? 'ios' : 'android';
			this.props.iapActions.postIAPProductStatusAct(data);
			firebase.analytics().logEvent('RESTORE_ACCOUNT_SUCCESS',{event: 'Button Click' , udid, referenceId: this.props.referenceId});
		} else {
			this.props.stopSpin();
			Alert.alert('Restore Unsuccessful', response.message);
			firebase.analytics().logEvent('RESTORE_ACCOUNT_FAILURE',{event: 'Button Click' , udid, referenceId: this.props.referenceId});
		}
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
					onPress={() => { this._restoreAccount(); }}
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
					onPress={() => this.redirectToRvLogin()}>
					RadioVault.com Subscriber Login
				</Text>
			</View>
		);
	}


	render() {
		const {
			isVisible,
			configureTextObj,
			page_details,
		} = this.props;
		let show_rv_login = page_details && page_details.show_rv_login;
		if (!configureTextObj) {
			return (
				<View />
			);
		}
		return (
			<View>
				<Modal
					animationIn={'zoomIn'}
					animationOut={'zoomOut'}
					isVisible={isVisible}>
					<View style={styles.modalContainer}>
						<Image
							source={CONST.TOP_IMAGE}
							style={{ position: 'absolute' }}
						/>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollViewContent}>
							{this.renderHeaderSection()}
							{this.renderRectangleView()}
							{this.renderButtonContainer()}
							{this.renderRestoreAccountView()}
							{show_rv_login && this.renderRVLoginView()}
							<View style={{ height: scale(50) }} />
						</ScrollView>
						<TouchableOpacity
							style={styles.crossImageStyle}
							onPress={() => this.props.hidePremiumModal()}>
							<Image
								source={CONST.CROSS_IMAGE}
							/>
						</TouchableOpacity>
					</View>
				</Modal>
			</View>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		iapActions: bindActionCreators(iapActions, dispatch),
		downloadAction: bindActionCreators(downloadAction, dispatch),
		hidePremiumModal: () => {
			dispatch(hidePremiumModal());
		},
		startSpin: () => {
			dispatch(startSpinner());
		},
		stopSpin: () => {
			dispatch(stopSpinner());
		}
	};
};

function mapStateToProps(state) {
	const { configurableTextReducer, commonReducer, inAppPurchaseReducer, createDeviceReducer, userDetailsReducer, downloadEpisodeReducer } = state;
	return {
		configureTextObj: configurableTextReducer.freeUserBlockPopup,
		isVisible: commonReducer.isVisible,
		all_plans: inAppPurchaseReducer.all_plans,
		inAppPostStatus: inAppPurchaseReducer.inAppPostStatus,
		page_details: createDeviceReducer.page_details,
		userId: downloadEpisodeReducer.userId,
		user: userDetailsReducer.user,
		referenceId: userDetailsReducer.referenceId,
	};
}

CommonModal.propTypes = {
	configureTextObj: PropTypes.object,
	headingStyle: PropTypes.object,
	isVisible: PropTypes.bool,
	hidePremiumModal: PropTypes.func,
	navigation: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonModal);

