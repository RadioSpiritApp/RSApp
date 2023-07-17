import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Text,
	Image,
	ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import { getRootNavigation } from '../../../AppRoot';
import Validators from '../../../utils/Validator';
import { CachedImage } from 'react-native-cached-image';
import * as CONST from '../../../utils/Const';
import RNMarqueeEffect from 'react-native-marquee-effect';

export default class MiniPlayerComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	togglePlayerState() {
		this.props.playerCommonAction.changeState(!this.props.isPlay);
		this.props.onTogglePlayback();
	}
	
	playerTabOnPress() {
		const screen = this.props.playerType == CONST.FREE_PLAYER ? 'FreePlayerScreen' : 'PlayerScreen';
		getRootNavigation().navigate(screen, {
			isModal: true,
			tabNavigation: this.props.navigation
		});
	}

	renderPremiumContentView(playerObject) {
		const {
			title,
			series_title,
			original_air_date,
		} = playerObject;
		return (
			<View style={styles.playerTabDescriptionContainer}>
				<View>
					<RNMarqueeEffect
						textStyle={styles.playerTabSeriesName}
						textContainerHeight={15}
						speed={50}
					>
						{series_title}
					</RNMarqueeEffect>
					<RNMarqueeEffect
						textStyle={styles.playerTabEpisodeName}
						textContainerHeight={15}
						speed={50}
					>
						{title}
					</RNMarqueeEffect>
				</View>
				<Text style={styles.playerTabAirDate}>
					{Validators.dateFormatter(original_air_date)}
				</Text>
			</View>
		);
	}

	render() {
		const {
			playerObject,
			isPlay,
			playerType,
			freeEpisodeList,
			bufferState
		} = this.props;

		if (!playerObject) {
			return (
				<View />
			);
		}
		const {
			title,
			artwork,
		} = playerObject;
		
		const episodeInitials = Validators.getTwoInitials(title);
		let wrwList = (freeEpisodeList && freeEpisodeList.data) ? freeEpisodeList.data : null;
		
		return (
			<TouchableWithoutFeedback
				onPress={() => this.playerTabOnPress()}
				style={{ flex: 1, alignSelf: 'flex-end' }}
			>
				<View >
					<View style={styles.hLine}></View>
					<View style={styles.playerTab}>
						<View style={styles.playerTabContentContainer}>
							<View style={styles.playerTabIconContainer}>
								{artwork ?
									<CachedImage style={styles.playerTabImage}
										source={{ uri: artwork }}
									/> :
									<Text style={styles.playerTabIcon}>
										{episodeInitials}
									</Text>}
							</View>
							<View style={{ flex: 1 }} >
								{playerType != CONST.FREE_PLAYER ?
									this.renderPremiumContentView(playerObject)
									: (
										<View style={styles.playerTabDescriptionContainer}>
											<View>
												<Text style={styles.playerTabSeriesName}>
													{`When Radio Was for ${Validators.dateFormatter(playerObject.play_date)}`}
												</Text>
												{wrwList && wrwList.map((object, index) => {
													if (index < 2) {
														let title = object.series_title + ' ' + Validators.dateFormatter(object.original_air_date);
														return (
															<RNMarqueeEffect
																key={index}
																textStyle={styles.playerTabEpisodeName}
																textContainerHeight={15}
																speed={50}
															>
																{title}
															</RNMarqueeEffect>
														);
													}
												})}
											</View>
										</View>
									)
								}
							</View>
							{bufferState ?
								<View style={styles.bufferStateIndicator} >
									<ActivityIndicator size='small' color={CONST.GREY_COLOR} />
								</View>
								:
								<TouchableOpacity
									onPress={() => { this.togglePlayerState(); }}
								>
									<Image style={styles.playerTabResumeIcon}
										source={isPlay ? CONST.PAUSE_ICON : CONST.PLAY_ICON}
									/>
								</TouchableOpacity>}
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

MiniPlayerComponent.propTypes = {
	navigation: PropTypes.object,
	token: PropTypes.string,
	onTogglePlayback: PropTypes.func,
	playerType: PropTypes.string,
	playerCommonAction: PropTypes.object,
	isPlay: PropTypes.bool,
	playerObject: PropTypes.object,
	freeEpisodeList: PropTypes.object,
	bufferState: PropTypes.bool,
};