import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Keyboard,
	SafeAreaView,
	TouchableOpacity,
	Text,
	FlatList,
	Image,
	RefreshControl,
	BackHandler,
	Alert,
	Platform
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import showToast from '../../utils/Toast';
import commonStyles from '../commonstyles';
import { setRootNavigation } from '../../AppRoot';
import CommonModal from '../CommonModal';
import MiniPlayer from '../Player/MiniPlayer/MiniPlayerContainer';
import { CachedImage } from 'react-native-cached-image';
import DeviceInfo from 'react-native-device-info';
import * as CONST from '../../utils/Const';
import Validators from '../../utils/Validator';
import TrackPlayer from 'react-native-track-player';
import firebase from 'react-native-firebase';

let playerCommonActionObj = {};
let commonActionObj = {};
let bookmarkObject = {};
let isFreeUser = false;
let accessToken = '';
TrackPlayer.registerEventHandler(async (data) => {
	let episodeId = await TrackPlayer.getCurrentTrack();
	switch (data.type) {
		case 'playback-state':
			if (data.state == 'paused' || data.state == 2) {
				playerCommonActionObj.changeState(false);
			} else if (data.state == 'playing' || data.state == 3) {
				playerCommonActionObj.changeState(true);
				commonActionObj.toggleBufferState(false);
			} else if (data.state == 'buffering' || data.state == 4) {
				commonActionObj.toggleBufferState(true);
			}
			break;
		case 'playback-track-changed':
			if (data.nextTrack) {
				playerCommonActionObj.changeState(true);
				const track = await TrackPlayer.getTrack(data.nextTrack);
				playerCommonActionObj.updateCurrentAudioDetail(track);
				if (!track) {
					playerCommonActionObj.updateResetEnable(false);
				} else {
					playerCommonActionObj.updateStreamCountAct(track.id);
				}
			}
			break;
		case 'remote-play':
			playerCommonActionObj.changeState(true);
			TrackPlayer.play();
			break;
		case 'remote-pause':
			if (!isFreeUser) {
				let seekTime = await TrackPlayer.getPosition();
				if (seekTime) {
					bookmarkObject.postSeekTimeAct(accessToken, episodeId, seekTime);
				}
			}
			playerCommonActionObj.changeState(false);
			TrackPlayer.pause();
			break;
		case 'remote-next':
			TrackPlayer.play();
			TrackPlayer.skipToNext();
			break;
		case 'remote-previous':
			TrackPlayer.play();
			TrackPlayer.skipToPrevious();
			break;

		case 'playback-queue-ended':
			if(data.position!=0){
				playerCommonActionObj.emptyPlayerListAct();
			}
			playerCommonActionObj.updateResetEnable(false);
			break;
		default:
			break;
	}
});
export default class HomeComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshing: false,
		};
	}
	componentDidMount() {
		const {
			user,
		} = this.props;
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().setCurrentScreen(CONST.HOME_TAB_SCREEN);
		firebase.analytics().logEvent(CONST.SCREEN_VIEW, { Screen_Name: CONST.HOME_TAB_SCREEN, udid });
		Keyboard.dismiss;
		setRootNavigation(this.props.screenProps.rootNavigation);
		playerCommonActionObj = this.props.playerCommonAction;
		commonActionObj = this.props.commonAction;
		bookmarkObject = this.props.bookmarkAction;
		isFreeUser = (!user || (user && !user.is_paid_user)) ? true : false;
		accessToken = user && user.access_token;
		this.props.signinAction.referenceIdAct(udid);
		// To empty the array of processing episode.
		let { downloadIdArray, downloadedEpisode } = this.props;
		downloadIdArray = downloadIdArray.filter(function (obj) {
			if (obj.status != 'fetching')
				return obj;
		});
		this.props.downloadAction.updateDownloadList(downloadedEpisode, downloadIdArray)

		// To empty the download list for new user.	
		const { userId } = this.props;
		if (!isFreeUser) {
			let { id } = user;
			if (userId != id) {
				this.props.downloadAction.clearDownloadList(id);
			}
		}
	}

	componentWillMount() {
		if (Platform.OS == 'android') {
			BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
		}
	}

	componentWillUnmount() {
		if (Platform.OS == 'android') {
			BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
			TrackPlayer.stop();
			TrackPlayer.reset();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			const { playerStatus, playerMessage } = this.props;
			if (!playerStatus && playerMessage != '' && this.props.playerMessage !== prevProps.playerMessage) {
				showToast(playerMessage);
			}
		}
	}
	_showAlert() {
		Alert.alert(
			'',
			'Press back again to exit the app.',
			[
				{
					text: 'CANCEL', onPress: () => { }
				},
				{
					text: 'OK', onPress: () => {
						TrackPlayer.stop();
						TrackPlayer.reset();
						BackHandler.exitApp();
					}
				},
			]
		);
	}
	handleBackButton = () => {
		this._showAlert();
		return true;
	};
	onItemPressed(item, categoryTitle) {
		const {
			playerObject,
		} = this.props;
		if (this.props.internetStatus) {
			if (playerObject && item.id == playerObject.id) {
				showToast('Already Playing...');
				return;
			}
			const {
				user,
			} = this.props;
			let includeBookmark = false;
			if (categoryTitle === CONST.CONTINUE_LISTENING_TITLE) {
				includeBookmark = true;
			}
			const udid = DeviceInfo.getUniqueID();
			if (item.object_type && item.object_type !== 'Episode') {
				this.props.navigation
					.navigate('SeriesGenreScreen', {
						item: item,
					});
			} else {
				if (!user || (user && !user.is_paid_user)) {
					this.props.commonAction.showPremiumModal();
				} else {
					this.props.commonAction.playerType(CONST.PREMIUM_PLAYER);
					this.props.playerCommonAction.getPremiumPlayerDataAct(item, udid, user.access_token, {}, includeBookmark);
				}
			}
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}
	_renderItem(item, categoryTitle) {
		//TODO improve this : artwork_url images rendering with some delay on screen
		let date = Validators.dateFormatter(item.original_air_date);
		return (
			item.data ?
			this._renderRadioWasItem(item, 1, false) :
			<TouchableOpacity onPress={() => { this.onItemPressed(item, categoryTitle); }}>
				{
							item.artwork_url ?
								(<CachedImage
									style={styles.episodeImage}
									source={{
										uri: item.artwork_url,
									}}
								/>)
								:
								(item.object_type && item.object_type == 'Genre') ?
									<Image style={styles.episodeImage} source={CONST.GENRE_PLACEHOLDER} />
									:
									(item.object_type && item.object_type == 'Series') ?
										<Image style={styles.episodeImage} source={CONST.SERIES_PLACEHOLDER} />
										:

										<Image style={styles.episodeImage} source={CONST.EPISODE_PLACEHOLDER} />

						}

						<View style={styles.titleContainer}>
							{
								(!item.object_type || (item.object_type && item.object_type == 'Episode')) ?
									<View>
										<Text numberOfLines={2} style={styles.episodeTitle}>{item.series_title}</Text>
										<Text numberOfLines={2} style={[styles.episodeTitle, { color: CONST.GREY_COLOR }]}>{item.title}</Text>
										<Text numberOfLines={1} style={[styles.episodeTitle, commonStyles.fontFamilyMedium]}>{date}</Text>
									</View>
									:
									(item.object_type && item.object_type == 'Series') ?
										<View>
											<Text numberOfLines={2} style={styles.episodeTitle}>Browse Series:</Text>
											<Text numberOfLines={2} style={styles.episodeTitle}>{item.title}</Text>
										</View>
										:
										<View>
											<Text numberOfLines={2} style={styles.episodeTitle}>Browse Genre:</Text>
											<Text numberOfLines={2} style={styles.episodeTitle}>{item.title}</Text>
										</View>
							}

						</View>
			</TouchableOpacity>
		);
	}
	_renderEpisodeCategory(categoryTitle, recordsDetails) {
		return (
			<View>
				<Text style={styles.categoryHeading}>
					{categoryTitle}
				</Text>
				<FlatList
					data={recordsDetails}
					horizontal
					contentContainerStyle={styles.horizontalScroll}
					showsHorizontalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={styles.horizontalImdSpacing} />}
					extraData={this.state}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => this._renderItem(item, categoryTitle)}
				/>
			</View>
		);
	}
	_renderRadioWasItem(item, itemIndex, fromWRW) {
		const totalCount = item.data.length;
		return (
			<View>
				{
					fromWRW ? 
					<View style={styles.radioWasTitleDate}>
						<Text style={styles.radioWasTitleText}>{item.title}</Text>
					</View>
				:
					<View style={[styles.radioWasTitleDate, styles.radioWasTitleDateCont]}>
						<Text style={styles.radioWasTitleText}>{'When Radio Was for \n'+item.title}</Text>
					</View>
				}
				
				<View style={styles.radioWasItemContainer}>
					{
						item.data.map((data, index) => {
							let date = Validators.dateFormatter(data.original_air_date);
							return (
								<View key={data.id}>
									<TouchableOpacity onPress={() => { this.onPressWrwEpisode(data, item, itemIndex); }}>
										<View style={[styles.titleContainer, styles.radioWasTitleContainer]}>
											<Text numberOfLines={2} style={styles.radioWasText}>{data.series_title}</Text>
											<Text numberOfLines={2} style={[styles.radioWasText, { color: CONST.GREY_COLOR }]}>{data.title}</Text>
											<Text numberOfLines={1} style={[styles.radioWasText, { fontFamily: CONST.fontFamily.Regular }]}>{date}</Text>
										</View>
									</TouchableOpacity>
									{
										totalCount > index + 1 &&
										<View style={styles.hBorder} />
									}
								</View>
							);
						})
					}


				</View>

			</View>
		);
	}
	_renderWhenRadioWas(categoryTitle, recordsDetails) {
		return (
			<View>
				<Text style={[styles.categoryHeading, styles.firstComponentHeading]}>
					{categoryTitle}
				</Text>
				<FlatList
					data={recordsDetails}
					horizontal
					contentContainerStyle={styles.horizontalScroll}
					showsHorizontalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={styles.horizontalImdSpacing} />}
					extraData={this.state}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item, index }) => this._renderRadioWasItem(item, index, true)}
				/>
			</View>
		);
	}

	onPressWrwEpisode(audioDetails, allData, index) {
		const {
			playerObject,
		} = this.props;
		let alreadyPlaying = allData.data.find((item) => {
			return item.id == (playerObject && playerObject.id)
		})
		if (alreadyPlaying) {
			showToast('Already Playing...');
			return;
		}
		const {
			user,
		} = this.props;
		const udid = DeviceInfo.getUniqueID();
		this.props.commonAction.playerType(CONST.FREE_PLAYER);
		if (this.props.internetStatus) {
			if (!user || (user && !user.is_paid_user)) {
				if (index >= 3) {
					this.props.commonAction.showPremiumModal();
				}
				else {
					this.props.playerCommonAction.getPlayerDataAct(audioDetails, udid, allData);
				}
			} else {
				this.props.playerCommonAction.getPremiumPlayerDataAct(audioDetails, udid, user.access_token, allData);
			}
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}

	_onRefresh() {
		const {
			user,
		} = this.props;
		let udid = DeviceInfo.getUniqueID();
		let accessToken = (user && user.access_token) ? user.access_token : '';
		if (this.props.internetStatus) {
			this.props.screenDataAction.getHomepageScreenDataAct(udid, accessToken);
			this.setState({
				refreshing: false,
			});
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}

	render() {
		let audioRecords = this.props.page_details;
		let user = this.props.user;
		return (
			<SafeAreaView style={commonStyles.safeAreaView}>
				<View style={[styles.headerContainer, styles.topMargin]}>
					<Image source={CONST.HOME_LOGO} />
				</View>
				<View style={styles.hLine}></View>
				{audioRecords ?
					<ScrollView
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={() => this._onRefresh()}
							/>
						}
						showsVerticalScrollIndicator={false}>
						<View style={styles.container}>
							{
								(!user || (user && !user.is_paid_user)) ?
									<View>
										{(audioRecords && audioRecords.when_radio_was) &&
											this._renderWhenRadioWas(CONST.WHEN_RADIO_WAS_TITLE, audioRecords.when_radio_was)
										}
										{(audioRecords && audioRecords.recently_added) &&
											this._renderEpisodeCategory(CONST.RECENTLY_ADDED_TITLE, audioRecords.recently_added)
										}
									</View> :
									<View>
										{(audioRecords && audioRecords.continue_listening) &&
											this._renderEpisodeCategory(CONST.CONTINUE_LISTENING_TITLE, audioRecords.continue_listening)
										}
										{(audioRecords && audioRecords.recently_added) &&
											this._renderEpisodeCategory(CONST.RECENTLY_ADDED_TITLE, audioRecords.recently_added)
										}
										{(audioRecords && audioRecords.when_radio_was) &&
											this._renderWhenRadioWas(CONST.WHEN_RADIO_WAS_TITLE, audioRecords.when_radio_was)
										}
										{(audioRecords && audioRecords.more_of) &&
											this._renderEpisodeCategory(CONST.MORE_OF_TITLE, audioRecords.more_of)
										}
									</View>
							}
							{(audioRecords && audioRecords.featured) &&
								this._renderEpisodeCategory(CONST.FEATURED_TITLE, audioRecords.featured)
							}
							{(audioRecords && audioRecords.popular) &&
								this._renderEpisodeCategory(CONST.POPULAR_TITLE, audioRecords.popular)
							}
						</View>
					</ScrollView>
					:
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<Text style={commonStyles.noItemStyle} >
							{'No Data Available'}
						</Text>
					</View>
				}
				<CommonModal {...this.props} />
				<MiniPlayer {...this.props} />
			</SafeAreaView>
		);
	}
}


HomeComponent.propTypes = {
	navigation: PropTypes.object,
	playerCommonAction: PropTypes.object,
	token: PropTypes.string,
	commonAction: PropTypes.object,
};