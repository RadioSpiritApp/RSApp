import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	Text,
	FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import Validator from '../../utils/Validator';
import DeviceInfo from 'react-native-device-info';
import * as CONST from '../../utils/Const';
import showToast from '../../utils/Toast';
import commonstyles from '../commonstyles';
import Validators from '../../utils/Validator';
import { verticalScale } from '../../utils/scale';

export default class RecentlyPlayedCell extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	componentDidMount() {
		const {
			user,
		} = this.props;
		this.props.commonAction.startSpinner();
		this.props.recentlyPlayedAction.resetRecentlyPlayedEpisode();
		this.props.recentlyPlayedAction.getRecentEpisodesAct(user.access_token, 1);
	}

	renderEpisodeList() {
		const {
			episodeList,
		} = this.props;
		const episodeData = episodeList ? episodeList : [];
		let isEpisodeAvailable = episodeData && episodeData.length;
		return (
			<View style={{ flex: 1 }}>
				{isEpisodeAvailable ?
					<FlatList
						data={episodeData}
						renderItem={({ item }) => this._renderItem({ item })}
						keyExtractor={item => item.id}
						extraData={this.state}
						onEndReached={() => this.fetchMore()}
						onEndReachedThreshold={0.2}
					/> :
					<Text style={commonstyles.noItemStyle} >
						{CONST.NO_EPISODES_AVAILABLE}
					</Text>
				}
			</View>
		);
	}

	fetchMore() {
		const {
			episodeTotalPage,
			episodeCurrentPage,
			user,
		} = this.props;
		if (episodeCurrentPage < episodeTotalPage) {
			this.props.commonAction.startSpinner();
			this.props.recentlyPlayedAction.getRecentEpisodesAct(user.access_token, episodeCurrentPage + 1);
		}
	}
	renderPremiumEpisode(item) {
		return (
			<TouchableOpacity style={styles.listContentStyle}
				onPress={() => { this.onPressEpisode(item); }}
			>
				<View style={styles.episodeContainer}>
					<Text style={styles.episodeSeriesTextStyle}>
						{item.series_title}
					</Text>
					<Text style={styles.episodeTextStyle}>
						{item.title}
					</Text>
					<Text style={styles.episodeDateStyle}>
						{Validator.dateFormatter(item.original_air_date)}
					</Text>
				</View>
				<View style={styles.durationContainer}>
					<Text style={styles.durationContentTextStyle}>
						{Validator.timeFormatDescriptive(item.duration)}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	renderWrwEpisode(item, wrwList) {
		let duration = item.duration[0];
		wrwList.length = wrwList.length > 2 ? 2 : wrwList.length;
		return (
			<View style={{ paddingTop: verticalScale(12) }}>
				<TouchableOpacity style={styles.cellStyle}
					onPress={() => { this.onPressWrwEpisode(wrwList); }}
				>
					<View style={styles.episodeContainer}>
						<Text style={styles.episodeSeriesTextStyle}>
							{'When Radio Was for'} {Validators.dateFormatter(item.title)}
						</Text>
						{wrwList.map((object, index) => {
							return (
								<Text key={index} style={styles.episodeTextStyle}>
									{object.series_title} {Validators.dateFormatter(object.original_air_date)}
								</Text>
							);
						})}
					</View>
					<View style={styles.durationContainer}>
						<Text style={styles.durationContentTextStyle}>
							{Validators.timeFormatDescriptive(duration)}
						</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.hLine}>
				</View>
			</View>
		);
	}

	_renderItem({ item }) {
		return (
			<View>
				{item.data ?
					this.renderWrwEpisode(item, item.data) :
					this.renderPremiumEpisode(item) 
				}
			</View>
		);
	}

	onPressEpisode(item) {
		const {
			playerObject,
			user,
		} = this.props;
		const udid = DeviceInfo.getUniqueID();
		
		if (playerObject && item.id == playerObject.id) {
			showToast('Already Playing...');
			return;
		}
		this.props.commonAction.playerType(CONST.PREMIUM_PLAYER);
		this.props.playerCommonAction.getPremiumPlayerDataAct(item, udid, user.access_token, {}, true);
	}
	onPressWrwEpisode(item) {
		const {
			playerObject,
			user,
		} = this.props;
		const udid = DeviceInfo.getUniqueID();
		let alreadyPlaying = (playerObject && playerObject.id && playerObject.id.includes(item[0].id));
		if (alreadyPlaying) {
			showToast('Already Playing...');
			return;
		}
		let freeEpisodeList = { title:Validators.dateFormatter(item[0].play_date), data:item };
		this.props.commonAction.playerType(CONST.FREE_PLAYER);
		this.props.playerCommonAction.freeEpisodeList(freeEpisodeList);
		this.props.playerCommonAction.getPremiumPlayerDataAct(item[0], udid, user.access_token, freeEpisodeList, true);
	}

	renderHeader() {
		return (
			<View style={styles.recentHeaderStyle}>
				<Text style={[styles.headerContentStyle, styles.episodeContainer]}>Episode Name</Text>
				<Text style={[styles.headerContentStyle, styles.durationContainer]}>Duration</Text>
			</View>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }} >
				{this.renderHeader()}
				{this.renderEpisodeList()}
			</View>
		);
	}
}

RecentlyPlayedCell.propTypes = {
	navigation: PropTypes.object,
	recentlyPlayedAction: PropTypes.object,
	episodeList: PropTypes.array,
	commonAction: PropTypes.object,
	playerCommonAction: PropTypes.object,
	user: PropTypes.object,
	playerObject: PropTypes.object,
	episodeTotalPage: PropTypes.number,
	episodeCurrentPage: PropTypes.number,
};