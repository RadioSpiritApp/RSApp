import { StyleSheet, Platform } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import { BLACK_COLOR, WHITE_COLOR, fontFamily, BORDER_COLOR_GREY_LIGHT } from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: WHITE_COLOR,
	},
	topMargin:{
		marginTop:Platform.OS == 'ios' ? scale(20) : scale(0),
	},
	sampleText: {
		textAlign: 'center',
		fontSize: scale(16),
		fontFamily: fontFamily.Black,
		color: BLACK_COLOR,
	},
	headerContainer: {
		height: scale(68),
		alignItems: 'center',
		justifyContent: 'center',
	},
	hLine: {
		height: scale(1.5),
		backgroundColor: BLACK_COLOR,
		opacity: 0.1,
	},
	categoryHeading: {
		paddingHorizontal: scale(20),
		paddingVertical: scale(10),
		textAlign: 'left',
		fontSize: scale(15),
		fontFamily: fontFamily.Bold,
		color: BLACK_COLOR,
	},
	firstComponentHeading: {
		paddingTop: scale(15),
	},
	titleContainer: {
		paddingVertical: scale(10),
	},
	radioWasTitleContainer: {
		width: scale(159),
		paddingVertical: scale(10),
		paddingHorizontal: scale(9),
	},
	episodeTitle: {
		textAlign: 'left',
		fontSize: scale(13),
		fontFamily: fontFamily.Bold,
		width: scale(140),
		color: BLACK_COLOR,
	},
	episodeImage: {
		height: scale(161),
		width: scale(161),
	},
	featuredImage: {
		height: scale(100),
		width: scale(155),
	},
	featuredContainer: {
		flexDirection: 'row',
		paddingHorizontal: scale(20),
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	horizontalScroll: {
		paddingLeft: scale(20),
	},
	horizontalImdSpacing: {
		width : scale(12),
	},
	radioWasTitleDate: {
		width: scale(161),
		height: verticalScale(29),
		paddingHorizontal: scale(9),
		backgroundColor: BLACK_COLOR,
		justifyContent: 'center',
	},
	radioWasTitleDateCont: {
		height: verticalScale(42),
	},
	radioWasTitleText: {
		textAlign: 'left',
		fontSize: scale(13),
		fontFamily: fontFamily.Bold,
		color: WHITE_COLOR,
	},
	radioWasText: {
		textAlign: 'left',
		fontSize: scale(13),
		fontFamily: fontFamily.SemiBold,
		color: BLACK_COLOR,
		width: scale(150),
		lineHeight: scale(18)
	},
	radioWasItemContainer: {
		borderColor: BORDER_COLOR_GREY_LIGHT,
		borderWidth: 0.3,
	},
	hBorder: {
		height: 0.5,
		backgroundColor: BORDER_COLOR_GREY_LIGHT,
		marginHorizontal: scale(10),
	},
});