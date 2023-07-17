import React, { Component } from 'react';
import {
	SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import * as CONST from '../../utils/Const';
import showToast from '../../utils/Toast';
import EpisodeCell from '../Browse/EpisodeCell';
import GenreSeriesCell from '../Browse/GenreSeriesCell';
import MiniPlayer from '../Player/MiniPlayer/MiniPlayerContainer';

let seriesObj = {};
let genreObj = {};
let route = '';
export default class SeriesGenreComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			objectType: '',
			callApi: true,
		};
	}

	UNSAFE_componentWillMount() {
		const {
			navigation,
		} = this.props;
		if (navigation) {
			const {
				state,
			} = navigation;
			if (state && state.params) {
				const {
					item,
				} = state.params;
				if (item.object_type === 'Genre') {
					genreObj = item;
				} else {
					seriesObj = item;
				}
				this.setState({
					objectType: item.object_type,
				});
			}
		}
	}

	onPressGenreSreiesItem(item) {
		if (this.props.internetStatus) {
			seriesObj['id'] = item.id;
			seriesObj['title'] = item.title;
			seriesObj['artwork_url'] = item.image_url;
			console.log("####### onPressGenreSreiesItem",seriesObj);
			route = 'genreScreen';
			this.setState({
				objectType: 'Series',
			});
		} else {
			showToast(CONST.NO_INTERNET_CONNECTION);
		}
	}

	renderGenreCell() {
		const {
			id,
			title,
			artwork_url
		} = genreObj;
		route = '';
		return (
			<GenreSeriesCell
				genreHeading={title}
				seriesName={'Series Name'}
				genreId={id}
				seriesImage={artwork_url}
				onPressSeriesItem={(item) => this.onPressGenreSreiesItem(item)}
				callApi={this.state.callApi}
				initialRoute={'Home'}
				{...this.props}
			/>
		);
	}

	renderEpisodeCell() {
		const {
			id,
			title,
			artwork_url,
			description
		} = seriesObj;
		return (
			<EpisodeCell
				seriesHeading={title}
				seriesDescription={description}
				seriesId={id}
				seriesImage={artwork_url}
				onPressBack={() => this.backFromEpisodeCell()}
				containerStyle={{ borderWidth: 0 }}
				{...this.props}
			/>
		);
	}

	backFromEpisodeCell() {
		if (route == 'genreScreen') {
			this.setState({
				callApi: false,
				objectType: 'Genre',
			});
		} else {
			this.props.navigation.goBack();
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				{this.state.objectType === 'Series' ? this.renderEpisodeCell() : this.renderGenreCell()}
				<MiniPlayer {...this.props} />
			</SafeAreaView>
		);
	}
}

SeriesGenreComponent.propTypes = {
	navigation: PropTypes.object,
	internetStatus: PropTypes.bool,
};