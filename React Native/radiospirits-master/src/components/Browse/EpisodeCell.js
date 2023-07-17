import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	Image,
	FlatList,
	ScrollView,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import ViewMoreText from 'react-native-view-more-text';
import scale from '../../utils/scale';
import showToast from '../../utils/Toast';
import styles from './style';
import commonstyles from '../commonstyles';
import * as CONST from '../../utils/Const';
import Validators from '../../utils/Validator';
import { CachedImage } from 'react-native-cached-image';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

export default class EpisodeCell extends Component {
	constructor(props) {
		super(props);
		this.onEndReachedCalledDuringMomentum = true;
		this.state = {
			readMoreModal: false,
			showActivityIndicator: false,
		};
	}
	componentDidMount() {
		let accessToken = '';
		const {
			seriesId,
			user,
		} = this.props;
		if (user && user.access_token) {
			accessToken = user.access_token;
		}
		if (seriesId) {
			this.props.screenDataAction.resetEpisodeData();
			this.props.commonAction.startSpinner();
			this.props.screenDataAction.getEpisodeScreenDataAct(this.props.seriesId, accessToken, 1);
		}
	}

	componentDidUpdate(prevProps) {
		console.log("# componentDidUpdate");
		if(prevProps.status !== this.props.status) {
			let accessToken = '';
			const {
				seriesId,
				user,
				episodeTotalPages,
				episodeCurrentPage,
			} = this.props;
			this.setState({
				showActivityIndicator: false,
			});
			console.log("# seriesId"+seriesId);
			if (user && user.access_token) {
				accessToken = user.access_token;
			}
			if (seriesId && (episodeCurrentPage < episodeTotalPages)) {
				console.log("# episodeCurrentPage"+episodeCurrentPage+"   episodeTotalPages"+episodeTotalPages);
				this.props.screenDataAction.getEpisodeScreenDataAct(this.props.seriesId, accessToken, episodeCurrentPage+1);
			}
		}
	}

	renderHeaderView() {
		const {
			seriesHeading,
			onPressBack,
			seriesImage,
			seriesDescription,
			route,
			containerStyle,
		} = this.props;
		return (
			<View style={[styles.episodeTitleContainer, containerStyle && containerStyle]} >
				<TouchableOpacity
					onPress={() =>{ 
						this.props.screenDataAction.resetEpisodeData();
						onPressBack(route);
					}}
					style={{ paddingLeft: scale(10), paddingTop: scale(10) }}
				>
					<Image
						source={CONST.BACK_ICON}
					/>
				</TouchableOpacity>
				<View style={{ flexDirection: 'row' }}>
					<View style={styles.seriesImageCache}>
						{seriesImage ? <CachedImage
							source={{ uri: seriesImage }}
							style={[styles.seriesImage,]}
						/> : <Image
							source={CONST.SERIES_PLACEHOLDER}
							style={styles.seriesImage} />}
					</View>
					<View>
						<Text
							numberOfLines={4}
							style={[styles.episodeTitleText]} >
							{seriesHeading && seriesHeading.toUpperCase()}
						</Text>
						<ViewMoreText
							numberOfLines={4}
							renderViewMore={() => this.renderViewMore()}
							renderViewLess={() => this.renderViewLess()}
							textStyle={styles.episodeDescriptionText}
						>
							<Text>
								{seriesDescription}
							</Text>
						</ViewMoreText>
					</View>
				</View>
			</View>
		);
	}

	renderDescriptionModal() {
		const {
			seriesHeading,
			seriesDescription,
		} = this.props;
		const {
			readMoreModal
		} = this.state;
		return (
			<Modal
				animationIn={'zoomIn'}
				animationOut={'zoomOut'}
				isVisible={readMoreModal}
			>
				<View style={styles.modalContainer}>
					<Image
						source={CONST.TOP_IMAGE}
					/>
					<View style={commonstyles.center} >
						<Text
							numberOfLines={4}
							style={[styles.modalHeadingTitle]} >
							{seriesHeading && seriesHeading}
						</Text>
					</View>
					<ScrollView
						showsVerticalScrollIndicator={false}
					>
						<View>
							<Text style={styles.modalDescriptionText}>
								{seriesDescription}
							</Text>
						</View>
						<View style={{ height: scale(50) }} />
					</ScrollView>
					<TouchableOpacity
						style={styles.modalCrossImageStyle}
						onPress={() => this.openCloseReadMoreModal(false)}>
						<Image
							source={CONST.CROSS_IMAGE}
						/>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}

	openCloseReadMoreModal(value) {
		this.setState({
			readMoreModal: value,
		});
	}

	renderViewMore() {
		return (
			<Text
				onPress={() => this.openCloseReadMoreModal(true)}
				style={styles.viewMoreText} >
				Read More
			</Text>
		);
	}

	onEpisodeClick(item) {
		const {
			playerObject,
			internetStatus,
			user,
		} = this.props;
		if (internetStatus) {
			if (playerObject && item.id == playerObject.id) {
				showToast('Already Playing...');
				return;
			}
			const udid = DeviceInfo.getUniqueID();
			if (!user || (user && !user.is_paid_user)) {
				this.props.commonAction.showPremiumModal();
			} else {
				this.props.commonAction.playerType(CONST.PREMIUM_PLAYER);
				this.props.playerCommonAction.getPremiumPlayerDataAct(item, udid, user.access_token);
			}
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}

	playAllEpisode() {
		const {
			user,
			seriesId,
			seriesHeading,
			internetStatus,
		} = this.props;
		if (internetStatus) {
			const udid = DeviceInfo.getUniqueID();
			firebase.analytics().logEvent('ALL_EPISODE_PLAYED', { SERIES_ID : seriesId  , Title : seriesHeading , udid });
			if (!user || (user && !user.is_paid_user)) {
				this.props.commonAction.showPremiumModal();
			} else {
				this.props.commonAction.playerType(CONST.PREMIUM_PLAYER);
				this.props.playerCommonAction.playAllEpisodeAct(user.access_token, udid, seriesId);
			}
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}
	downloadEpisode(id, title) {
		const {
			user,
			downloadLimit,
			downloadIdArray,
			internetStatus,
		} = this.props;
		if (internetStatus) {
			const udid = DeviceInfo.getUniqueID();
			firebase.analytics().logEvent('EPISODE_DOWNLOADED', { Episode_Id : id , Series_Title : title , udid });
			if (!user || (user && !user.is_paid_user)) {
				this.props.commonAction.showPremiumModal();
			} else if ((downloadIdArray.length) === downloadLimit) {
				showToast('Maximum downloading limit reached');
			} else {
				showToast('Downloading...');
				this.props.downloadAction.downloadEpisodeAct(user.access_token, udid, id);
			}
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}
	renderCommonCenterView(item, isEpisodeAvailable) {
		let id;
		let title = 'Episode Name/Air Date';
		let date = '';
		let duration = 'Duration';
		let containerStyle = styles.listHeadingContainer;
		let episodeTextStyle = styles.headingText;
		let textStyle = styles.headingText;
		let showDownloadSection = false;
		let isDisabled = true;
		let { downloadIdArray } = this.props;
		let episodeStatus;
		let downloadImageSource = CONST.DOWNLOADED_IMAGE;
		let showActivity = false;
		let listenedBefore = false;
		if (item) {
			id = item.item.id;
			title = item.item.title;
			listenedBefore = item.item.listened_before;
			duration = Validators.timeFormatDescriptive(item.item.duration);
			date = Validators.dateFormatter(item.item.original_air_date);
			containerStyle = styles.episodeContentStyle;
			textStyle = styles.listTextStyle;
			episodeTextStyle = styles.episodeTextStyle;
			showDownloadSection = true;
			isDisabled = false;
			const {
				user
			} = this.props;

			if (!user || (user && !user.is_paid_user)) {
				downloadImageSource = CONST.DOWNLOAD_IMAGE;
			}
			else {
				episodeStatus = downloadIdArray.find((element) => {
					return element.id.indexOf(id) != -1;
				});
				if (episodeStatus) {
					if (episodeStatus.status === 'fetching') {
						showActivity = true;
					}
				} else {
					downloadImageSource = CONST.DOWNLOAD_IMAGE;
				}
			}
		}

		return (
			<View>
				<TouchableOpacity
					disabled={isDisabled}
					onPress={() => this.onEpisodeClick(item.item)}
					style={containerStyle}>
					<View style={{ flex: 0.75, marginRight: 5 }} >
						<Text
							numberOfLines={2}
							style={episodeTextStyle} >
							{title}
						</Text>
						{date !== '' &&
							<Text style={textStyle} >
								{date}
							</Text>}
						{listenedBefore &&
							<View style={styles.listenedBeforeIcon} >
								<Image
									source={CONST.SOUND_ICON3}
								/>
							</View>}
					</View>
					<View style={{ flex: 0.25 }} >
						<Text style={[textStyle]}>
							{duration}
						</Text>
					</View>
					{showDownloadSection ?
						[
							episodeStatus ?
								<View style={styles.downloadImageContainer}>
									{showActivity ?
										<ActivityIndicator style={styles.indicatorStyle} />
										:
										<Image
											source={downloadImageSource}
										/>
									}
								</View>
								:
								<TouchableOpacity
									key={id}
									style={styles.downloadImageContainer}
									onPress={() => this.downloadEpisode(id, title)}
								>
									<Image
										source={downloadImageSource}
									/>
								</TouchableOpacity>
						]
						:
						<TouchableOpacity
							disabled={!isEpisodeAvailable}
							onPress={() => this.playAllEpisode()}
							style={[styles.playAllButton, { opacity: !isEpisodeAvailable ? 0.5 : 1 }]}
						>
							<Image
								source={CONST.PLAY_ALL_ICON}
							/>
						</TouchableOpacity>
					}
				</TouchableOpacity>
				{id && <View style={[styles.listDivider, { height: scale(1) }]} />}
			</View>
		);
	}

	fetchMore() {
		console.log("# fetchMore");
		const {
			seriesId,
			episodeTotalPages,
			episodeCurrentPage,
		} = this.props;
		if (seriesId && (episodeCurrentPage < episodeTotalPages)) {
			this.setState({
				showActivityIndicator: true,
			});
		}
	}

	renderEpisodesList() {
		const {
			episodesList,
			searchedEpisodeData,
			downloadIdArray,
		} = this.props;
		let episodeData = searchedEpisodeData ? searchedEpisodeData : episodesList;
		let isEpisodeAvailable = episodeData && episodeData.length > 0;
		return (
			<View style={{flex:1}}>
				<View >
					{this.renderCommonCenterView('', isEpisodeAvailable)}
				</View>
				{isEpisodeAvailable ? <View style={{flex:1}}>
					<FlatList
						style={{flex:1}}
						data={episodeData}
						extraData={{ ...this.state, ...downloadIdArray }}
						keyExtractor={item => item.id.toString()}
						renderItem={(item) => this.renderCommonCenterView(item)}
						onEndReached={() => this.fetchMore()}
					/>
				</View> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_EPISODES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}


	renderActivityIndicator() {
		return (
			<ActivityIndicator style={styles.indicatorStyle} />
		);
	}

	render() {
		const {
			seriesId
		} = this.props;
		return (
			<View style={{flex:1, marginTop: scale(20) }}>
				{seriesId && this.renderHeaderView()}
				{this.renderEpisodesList()}
				{this.state.showActivityIndicator && this.renderActivityIndicator()}
				{this.renderDescriptionModal()}
			</View>
		);
	}
}

EpisodeCell.propTypes = {
	status: PropTypes.bool,
	commonAction: PropTypes.object,
	screenDataAction: PropTypes.object,
	playerCommonAction: PropTypes.object,
	seriesId: PropTypes.number,
	seriesHeading: PropTypes.string,
	onPressBack: PropTypes.func,
	seriesImage: PropTypes.string,
	seriesDescription: PropTypes.string,
	containerStyle: PropTypes.object,
	route: PropTypes.string,
	user: PropTypes.object,
	searchedEpisodeData: PropTypes.array,
	episodesList: PropTypes.array,
	downloadAction: PropTypes.object,
	downloadIdArray: PropTypes.array,
	playerObject: PropTypes.object,
	downloadLimit: PropTypes.number,
	internetStatus: PropTypes.bool,
	episodeTotalPages: PropTypes.number,
	episodeCurrentPage: PropTypes.number,
};