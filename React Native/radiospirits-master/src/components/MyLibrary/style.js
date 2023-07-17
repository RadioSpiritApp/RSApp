import { StyleSheet, Platform } from 'react-native';
import screen from '@utils/screen';
import scale,{verticalScale} from '../../utils/scale';
import {fontFamily, BLACK_COLOR, WHITE_COLOR, BORDER_COLOR_GREY, GREY_COLOR, TITLEBAR_BACKGROUND_COLOR} from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:WHITE_COLOR
	},
	title: {
		marginTop: scale(20),
		fontSize: scale(20),
		textAlign: 'center',
		margin: scale(10),
		color: BLACK_COLOR,
	},
	segmentedTabContainer: {
		margin:scale(20),
		marginTop:verticalScale(35),
	},
	tabTextStyle: {
		fontFamily:fontFamily.SemiBold,
		fontSize:scale(11),
		color:BLACK_COLOR,
		lineHeight:scale(13.5),
	},
	filterContainer: {
		alignItems:'center',
		flexDirection:'row',
		borderColor:BORDER_COLOR_GREY,
		borderBottomWidth:1,
		borderTopWidth:1,
		height: scale(50),
		justifyContent:'space-between'
	},
	fliterText: {
		fontFamily:fontFamily.Regular,
		fontSize:scale(13),
		color:BLACK_COLOR,
		lineHeight:scale(22),
		marginLeft:scale(20)
	},
	dropdownStyle: {
		backgroundColor: TITLEBAR_BACKGROUND_COLOR,
		borderColor: BORDER_COLOR_GREY,
		borderWidth:1,
		width:scale(125),
		borderRadius:scale(2),
		marginLeft:scale(8)
	},
	dropdownListStyle: {
		// height:verticalScale(100),
		backgroundColor: TITLEBAR_BACKGROUND_COLOR,
		borderColor: BORDER_COLOR_GREY,
		borderWidth:1,
		width:scale(125),
		marginTop:verticalScale(5),
		borderRadius:scale(2)
	},
	dropdownTextStyle: {
		paddingLeft:scale(10),
		paddingVertical:verticalScale(5),
		fontSize:scale(13),
		fontFamily:fontFamily.SemiBold,
		color:BLACK_COLOR,
		lineHeight:scale(13.5)
	},
	dropdownListTextStyle: {
		height: scale(37),
		paddingLeft:scale(10),
		fontFamily:fontFamily.SemiBold,
		fontSize:scale(13),
		color:BLACK_COLOR,
		lineHeight:scale(13.5)
	},
	dropdownArrowImage: {
		position:'absolute',
		top:verticalScale(10),
		left:scale(115)
	},
	fliterNoteText: {
		fontFamily:fontFamily.RegularItalic,
		fontSize:scale(11),
		color:BLACK_COLOR,
		marginRight:scale(20)
	},
	headerStyle: {
		backgroundColor: TITLEBAR_BACKGROUND_COLOR,
		flexDirection:'row',
		alignItems:'center',
		borderColor: BORDER_COLOR_GREY,
		borderBottomWidth:1,
		paddingHorizontal:scale(20),
		height:scale(50),
	},
	recentHeaderStyle: {
		backgroundColor: TITLEBAR_BACKGROUND_COLOR,
		flexDirection:'row',
		alignItems:'center',
		borderColor: BORDER_COLOR_GREY,
		borderBottomWidth:1,
		borderTopWidth:1,
		paddingHorizontal:scale(20),
		height:scale(50),
	},
	headerContentStyle: {
		fontSize:scale(13),
		lineHeight:scale(13.5),
		fontFamily:fontFamily.Bold,
		color:BLACK_COLOR
	},
	cellStyle: {
		flexDirection:'row',
		marginHorizontal:scale(20),
		alignItems:'center',
	},
	durationContentTextStyle: {
		fontSize:scale(13),
		fontFamily:fontFamily.Regular,
		color:BLACK_COLOR,
		lineHeight:scale(14.5),
	},
	hLine: {
		marginTop:verticalScale(12),
		marginHorizontal:scale(20),
		height: scale(1),
		backgroundColor: BLACK_COLOR,
		opacity:.2,
	},
	freeUserContainer: {
		flex:1,
		alignItems: 'center',
		backgroundColor: WHITE_COLOR,
	},
	freeUserImage:{
		marginTop: verticalScale(135),
	},
	freeUserHeadingContainer: {
		marginTop: verticalScale(28),
		marginHorizontal: scale(45),
	},
	freeUserHeadingText: {
		textAlign: 'center',
		fontSize: scale(22),
		fontFamily: fontFamily.Bold,
		color: BLACK_COLOR,
		lineHeight: scale(24.5),
	},
	freeUserSubHeadingContainer: {
		marginTop: verticalScale(14),
		marginHorizontal: scale(48)
	},
	freeUserSubHeadingText: {
		textAlign: 'center',
		fontSize: scale(15),
		fontFamily: fontFamily.Regular,
		color: BLACK_COLOR,
	},
	freeUserButtonContainer: {
		backgroundColor: BLACK_COLOR,
		marginTop: verticalScale(35),
		marginHorizontal: scale(27),
		alignSelf: 'stretch',
		paddingVertical:scale(20),
	},
	freeUserButtonText: {
		textAlign: 'center',
		fontSize: scale(15),
		fontFamily: fontFamily.Bold,
		color: WHITE_COLOR,
		lineHeight: scale(22),
	},
	listContentStyle: {
		borderBottomWidth: 1,
		marginHorizontal:scale(20),
		borderColor: BORDER_COLOR_GREY,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical:scale(10),
	},
	episodeContainer: {
		flex:.75,
		marginRight: scale(15),
	},
	durationContainer: {
		flex:.25
	},
	episodeSeriesTextStyle: {
		fontSize: scale(13),
		fontFamily: fontFamily.SemiBold,
		color: BLACK_COLOR,
		lineHeight: scale(19)
	},
	episodeTextStyle: {
		fontSize: scale(13),
		fontFamily: fontFamily.SemiBold,
		color: GREY_COLOR,
		lineHeight: scale(19)
	},
	episodeDateStyle: {
		fontSize: scale(13),
		fontFamily: fontFamily.Regular,
		color: BLACK_COLOR,
		lineHeight: scale(19)
	},
	tabContainerStyle: {
		height:scale(35),
		alignSelf: 'center',
		width: scale(228),
	}
});