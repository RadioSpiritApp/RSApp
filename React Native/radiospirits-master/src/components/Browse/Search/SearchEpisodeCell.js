import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	Image,
	FlatList,
	ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import scale from '../../../utils/scale';
import styles from '.././style';
import showToast from '../../../utils/Toast';
import commonstyles from '../../commonstyles';
import * as CONST from '../../../utils/Const';
import Validators from '../../../utils/Validator';
import ModalDropdown from 'react-native-modal-dropdown';
import { prototype } from 'react-native-cached-image/CachedImage';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
let accessToken = '';
let sortBy = 'series_title';
export default class SearchEpisodeCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFilterIndex: '0',
			selectedFilterValue: 'Series Name',
		};
	}

	componentDidMount() {
		const {
			user,
		} = this.props;
		if (user && user.access_token) {
			accessToken = user.access_token;
		}
	}

	onEpisodeClick(item) {
		const {
			playerObject,
		} = this.props;
		if (playerObject && item.id == playerObject.id) {
			showToast('Already Playing...');
			return;
		}
		const {
			user,
		} = this.props;
		const udid = DeviceInfo.getUniqueID();
		if (!user || (user && !user.is_paid_user)) {
			this.props.commonAction.showPremiumModal();
		} else {
			this.props.commonAction.playerType(CONST.PREMIUM_PLAYER);
			this.props.playerCommonAction.getPremiumPlayerDataAct(item, udid, user.access_token);
		}
	}

	downloadEpisode(id, title) {
		const udid = DeviceInfo.getUniqueID();
		firebase.analytics().logEvent('EPISODE_DOWNLOADED', { Episode_Id : id , Title : title , udid });	
		const {
			user, downloadLimit, downloadIdArray
		} = this.props;
		if (!user || (user && !user.is_paid_user)) {
			this.props.commonAction.showPremiumModal();
		} else if ((downloadIdArray.length) === downloadLimit) {
			showToast('Maximum downloading limit reached');
		} else {
			showToast('Downloading...');
			this.props.downloadAction.downloadEpisodeAct(user.access_token, udid, id);
		}
	}

	renderCommonCenterView(item) {
		let id;
		let title = 'Series/Episode/Air Date';
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
		let seriesTitle = '';
		if (item) {
			id = item.item.id;
			title = item.item.title;
			seriesTitle = item.item.series_title;
			listenedBefore = item.item.listened_before;
			duration = Validators.timeFormatDescriptive(item.item.duration);
			date = Validators.dateFormatter(item.item.original_air_date);
			containerStyle = styles.listContentStyle;
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
			<TouchableOpacity
				disabled={isDisabled}
				onPress={() => this.onEpisodeClick(item.item)}
				style={[containerStyle, { paddingVertical: scale(10) }]}>
				<View style={{ flex: 0.75, marginRight: 5 }} >
					{seriesTitle !== '' &&
						<Text
							numberOfLines={2}
							style={styles.episodeSeriesTextStyle} >
							{seriesTitle}
						</Text>
					}
					<Text
						numberOfLines={2}
						style={episodeTextStyle} >
						{title}
					</Text>
					{date !== '' &&
						<Text style={styles.episodeDateStyle} >
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
							<TouchableOpacity style={styles.downloadImageContainer}
								onPress={() => this.downloadEpisode(id, title)}
							>
								<Image
									source={downloadImageSource}
								/>
							</TouchableOpacity>
					]
					:
					<View style={styles.downloadImageContainer} />
				}
			</TouchableOpacity>
		);
	}

	renderEpisodesList() {
		const {
			searchedEpisodeData
		} = this.props;
		let episodeData = searchedEpisodeData ? searchedEpisodeData : [];
		return (
			<View style={{ flex: 1 }} >
				<View >
					{this.renderCommonCenterView()}
				</View>
				{episodeData && episodeData.length > 0 ? <View style={{ flex: 1 }} >
					<FlatList
						data={episodeData}
						extraData={this.state}
						keyExtractor={item => item.id.toString()}
						renderItem={(item) => this.renderCommonCenterView(item)}
						onEndReached={() => this.fetchMore()}
						onEndReachedThreshold={0.2}
					/>
				</View> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_EPISODES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}

	fetchMore() {
		const {
			searchEpisodeTotalPages,
			searchEpisodeCurrentPage,
			searchKeyword,
		} = this.props;
		if (searchEpisodeCurrentPage < searchEpisodeTotalPages) {
			this.props.commonAction.startSpinner();
			this.props.searchDataAction.searchEpisodeAct(searchKeyword, searchEpisodeCurrentPage + 1, sortBy, accessToken);
		}
	}

	onSelectFilter(index, value) {
		const {
			searchKeyword
		} = this.props;
		const {
			selectedFilterIndex,
		} = this.state;
		switch (value) {
		case 'Air Date':
			sortBy = 'original_air_date';
			break;
		case 'Series Name':
			sortBy = 'series_title';
			break;
		case 'Episode Name':
			sortBy = 'episode_title';
			break;
		}
		if (selectedFilterIndex != index) {
			this.setState({
				selectedFilterIndex: index,
				selectedFilterValue: value,
			}, () => {
				this.props.commonAction.startSpinner();
				this.props.searchDataAction.resetSearchEpisode();
				this.props.searchDataAction.searchEpisodeAct(searchKeyword, 1, sortBy, accessToken);
			});
		}
	}

	renderFilterComponent() {
		return (
			<View style={styles.filterContainer}>
				<View style={{ flexDirection: 'row', alignItems: 'center', }}>
					<Text style={styles.fliterText}>Sort By:</Text>
					<View>
						<ModalDropdown
							options={CONST.RECENTLY_PLAYED_OPTION}
							defaultValue={CONST.RECENTLY_PLAYED_OPTION[0]}
							defaultIndex={this.state.selectedFilterIndex}
							showsVerticalScrollIndicator={false}
							style={styles.dropdownStyle}
							dropdownStyle={[styles.dropdownListStyle, { height: scale(37) * 3 }]}
							textStyle={styles.dropdownTextStyle}
							dropdownTextStyle={styles.dropdownListTextStyle}
							onSelect={(index, value) => this.onSelectFilter(index, value)}
						/>
						<Image style={styles.dropdownArrowImage} source={CONST.DROPDOWN_ICON} />
					</View>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={{ flex: 1, marginTop: scale(20) }}>
				{this.renderFilterComponent()}
				{this.renderEpisodesList()}
			</View>
		);
	}
}

SearchEpisodeCell.propTypes = {
	commonAction: PropTypes.object,
	screenDataAction: PropTypes.object,
	searchDataAction: PropTypes.object,
	playerCommonAction: PropTypes.object,
	seriesId: PropTypes.number,
	user: PropTypes.object,
	searchedEpisodeData: PropTypes.array,
	searchEpisodeTotalPages: PropTypes.number,
	searchEpisodeCurrentPage: PropTypes.number,
	searchKeyword: PropTypes.string,
	downloadLimit: PropTypes.number,
	downloadIdArray: prototype.array,
	downloadAction: prototype.object,
	playerObject: prototype.object,
};