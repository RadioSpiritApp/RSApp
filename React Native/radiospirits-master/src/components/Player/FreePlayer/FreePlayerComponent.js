import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	ScrollView,
	Image,
	Slider,
	FlatList,
	Linking,
	Platform,
	NativeModules,
	SafeAreaView,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import Validators from '../../../utils/Validator';
import scale from '../../../utils/scale';
import * as CONST from '../../../utils/Const';
import showToast from '../../../utils/Toast';
import Modal from 'react-native-modal';
import { CachedImage } from 'react-native-cached-image';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import AirPlayViewNative from '../AirPlayView';
import DeviceInfo from 'react-native-device-info';
import SystemSetting from 'react-native-system-setting';
import firebase from 'react-native-firebase';

let freePlayerInterval;

class ProgressBar extends ProgressComponent {
	render() {
		return (
			<View style={styles.progress}>
				<View style={{ flex: this.getProgress(), backgroundColor: '#000000' }} />
				<View style={{ flex: 1 - this.getProgress(), backgroundColor: 'grey', opacity: 0.5 }} />
			</View>
		);
	}
}
export default class FreePlayerComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isTrue: true,
			volume: 0,
			seekBarPosition: 0,
			duration: 0,
			currentTime: 0,
			remainingTime: 0,
			isOptionsModalVisible: false,
		};
		volumeListener = null;
	}
	async componentDidMount() {
		this.setState({ volume: await SystemSetting.getVolume('music') });
		firebase.analytics().setCurrentScreen(CONST.FREE_PLAYER_SCREEN);
		await this._getPosition();
		freePlayerInterval = setInterval(() => {
			this._getPosition();
			if (this.props.playerObject)
				this.setState({ remainingTime: (this.props.playerObject.duration - this.state.currentTime) });
		}, 500);

		this._changeSliderNativeVol(this.sliderVol, this.state.volume);
		this.volumeListener = SystemSetting.addVolumeListener((data) => {
			const volume = this.isAndroid ? data[this.state.volType] : data.value
			this._changeSliderNativeVol(this.sliderVol, volume)
			this.setState({
				volume: volume
			})
		})
	}

	_changeSliderNativeVol(slider, value) {
		slider.setNativeProps({
			value: value
		})
	}

	_changeVol(value) {
		SystemSetting.setVolume(value, {
			type: 'music',
			playSound: false,
			showUI: false
		})
		this.setState({
			volume: value
		})
	}

	componentWillUnmount() {
		SystemSetting.removeListener(this.volumeListener)
		clearInterval(freePlayerInterval);
	}

	showPopUp() {
		this.props.commonAction.showPremiumModal();
		this._toggleOptionsModal();
	}

	togglePlayerState() {
		this.props.playerCommonAction.changeState(!this.props.isPlay);
		this.props.onTogglePlayback();
	}

	onPressItem(selectedIndex, item) {
		const {
			navigation
		} = this.props;
		item.selectedIndex = selectedIndex;
		this.setState({
			isOptionsModalVisible: false,
		}, () => {
			setTimeout(() => {
				navigation.goBack();
				this.props.commonAction.reRenderBrowseScreen(item);
			}, 100)
		})
		navigation.state.params.tabNavigation.navigate('BrowseScreen');
	}

	downloadEpisode(id) {
		const {
			user, downloadLimit, downloadedIdArray, freeEpisodeList
		} = this.props;

		let idArray = freeEpisodeList.data.map((o) => {
			return o.id.toString()
		});
		let idString = idArray.join()

		const udid = DeviceInfo.getUniqueID();
		this._toggleOptionsModal();
		if (!user || (user && !user.is_paid_user)) {
			this.props.commonAction.showPremiumModal();
		} else if ((downloadedIdArray.length) === downloadLimit) {
			showToast('Maximum downloading limit reached');
		} else {
			episodeStatus = downloadedIdArray.find((element) => {
				return element.id.indexOf(id) != -1;
			});
			if (episodeStatus) {
				if (episodeStatus.status === 'downloaded') {
					showToast('Already downloaded audio');
				}
				else {
					showToast('Downloading in progress');
				}
			}
			else {
				showToast('Downloading...');
				this.props.downloadAction.downloadEpisodeAct(user.access_token, udid, idString, freeEpisodeList.data);
			}
		}
	}

	showOptionsModal() {
		const {
			playerObject,
		} = this.props;

		const {
			id,
			genres,
			series,
		} = playerObject;

		const genreArray = genres ? genres : [];
		const seriesArray = series ? series : [];
		return (
			<Modal
				isVisible={this.state.isOptionsModalVisible}
				style={styles.optionModalStyle}
			>
				<View style={styles.optionsContainer}>
					<TouchableOpacity style={styles.optionsCell}
						onPress={() => this.onPressItem(3, {})}
					>
						<Text style={styles.optionsText}>{'More When Radio Was'}</Text>
					</TouchableOpacity>
					{genreArray && genreArray.map((object) => {
						return (
							<TouchableOpacity style={styles.optionsCell}
								onPress={() => this.onPressItem(2, object)}
							>
								<Text style={styles.optionsText}>More {`${object.title}`}</Text>
							</TouchableOpacity>
						);
					})}
					{seriesArray && seriesArray.map((object) => {
						return (
							<TouchableOpacity style={styles.optionsCell}
								onPress={() => this.onPressItem(1, object)}
							>
								<Text style={styles.optionsText}>More {`${object.title}`}</Text>
							</TouchableOpacity>
						);
					})}
					<TouchableOpacity style={[styles.optionsCell, { flexDirection: 'row', borderBottomWidth: 0 }]}
						onPress={() => this.downloadEpisode(id)}
					>
						<Image style={styles.downloadImage} source={CONST.DOWNLOAD_SHOW_ICON} />
						<Text style={[styles.optionsText, { marginLeft: scale(15) }]}>{'Download this Show'}</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={() => this._toggleOptionsModal()}
					style={styles.cancelButton}
				>
					<Text style={styles.cancelButtonText}>CANCEL</Text>
				</TouchableOpacity>
			</Modal>
		);
	}

	_toggleOptionsModal() {
		this.setState({ isOptionsModalVisible: !this.state.isOptionsModalVisible });
	}

	_renderItem(item) {
		return (
			<View
				style={[styles.radioItemList]}>
				<Text
					numberOfLines={1}
					style={styles.episodeTitleText}> {item.series_title} </Text>
				<Text
					numberOfLines={1}
					style={styles.episodeSubTitleText}> {item.title} </Text>
				<Text style={styles.episodeSubTitleText}> {Validators.dateFormatter(item.original_air_date)} </Text>
			</View>
		);
	}

	renderEpisodeList() {
		const {
			freeEpisodeList,
			adObject,
		} = this.props;
		const freePlayerData = freeEpisodeList ? freeEpisodeList : {};
		return (
			<View>
				<View style={styles.topHeadingContainer} >
					<Text style={styles.topHeading} >
						When Radio Was
					</Text>
					<Text style={styles.topSubHeading} >
						{'For '}{freePlayerData.title}
					</Text>
				</View>
				<ScrollView contentContainerStyle={adObject ? styles.episodeContainerWithAdd : styles.minHeightOfContainer} >
					<FlatList
						data={freePlayerData.data}
						extraData={this.state}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => this._renderItem(item)}
					/>
				</ScrollView>
			</View>
		);
	}

	renderPlayerControl() {
		const {
			playerObject,
		} = this.props;
		return (
			<View style={{ marginTop: scale(40) }}>
				{this.renderAdBanner()}
				{playerObject.ad_type ? this.renderAdSeekBar() : this.renderSeekBar()}
				{this.renderPlayerEvents()}
				{this.renderVolumeControl()}
			</View>
		);
	}

	_updateSeekBarPosition(seekBarPosition) {
		this.setState({ seekBarPosition });
		TrackPlayer.seekTo(seekBarPosition);
	}

	_getPosition = async () => {
		let currentTime = await TrackPlayer.getPosition();
		this.setState({
			currentTime: currentTime
		});
	};

	openAdLink() {
		const {
			playerObject,
		} = this.props;
		Linking.openURL(playerObject.redirect_url);
	}

	renderAdBanner() {
		const {
			playerObject,
		} = this.props;
		return (
			<View style={{ height: scale(17)}} >
				{(playerObject.ad_type) &&
					<View style={{ flexDirection: 'row' }}>
						<View style={styles.audioAdLabelContainer}>
							<Text style={styles.audioAdLabel}> Ad </Text>
						</View>
						<TouchableOpacity
							activeOpacity={1}
							style={styles.audioAdLinkContainer}
							onPress={() => { playerObject.redirect_url && this.openAdLink() }}
						>
							<Text style={styles.audioAdLink}> {playerObject.title} </Text>
						</TouchableOpacity>
					</View>
				}
			</View>
		)
	}

	_updateSeekBar(currentTime) {
		this.setState({ currentTime });
		TrackPlayer.seekTo(currentTime);
	}

	renderSeekBar() {
		let currentTime = Validators.timeFormatter(this.state.currentTime);
		let remainingTime = Validators.timeFormatter(this.state.remainingTime);
		return (
			<View>
				<View style={[styles.playerSeekBarContainer]}>
					<Slider
						value={this.state.currentTime}
						maximumValue={this.props.playerObject.duration}
						onSlidingComplete={(value) => this._updateSeekBar(value)}
						thumbImage={CONST.CIRCLE_ICON}
						minimumTrackTintColor={CONST.BLACK_COLOR}
						thumbTintColor={CONST.BLACK_COLOR}
					/>
				</View>
				<View style={styles.timeDuration}>
					<Text style={[styles.playTime, { textAlign: 'left' }]}>{currentTime}</Text>
					<Text style={[styles.playTime, { textAlign: 'right' }]}>-{remainingTime}</Text>
				</View>
			</View>
		);
	}

	renderAdSeekBar() {
		let currentTime = Validators.timeFormatter(this.state.currentTime);
		let remainingTime = Validators.timeFormatter(this.state.remainingTime);
		return (
			<View>
				<View style={styles.playerAdSeekBarContainer}>
					<ProgressBar />
				</View>
				<View style={styles.adTimeDuration}>
					<Text style={[styles.playTime, { textAlign: 'left' }]}>{currentTime}</Text>
					<Text style={[styles.playTime, { textAlign: 'right' }]}>-{remainingTime}</Text>
				</View>
			</View>
		);
	}

	renderPlayerEvents() {
		const {
			playerObject,
		} = this.props;
		const playPauseIcon = this.props.isPlay ? CONST.PAUSE_ICON : CONST.PLAY_ICON;
		const disableMoreOption = (playerObject && playerObject.ad_type) ? true : false;
		return (
			<View style={{ marginTop: scale(30), marginHorizontal: scale(15) }}>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					{
						Platform.OS == 'ios' ? < AirPlayViewNative style={
							styles.airPlayView
						}
						/> :
							<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: scale(2), height: scale(40), width: (40) }}
								onPress={() => NativeModules.CastModule.castScreen()}
							>
								<Image source={CONST.AIR_PLAY} />
							</TouchableOpacity>
					}
					{this.props.bufferState ?
						<View style={{ justifyContent: 'center' }} >
							<ActivityIndicator size='small' color={CONST.GREY_COLOR} />
						</View>
						:
						<TouchableOpacity
							onPress={() => this.togglePlayerState()}
							style={{ justifyContent: 'center' }}
						>
							<Image
								style={{ resizeMode: 'contain', marginHorizontal: scale(10), height: 45, width: 45 }}
								source={playPauseIcon} />
						</TouchableOpacity>
					}
					<TouchableOpacity style={{ justifyContent: 'center', paddingLeft: 10, opacity: disableMoreOption ? 0.3 : 1 }}
						disabled={disableMoreOption}
						onPress={() => this._toggleOptionsModal()}
					><View>
							<Image style={{ resizeMode: 'contain' }} source={CONST.MORE_ICON} />
						</View>
					</TouchableOpacity>

				</View>
			</View>
		);
	}

	renderVolumeControl() {
		return (
			<View style={{ flexDirection: 'row', marginTop: scale(25), marginHorizontal: scale(15), alignItems: 'center', justifyContent: 'space-between' }}>
				<View style={{ alignItems: 'center' }}>
					<Image style='contain' source={CONST.SOUND_ICON} />
				</View>
				<Slider
					ref={(sliderVol) => this.sliderVol = sliderVol}
					value={this.props.volume}
					onSlidingComplete={(val) => this._changeVol(val)}
					thumbImage={CONST.CIRCLE_ICON} style={{ flex: 1, marginHorizontal: scale(3) }}
					minimumTrackTintColor={CONST.BLACK_COLOR}
					thumbTintColor={CONST.BLACK_COLOR}
				/>
				<View style={{ alignItems: 'center' }}>
					<Image style='contain' source={CONST.SOUND_ICON2} />
				</View>
			</View>
		);
	}

	renderHeader() {
		return (
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={() => this.props.navigation.goBack()}
					style={{ paddingHorizontal: scale(50) }}
				>
					<Image source={CONST.MINIMIZE_ICON} />
				</TouchableOpacity>
			</View>
		);
	}

	renderPlayerBody() {
		return (
			<View>
				{this.renderEpisodeList()}
				{this.renderPlayerControl()}
			</View>
		);
	}

	renderAdvertisement() {
		const {
			adObject,
		} = this.props;
		let imageObject = adObject ? adObject : {};
		return (
			<View style={styles.adContainer} >
				<TouchableOpacity
					onPress={() => { Linking.openURL(imageObject.redirect_url); }}
				>
					<CachedImage
						source={{ uri: imageObject.image_url }}
						style={{ height: scale(85), width: scale(339), alignSelf: 'center' }}
					/>
				</TouchableOpacity>
			</View>
		);
	}

	render() {
		const {
			adObject,
			playerObject
		} = this.props;
		if (!playerObject) {
			return this.props.navigation.goBack();
		}
		return (
			<SafeAreaView style={styles.container}>
				{this.renderHeader()}
				{this.renderPlayerBody()}
				{adObject && this.renderAdvertisement()}
				{this.state.isOptionsModalVisible && this.showOptionsModal()}
			</SafeAreaView>
		);
	}
}

FreePlayerComponent.propTypes = {
	navigation: PropTypes.object,
	commonAction: PropTypes.object,
	advertisementAction: PropTypes.object,
	playerCommonAction: PropTypes.object,
	bufferState: PropTypes.bool,
};
