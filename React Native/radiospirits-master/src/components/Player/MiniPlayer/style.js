import { StyleSheet } from 'react-native';
import scale from '../../../utils/scale';
import {fontFamily, BLACK_COLOR, WHITE_COLOR, GREY_COLOR} from '../../../utils/Const';


module.exports = StyleSheet.create({
	playerTab:{
		backgroundColor: WHITE_COLOR,
		height: scale(95),
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		// flex:1
	},
	hLine: {
		height: scale(1.5),
		backgroundColor: 'rgb(208,208,208)',
		opacity: 0.8,
	},
	playerTabContentContainer: {
		flexDirection: 'row',
	},
	playerTabIconContainer:{
		backgroundColor:'black',
		height: scale(46),
		width: scale(46),
		marginLeft: scale(25),
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: scale(5),
		marginTop: scale(2)

	},
	playerTabIcon: {
		fontSize: scale(22),
		color: WHITE_COLOR,
		fontFamily: fontFamily.Bold,
	},
	playerTabImage: {
		height: scale(46),
		width: scale(46),
	},
	playerTabDescriptionContainer: {
		flex:1,
		paddingHorizontal: scale(10),
		alignSelf: 'flex-start',
	},
	playerTabSeriesName: {
		color: BLACK_COLOR,
		fontSize: scale(14),
		fontFamily: fontFamily.Bold,
	},
	playerTabEpisodeName :{
		color: GREY_COLOR,
		fontSize: scale(13),
		fontFamily: fontFamily.Regular,
	},
	playerTabAirDate: {
		color: BLACK_COLOR,
		fontSize: scale(13),
		fontFamily: fontFamily.Regular,
	},
	playerTabResumeIcon :{
		height: scale(35),
		width: scale(35),
		marginRight: scale(20),
		borderRadius: scale(5),
	},
	bufferStateIndicator: {
		justifyContent: 'center',
		alignItems: 'center',
		height: scale(35),
		width: scale(35),
		marginRight: scale(20),
	}
});