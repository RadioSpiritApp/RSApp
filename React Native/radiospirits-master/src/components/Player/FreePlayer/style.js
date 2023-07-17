import {
	StyleSheet,
	Platform
} from 'react-native';
import screen from '@utils/screen';
import scale, {verticalScale} from '../../../utils/scale';
import * as CONST from '../../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: CONST.WHITE_COLOR,
	},
	headerContainer: {
		backgroundColor: 'white',
		alignItems: 'center',
		paddingTop: Platform.OS == 'ios' ? scale(40) : scale(20),
	},
	playerAdSeekBarContainer: {
		marginHorizontal: scale(16),
		marginTop:scale(15),
	},
	playerSeekBarContainer: {
		marginTop: Platform.OS == 'ios' ? scale(-4) : scale(7),
		marginHorizontal: Platform.OS == 'ios' ? scale(14) : 0,
	},
	seriesNameTitle: {
		fontFamily: CONST.fontFamily.SemiBold,
		fontSize: scale(20),
		textAlign: 'center',
		color: CONST.BLACK_COLOR,
	},
	episodeNameTitle: {
		fontFamily: 'Raleway-Regular',
		fontSize: scale(13),
		textAlign: 'center',
		color: '#000000',
		margin: scale(1)
	},
	displayDate: {
		fontFamily: 'Raleway-Regular',
		fontSize: scale(11),
		textAlign: 'center',
		color: '#000000',
		margin: scale(1)
	},
	playTime: {
		fontFamily: CONST.fontFamily.SemiBold,
		fontSize: scale(13),
		color: CONST.BLACK_COLOR,
	},
	radioItemList: {
		height: scale(85),
		borderBottomWidth: 1,
		paddingHorizontal: scale(20),
		borderColor: CONST.BORDER_COLOR_GREY,
		justifyContent: 'center',
	},
	episodeTitleText: {
		fontSize: scale(14.5),
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
	},
	episodeSubTitleText: {
		fontSize: scale(12),
		fontFamily:CONST.fontFamily.Regular,
		color:CONST.GREY_COLOR
	},
	topHeading: {
		fontSize: scale(22),
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
		textAlign: 'left',
	},
	topSubHeading: {
		fontSize: scale(13),
		fontFamily: CONST.fontFamily.Regular,
		color: CONST.BLACK_COLOR,
		textAlign: 'left',
	},
	topHeadingContainer: {
		//height: scale(60),
		borderBottomWidth: 1,
		paddingLeft: scale(19),
		borderColor: CONST.BORDER_COLOR_GREY,
		justifyContent: 'center',
		marginTop: scale(10),
		paddingBottom: scale(15),
	},
	episodeDetailsContainer: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	progress: {
		height: 2,
		width: '100%',
		flexDirection: 'row',
	},
	timeDuration: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: scale(15),
		marginTop: Platform.OS == 'ios' ? scale(-10) : 0,
	},
	adTimeDuration: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: scale(15),
		marginTop: scale(9),
	},
	episodeContainerWithAdd: {
		minHeight: scale(85 * 2),
		maxHeight: scale(85 * 2),
	},
	minHeightOfContainer: {
		minHeight: scale(85 * 2),
	},
	adContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: scale(10),
	},
	selectItem: {
		backgroundColor: CONST.ICON_BG,
	},
	audioAdLabelContainer: {
		marginLeft: scale(15),
		height: scale(17),
		width: scale(26),
		backgroundColor: 'rgb(204, 204, 204)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 3,
	},
	audioAdLinkContainer: {
		paddingLeft: scale(5),
		alignItems: 'center',
		justifyContent: 'center',
	},
	audioAdLabel: {
		fontSize: scale(10),
		fontFamily: CONST.fontFamily.SemiBold,
		color: 'rgb(254, 254, 254)',
		textAlign: 'left',
	},
	audioAdLink: {
		fontSize: scale(10),
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
		textAlign: 'left',
		textDecorationLine: 'underline'
	},
	optionModalStyle: {
		position:'absolute',
		bottom:verticalScale(10),
		width:scale(343),
		alignSelf:'center'
	},
	optionsContainer: {
		backgroundColor:'rgb(255,255,255)',
		borderRadius:scale(10)
	},
	optionsCell: {
		borderBottomWidth:1,
		borderBottomColor:'rgb(208, 208, 208)',
	},
	optionsText: {
		fontFamily:CONST.fontFamily.SemiBold,
		fontSize:scale(15),
		color:CONST.BLACK_COLOR,
		marginLeft:scale(18),
		marginTop:verticalScale(18),
		marginBottom:verticalScale(16)
	},
	downloadImage: {
		alignSelf:'center',
		height:scale(28),
		width:scale(28),
		marginLeft:scale(18),
	},
	cancelButton: {
		backgroundColor:'rgb(255,255,255)',
		marginTop:verticalScale(8),
		height:verticalScale(55),
		borderRadius:scale(10),
		alignItems:'center',
		justifyContent:'center'
	},
	cancelButtonText: {
		fontFamily:CONST.fontFamily.Bold,
		fontSize:scale(15),
		color:CONST.BLACK_COLOR,
		lineHeight:scale(22),
	},
	airPlayView: {
		marginTop: 5,
		height: 40,
		width: 30,
	}
});