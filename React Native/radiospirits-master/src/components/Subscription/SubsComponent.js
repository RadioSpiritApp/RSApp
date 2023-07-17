import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Platform,
	FlatList,
	SafeAreaView,
	TouchableOpacity,
	Text,
	Image,
	TextInput,
	LayoutAnimation,
	KeyboardAvoidingView,
	ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import styles from './style';
import showToast from '../../utils/Toast';
import scale from '../../utils/scale';
import * as RNIap from 'react-native-iap';
import commonStyles from '../commonstyles';
import DeviceInfo from 'react-native-device-info';
import * as CONST from '../../utils/Const';
import Validators from '../../utils/Validator';
import NoInternetView from '../Offline/NoInternetView';
import firebase from 'react-native-firebase';
import TrackPlayer from 'react-native-track-player';

export default class SubsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			subscriptionModal: false,
			productId: '',
			showError: false,
			isCollapseOpne: true,
			showActivity: true,
		};
	}
	async componentDidMount() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.SUBSCRIPTION_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name: CONST.SUBSCRIPTION_SCREEN, udid });
		this.props.startSpin();
		try {
			const result = await RNIap.initConnection();
			console.log('result', result);
		} catch (err) {
			console.log(err.code, err.message);
		}
		this.props.iapActions.getSubscriptionPlans(udid);
	}
	async prepareProducts() {
		let iosProducts = [];
		iosProducts = this.props.all_plans.map(item => item.itunes_id);
		let androidProducts = [];
		androidProducts = this.props.all_plans.map(item => item.play_store_id);
		const itemSkus = Platform.select({
			ios: iosProducts,
			android: androidProducts
		});
		try {
			await RNIap.initConnection();
			const products = await RNIap.getSubscriptions(itemSkus);
			if(products){
				this.setState({showActivity: false});
			}
		} catch (err) {
			console.log('## prepareProducts catch error ', err);
			console.warn(err); // standardized err.code and err.message available
		}
	}
	async componentDidUpdate(prevProps, prevState) {
		if (this.props !== prevProps) {
			if (this.props.inAppStatus) {
				await this.prepareProducts();
			} else if (!this.props.inAppStatus && this.props.inAppMessage != '') {
				showToast(this.props.inAppMessage);
			}
		}
	}

	componentWillUnmount() {
		RNIap.endConnection();
	}

	renderHeaderSection() {
		return (
			<View style={styles.headerContainer}>
				<TouchableOpacity
					style={styles.backIconContainer}
					onPress={() => this.props.navigation.goBack()}>
					<Image source={CONST.BACK_ICON} />
				</TouchableOpacity>
				<Text style={styles.sampleText}>
					SUBSCRIPTION
				</Text>
			</View>
		);
	}

	renderSubscriptionPlanSection() {
		return (
			<View style={{ marginTop: scale(35) }} >
				<FlatList
					data={this.props.plans}
					extraData={this.state}
					keyExtractor={item => item.id}
					renderItem={({ item }) => this.renderSubscriptionList(item)}
				/>
			</View>
		);
	}

	emailVerification(productId) {
		const { user, page_details } = this.props;
		this.setState({ productId })

		if (page_details.show_email && (!user || (user && user.page_details && user.page_details.show_email && !user.email))) {
			this.toggleSubscriptionPopUp();
		}
		else {
			this.purchaseSubscriptionPlan(productId)
		}
	}
	continuePurchaseSubscriptionPlan(email) {
		let { productId } = this.state;
		if (Validators.isEmpty(email)) {
			this.setState({ showError: true })
		} else if (!Validators.validEmail(email)) {
			this.setState({ showError: true })
		} else {
			console.log(email);
			this.toggleSubscriptionPopUp();
			this.purchaseSubscriptionPlan(productId, email);
		}
	}
	toggleSubscriptionPopUp() {
		this.setState({ email: '', showError: false, subscriptionModal: !this.state.subscriptionModal })
	}
	renderSubscriptionPopUp() {
		const {
			subscriptionModal
		} = this.state;
		return (
			<Modal
				animationIn={'zoomIn'}
				animationOut={'zoomOut'}
				isVisible={subscriptionModal}
			>
				<KeyboardAvoidingView keyboardVerticalOffset={Platform.OS == 'ios' ? scale(150) : null} behavior={Platform.OS == 'ios' ? "padding" : "none"} >
					<View style={styles.modalContainer}>
						<Image
							source={CONST.TOP_IMAGE}
						/>
						<Text style={styles.subscriptionModalText}>
							{'Please enter your email id'} {this.state.showError && <Text style={{ color: 'red' }}>{'Invalid Email Address'}</Text>}
						</Text>
						<View style={styles.emailContainer}>
							<View style={styles.emailIconContainer}>
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
									style={styles.emailInput}
									onSubmitEditing={() => { this.continuePurchaseSubscriptionPlan(this.state.email) }}
								/>
							</View>
						</View>
						<TouchableOpacity style={styles.buttonStyle} onPress={() => { this.continuePurchaseSubscriptionPlan(this.state.email) }}>
							<Text style={styles.buttonTextStyle}>CONTINUE</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.modalCrossImageStyle}
							onPress={() => this.toggleSubscriptionPopUp()}>
							<Image
								source={CONST.CROSS_IMAGE}
							/>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		);
	}
	async purchaseSubscriptionPlan(productId, email = '') {
		console.log('$$$$ purchaseSubscriptionPlan productId ', productId);
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('SUBSCRIPTION_PURCHASE', { event: 'Button Click', udid });
		this.props.startSpin()
		RNIap.buySubscription(productId).then(purchase => {
			this.props.stopSpin();
			let data = {
				udid: DeviceInfo.getUniqueID(),
				transaction_receipt: purchase.purchaseToken || purchase.transactionReceipt,
				transaction_date: purchase.originalTransactionDateIOS ? purchase.originalTransactionDateIOS : purchase.transactionDate,
				product_id: purchase.productId,
				transaction_identifier: purchase.originalTransactionIdentifierIOS ? purchase.originalTransactionIdentifierIOS : purchase.transactionId,
				subscription_type: CONST.PURCHASE,
				email: email,
				platform: Platform.OS == 'ios' ? 'ios' : 'android'
			};
			this.props.iapActions.postIAPProductStatusAct(data);
			firebase.analytics().logEvent('SUBSCRIPTION_PURCHASE_SUCCESS', { event: 'Button Click', udid, referenceId:this.props.referenceId });
		}).catch(err => {
			this.props.stopSpin();
			console.log('$$$$ purchaseSubscriptionPlan purchase error : ', err); // standardized err.code and err.message available
			alert(err.message);
			firebase.analytics().logEvent('SUBSCRIPTION_PURCHASE_FAILURE', { event: 'Button Click', udid, referenceId:this.props.referenceId });
		})
	}

	renderSubscriptionList(item) {
		const {
			user,
		} = this.props;
		
		let isSubscribed = false;

		if (user && user.subscription) {
			const {
				subscription,
			} = user;
			if (subscription) {
				if (Platform.OS == 'ios') {
					if (item.itunes_id == subscription.plan_itunes_id) {
						isSubscribed = true;
					}
				} else {
					if (item.play_store_id == subscription.plan_playstore_id) {
						isSubscribed = true;
					}
				}
			}
		}

		return (
			<View style={styles.subscriptionListCell} >
				<View style={{ flexDirection: 'row', }} >
					<Image
						style={{ marginRight: scale(15) }}
						source={CONST.SUBSCRIPTION_ICON}
					/>
					<View style={{ justifyContent: 'center' }}>
						<Text style={styles.planTitleTextStyle} >
							{item.title}
						</Text>
						<Text style={styles.planAmountTextStyle} >
							${item.amount}
						</Text>
					</View>
				</View>
				{!isSubscribed ? <View>
					{this.state.showActivity ?
						<ActivityIndicator style={styles.indicatorStyle} />
						:
						<TouchableOpacity
							onPress={() => this.emailVerification(Platform.OS == 'ios' ? item.itunes_id : item.play_store_id)}
							style={styles.subscribeButton} >
							<Text style={styles.buttonText} >
								Subscribe
						</Text>
						</TouchableOpacity>
					}
					<Text style={styles.durationText} >
						For {item.validity_text}
					</Text>
				</View> : <View>
						<Text style={styles.buttonText} >
							Subscribed!
					</Text>
					</View>
				}
			</View>
		);
	}

	_onPressTOS() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('TERMS_OF_SERVICE', { event: 'Button Click', udid });
		this.props.navigation.navigate('CommonWebViewScreen', { header: CONST.TERMS_OF_SERVICES, uri: CONST.TERMS_OF_SERVICES_URI })
	}

	_onPressPrivacyPolicy() {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('PRIVACY_POLICY', { event: 'Button Click', udid });
		this.props.navigation.navigate('CommonWebViewScreen', { header: CONST.PRIVACY_POLICY, uri: CONST.PRIVACY_POLICY_URI })
	}

	renderFooterSection() {
		const {
			subscriptionPlanTerms,
		} = this.props;
		let termsText = subscriptionPlanTerms ? subscriptionPlanTerms.footer : '';
		termsText = termsText.split('##');
		let arrowicon = this.state.isCollapseOpne ? CONST.UP_ARROW : CONST.DOWN_ARROW;
		var header = (
			<View style={styles.termsHeaderContainer}>
				<View><Text style={styles.termsTextHeading}>iTunes Terms</Text></View>
				<TouchableOpacity style={{ padding: 5 }} onPress={() => { LayoutAnimation.easeInEaseOut(); this.setState({ isCollapseOpne: !this.state.isCollapseOpne }) }}>
					<Image source={arrowicon} />
				</TouchableOpacity>
			</View>
		);
		var content = (
			<View style={styles.termsContentContainer}>
				{termsText.map((item, key) => (
					<Text key={key} style={styles.termsText}>• {item.trim()} </Text>)
				)}
			</View>
		);
		return (
			<View style={styles.footerContainerTerms}>
				{Platform.OS == 'ios' &&
					<View style={[styles.termsContainer]} >
						{header}
						{this.state.isCollapseOpne && content}
					</View>
				}
				<Text style={styles.footerTextStyle}>
					By subscribing, you agree to our{'\n'}
					<Text
						style={styles.linkText}
						onPress={() => this._onPressTOS()}>Terms of Service
				</Text> and <Text style={styles.linkText}
						onPress={() => this._onPressPrivacyPolicy()}>Privacy Policy</Text>
				</Text>
			</View>
		);
	}
	render() {
		if (this.props.internetStatus) {
			return (
				<SafeAreaView style={commonStyles.safeAreaView}>
					{this.renderHeaderSection()}
					<Text style={styles.title}>
						Select your Premium Plan
					</Text>
					<ScrollView>
						{this.renderSubscriptionPlanSection()}
						{this.renderFooterSection()}
					</ScrollView>

					{this.renderSubscriptionPopUp()}
				</SafeAreaView>
			);
		} else {
			return (
				<NoInternetView />
			);
		}
	}
}


SubsComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
};