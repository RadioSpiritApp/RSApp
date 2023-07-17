import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView, Image, Slider, Platform, NativeModules, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import styles from './style';
import Validators from '../../utils/Validator';
import scale, { verticalScale } from '../../utils/scale';
import * as CONST from '../../utils/Const';
import { CachedImage } from 'react-native-cached-image';
import AirPlayViewNative from './AirPlayView';
import TrackPlayer from 'react-native-track-player';
import DeviceInfo from 'react-native-device-info';
import showToast from '../../utils/Toast';
import SystemSetting from 'react-native-system-setting';
import firebase from 'react-native-firebase';

let playerInterval;

export default class PlayerComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isTrue: true,
			isOptionsModalVisible: false,
			volume: 0,
			seekBarPosition: 0,
			duration: 0,
			currentTime: 0,
			remainingTime: 0,
		};
	}
	async componentDidMount() {
		this.setState({ volume: await SystemSetting.getVolume('music') });
		firebase.analytics().setCurrentScreen(CONST.PAID_PLAYER_SCREEN);
		await this._getPosition();
		playerInterval = setInterval(() => {
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
		clearInterval(playerInterval);
	}

	_getPosition = async () => {
		let currentTime = await TrackPlayer.getPosition();
		this.setState({
			currentTime: currentTime,
		});
	};

	downloadEpisode(id) {
		const {
			user,
			downloadLimit,
			downloadedIdArray,
		} = this.props;
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
				this.props.downloadAction.downloadEpisodeAct(user.access_token, udid, id);
			}
		}
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

	showOptionsModal() {
		const {
			playerObject,
		} = this.props;

		const {
			genres,
			series_title,
			series_id,
			artwork,
			description,
			id,
			series_description
		} = playerObject;
		
		const seriesObj = {
			series_title,
			series_id,
			artwork,
			series_description,
		};

		const genreArray = genres ? genres : [];
		return (
			<Modal
				isVisible={this.state.isOptionsModalVisible}
				style={styles.optionModalStyle}
			>
				<View style={styles.optionsContainer}>
					{genreArray && genreArray.map((object) => {
						return (
							<TouchableOpacity style={styles.optionsCell}
								onPress={() => this.onPressItem(2, object)}
							>
								<Text style={styles.optionsText}>More {`${object.title}`}</Text>
							</TouchableOpacity>
						);
					})}
					<TouchableOpacity style={styles.optionsCell}
						onPress={() => this.onPressItem(1, seriesObj)}
					>
						<Text style={styles.optionsText}>More {`${series_title}`}</Text>
					</TouchableOpacity>
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

	renderArtWork() {
		const {
			title,
			artwork,
		} = this.props.playerObject;
		const episodeInitials = Validators.getTwoInitials(title);

		return (
			<View style={styles.playerArtworkContainer}>
				{artwork ?
					<CachedImage style={styles.playerTabImage}
						source={{ uri: artwork }}
					/> :
					<Text style={styles.episodeInitials}>
						{episodeInitials}
					</Text>}
			</View>
		);
	}

	renderPlayerControl() {
		return (
			<View style={styles.playerControlContainer}>
				{this.renderEpisodeDetail()}
				{this.renderSeekBar()}
				{this.renderPlayerEvents()}
				{this.renderVolumeControl()}
			</View>
		);
	}

	togglePlayerState() {
		this.props.playerCommonAction.changeState(!this.props.isPlay);
		this.props.onTogglePlayback();
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
				<View style={styles.playerSeekBarContainer}>
					<Slider
						value={this.state.currentTime}
						maximumValue={this.props.playerObject.duration}
						onSlidingComplete={(value) => this._updateSeekBar(value)}
						thumbImage={CONST.CIRCLE_ICON}
						minimumTrackTintColor={CONST.BLACK_COLOR}
						thumbTintColor={CONST.BLACK_COLOR} />
				</View>
				<View style={styles.timeDuration}>
					<Text style={[styles.playTime, { textAlign: 'left' }]}>{currentTime}</Text>
					<Text style={[styles.playTime, { textAlign: 'right' }]}>-{remainingTime}</Text>
				</View>
			</View>
		);
	}

	renderEpisodeDetail() {
		const {
			title,
			series_title,
			original_air_date,
		} = this.props.playerObject;

		return (
			<View>
				<Text style={styles.genreName}>{series_title}</Text>
				<Text style={styles.episodeName}>{title}</Text>
				<Text style={styles.displayDate}>{Validators.dateFormatter(original_air_date)}</Text>
			</View>
		);
	}

	renderPlayerEvents() {
		const {
			playerObject,
		} = this.props;
		const playPauseIcon = this.props.isPlay ? CONST.PAUSE_ICON : CONST.PLAY_ICON;
		const showNext = playerObject.isNext ? true : false;
		const showPrev = playerObject.isPrev ? true : false;
		return (
			<View style={{ height: 60, alignItems: 'center', paddingTop: scale(10) }}>
				<View style={{ flex: 9, flexDirection: 'row', width: scale(180), height: verticalScale(40) }}>
					<View style={{ flex: 3 }}	>
						<TouchableOpacity
							disabled={!showPrev}
							onPress={() => this.props.onPrevious()}
							style={{ flex: 1, justifyContent: 'center' }}>
							<Image
								style={{ opacity: !showPrev ? 0.5 : 1 }}
								source={CONST.PREV_ICON} />
						</TouchableOpacity>
					</View>
					<View style={{ flex: 3 }}	>
						{this.props.bufferState ?
							<View style={styles.bufferStateIndicator} >
								<ActivityIndicator size='small' color={CONST.GREY_COLOR} />
							</View>
							:
							<TouchableOpacity
								onPress={() => this.togglePlayerState()}
								style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								<Image source={playPauseIcon} />
							</TouchableOpacity>
						}
					</View>
					<View style={{ flex: 3 }}	>
						<TouchableOpacity
							disabled={!showNext}
							onPress={() => this.props.onNext()}
							style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
							<Image
								style={{ opacity: !showNext ? 0.5 : 1 }}
								source={CONST.NEXT_ICON} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}

	renderVolumeControl() {
		return (
			<View style={{ flex: 10, flexDirection: 'row', height: scale(50), marginTop: scale(10), alignItems: 'center', marginHorizontal: scale(18) }}>
				<View style={{ flex: 0.5, alignItems: 'center' }}>
					<Image style='contain' source={CONST.SOUND_ICON} />
				</View>
				<Slider
					ref={(sliderVol) => this.sliderVol = sliderVol}
					value={this.props.volume}
					onSlidingComplete={(val) => this._changeVol(val)}
					thumbImage={CONST.CIRCLE_ICON} style={{ flex: 8 }}
					minimumTrackTintColor={CONST.BLACK_COLOR}
					thumbTintColor={CONST.BLACK_COLOR}
				/>
				<View style={{ flex: 0.5, alignItems: 'center' }}>
					<Image style='contain' source={CONST.SOUND_ICON2} />
				</View>
			</View>
		);
	}

	renderPlayerFooter() {
		return (
			<View style={styles.playerFooterContainer}>
				<View style={{ height: scale(40), width: scale(40) }}></View>
				<View>
					{
						Platform.OS == 'ios' ? < AirPlayViewNative style={
							styles.airPlayView
						}
						/> :
							<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: scale(40), width: (40) }}
								onPress={() => NativeModules.CastModule.castScreen()}
							>
								<Image source={CONST.AIR_PLAY} />
							</TouchableOpacity>
					}
				</View>
				<View>
					<TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: scale(40), width: (40) }}
						onPress={() => this._toggleOptionsModal()}
					>
						<Image source={CONST.MORE_ICON} />
					</TouchableOpacity>
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
			<View >
				{this.renderArtWork()}
				{this.renderPlayerControl()}
				{this.renderPlayerFooter()}
			</View>
		);
	}

	render() {
		if (!this.props.playerObject) {
			return this.props.navigation.goBack();
		}
		return (
			<View style={styles.container}>
				{this.renderHeader()}
				<ScrollView >
					{this.renderPlayerBody()}
				</ScrollView>
				{this.state.isOptionsModalVisible && this.showOptionsModal()}
			</View>
		);
	}
}

PlayerComponent.propTypes = {
	navigation: PropTypes.object,
	commonAction: PropTypes.object,
	advertisementAction: PropTypes.object,
	isPlay: PropTypes.bool,
	onNext: PropTypes.func,
	onPrevious: PropTypes.func,
	bufferState: PropTypes.bool,
};
