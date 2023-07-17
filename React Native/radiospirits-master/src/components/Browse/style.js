import { StyleSheet, Platform } from 'react-native';
import scale from '../../utils/scale';
import * as CONST from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: CONST.WHITE_COLOR,
	},
	topMargin:{
		marginTop:Platform.OS == 'ios' ? scale(20) : scale(0),
	},
	searchHeader:{
		height:scale(125),
		justifyContent:'center',
	},
	headingContainer:{
		height:scale(70),
		alignItems:'center',
		justifyContent:'center',
	},
	searchHeaderText:{
		fontSize:scale(13),
		lineHeight: scale(18),
		fontFamily:CONST.fontFamily.MediumItalic,
		color: CONST.BLACK_COLOR,
		textAlign:'center',
	},
	title: {
		marginTop: 20,
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: '#000',
	},
	searchBox: {
		height: scale(45),
		backgroundColor: CONST.TITLEBAR_BACKGROUND_COLOR,
		marginHorizontal: scale(18),
		marginTop: scale(18),
		marginBottom: scale(8),
		borderWidth: 1,
		borderColor: CONST.BORDER_COLOR_GREY,
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
	},
	textInput: {
		flex: 0.9,
		fontSize: scale(13),
		fontFamily: CONST.fontFamily.MediumItalic,
		paddingLeft: scale(15),
		alignItems:'center'
	},
	searchImageContainer: {
		flex: 0.1,
		alignItems: 'center',
		borderColor: CONST.BORDER_COLOR_GREY,
		paddingLeft:scale(12),
		flexDirection:'row'
	},
	tabButtons: {
		height: scale(27),
		borderRadius: scale(8),
		borderWidth: 1,
		justifyContent: 'center',
		borderColor: CONST.BORDER_COLOR_GREY,
	},
	tabTextStyle: {
		fontSize: scale(11),
		paddingHorizontal: scale(15),
		fontFamily: CONST.fontFamily.Medium,
		color: CONST.BLACK_COLOR,
		opacity:.5,
	},
	tagStyle: {
		fontSize: scale(13),
		lineHeight: scale(18),
		color: CONST.BLACK_COLOR,
		fontFamily: CONST.fontFamily.Bold
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginLeft:scale(4)
	},
	selectedTab: {
		backgroundColor: CONST.BLACK_COLOR,
		borderColor: CONST.BLACK_COLOR,
	},
	selectedTabText: {
		color: CONST.WHITE_COLOR,
		opacity: 1,
	},
	listHeadingContainer: {
		height: scale(50),
		backgroundColor: CONST.TITLEBAR_BACKGROUND_COLOR,
		borderWidth: 1,
		borderColor: CONST.BORDER_COLOR_GREY,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: scale(18),
	},
	listHeaderStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	headingText: {
		fontSize: scale(13),
		lineHeight: scale(13.5),
		fontFamily: CONST.fontFamily.Bold,
		color: CONST.BLACK_COLOR,
	},
	listTextStyle: {
		fontSize: scale(13),
		lineHeight: scale(14.5),
		fontFamily: CONST.fontFamily.Regular,
		color: CONST.BLACK_COLOR,
	},
	episodeSeriesTextStyle: {
		fontSize: scale(13),
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
	},
	episodeTextStyle: {
		fontSize: scale(13),
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.GREY_COLOR,
	},
	episodeDateStyle: {
		fontSize: scale(13),
		fontFamily: CONST.fontFamily.Regular,
		color: CONST.BLACK_COLOR,
	},
	listContentStyle: {
		minHeight: scale(55),
		backgroundColor: CONST.WHITE_COLOR,
		borderBottomWidth: 1,
		borderColor: CONST.BORDER_COLOR_GREY,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: scale(18),
	},
	episodeContentStyle: {
		height: scale(55),
		backgroundColor: CONST.WHITE_COLOR,
		borderColor: CONST.BORDER_COLOR_GREY,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: scale(18),
	},
	episodeTitleContainer: {
		paddingVertical: scale(20),
		borderWidth: 1,
		borderColor: CONST.BORDER_COLOR_GREY,
		borderBottomWidth: 0,
		flexDirection: 'row',
	},
	episodeTitleText: {
		fontFamily: CONST.fontFamily.Bold,
		fontSize: scale(15),
		lineHeight: scale(24.5),
		color: CONST.BLACK_COLOR,
		width:scale(210),
		textAlign:'left',
	},
	genreSeriesTitleText: {
		fontFamily: CONST.fontFamily.Black,
		fontSize: scale(16),
		color: CONST.BLACK_COLOR,
		width:scale(210),
		textAlign:'center',
	},
	episodeDescriptionText: {
		fontFamily: CONST.fontFamily.Regular,
		fontSize: scale(13),
		lineHeight: scale(19.5),
		color: CONST.BLACK_COLOR,
		width:scale(210),
		textAlign:'left',
		marginTop: scale(3),
	},
	divider: {
		marginTop: scale(20),
		borderBottomWidth: 1,
		borderColor: CONST.BORDER_COLOR_GREY,
	},
	genreHeadingContainer:{
		marginTop:scale(18),
		paddingHorizontal:scale(18),
		paddingVertical:scale(11),
		borderBottomWidth:1,
		borderTopWidth:1, 
		borderColor:CONST.BORDER_COLOR_GREY,
		backgroundColor: CONST.TITLEBAR_BACKGROUND_COLOR,
	},
	genreMsgtitle:{
		fontSize: scale(11), 
		lineHeight: scale(14),
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
		textAlign:'left'
	},
	genreCellText: {
		fontSize: scale(12),
		fontFamily: CONST.fontFamily.Regular,
		color: CONST.BLACK_COLOR,
	},
	genreCellStyle: {
		height: scale(42),
		borderBottomWidth: 1,
		justifyContent: 'center',
		borderColor: CONST.BORDER_COLOR_GREY,
	},
	seriesImage: {
		height: scale(105),
		width: scale(105),
		borderRadius: scale(6),
		resizeMode: 'cover'
	},
	seriesImageCache: {
		height: scale(105),
		width: scale(105),
		borderRadius: 5,
		marginHorizontal: scale(10),
	},
	sectionHeaderStyle: {
		backgroundColor: CONST.BLACK_COLOR,
		height: scale(30),
		paddingLeft: scale(16),
		justifyContent: 'center',
		marginTop:scale(15),
	},
	sectionHeaderTextStyle: {
		fontSize: scale(13),
		color: CONST.WHITE_COLOR,
		fontFamily: CONST.fontFamily.Bold,
	},
	sectionListItemStyle: {
		height: scale(50),
		justifyContent: 'center',
		paddingLeft: scale(15),
		marginVertical: scale(13),
	},
	sectionListItemTextStyle: {
		color: CONST.BLACK_COLOR,
		fontFamily: CONST.fontFamily.SemiBold,
		fontSize: scale(13),
	},
	sectionListItemDateTextStyle: {
		color: CONST.BLACK_COLOR,
		fontFamily: CONST.fontFamily.Regular,
		fontSize: scale(13),
		paddingLeft:(2),
	},
	segmentedTabStyle:{
		borderColor: CONST.BORDER_COLOR_GREY,
	},
	tabsContainerStyle:{
		marginHorizontal: scale(30),
		height:scale(32),
		alignSelf:'center',
		width: scale(325)
	},
	segmentedTabTextStyle:{
		fontSize:scale(11),		
		color:CONST.WHITE_COLOR,
		fontFamily:CONST.fontFamily.SemiBold,
		alignItems:'center',
	},
	segmentedInactiveTabTextStyle:{
		fontSize:scale(11),		
		lineHeight: scale(13.5),
		color:CONST.BLACK_COLOR,
		fontFamily:CONST.fontFamily.SemiBold,
	},
	segmentedActiveTabStyle:{
		backgroundColor:CONST.BLACK_COLOR,
	},
	viewMoreText: {
		textAlign: 'right',
		color: CONST.BLUE_COLOR_COLLAPSE,
		fontSize: scale(12),
		fontFamily: CONST.fontFamily.Bold,
	},
	playAllButton: {
		justifyContent:'center',
		alignItems:'flex-end',
		flex: 0.15,
		borderRadius:5,
	},
	crossIconContainer: {
		backgroundColor: 'transparent',
		position: 'absolute',
		right: 0,
		top: 0
	},
	crossIcon: {
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalCrossImageStyle: {
		position: 'absolute',
		right: 15,
		top: 15
	},
	modalContainer: {
		minHeight: scale(200),
		maxHeight: scale(610),
		alignSelf: 'stretch',
		backgroundColor: CONST.WHITE_COLOR,
		borderRadius: 6,
	},
	modalHeadingTitle: {
		fontFamily: CONST.fontFamily.Bold,
		fontSize: scale(22),
		color: CONST.BLACK_COLOR,
		marginTop: scale(15),
		marginHorizontal: scale(25)
	},
	modalDescriptionText: {
		fontFamily: CONST.fontFamily.Regular,
		fontSize: scale(13),
		color: CONST.BLACK_COLOR,
		marginTop: scale(23),
		marginHorizontal: scale(30)
	},
	listDivider:{
		height:scale(0.5),
		backgroundColor: CONST.BORDER_COLOR_GREY_LIGHT, 
		marginHorizontal:scale(15),
	},
	listBorderStyle:{
		borderLeftWidth:0.5,
		borderRightWidth:0.5,
		borderColor: CONST.BORDER_COLOR_GREY_LIGHT,
	},
	vLine:{
		height:scale(17),
		borderRightWidth:2,
		borderColor:CONST.BORDER_COLOR_GREY,
	},
	headerSeparator:{
		height:scale(15),
		borderTopWidth:0.5,
		borderColor: CONST.BORDER_COLOR_GREY_LIGHT,
	},
	downloadImageContainer:{
		flex: 0.15, 
		alignItems: 'flex-end', 
	},
	indicatorStyle: {
		paddingRight: scale(3),
	},	
	filterContainer: {
		alignItems:'center',
		flexDirection:'row',
		borderColor: CONST.BORDER_COLOR_GREY,
		borderTopWidth:1,
		height: scale(50),
		justifyContent:'space-between'
	},
	fliterText: {
		fontFamily: CONST.fontFamily.Regular,
		fontSize: scale(13),
		color: CONST.BLACK_COLOR,
		lineHeight: scale(22),
		marginLeft: scale(20)
	},
	dropdownStyle: {
		backgroundColor: CONST.TITLEBAR_BACKGROUND_COLOR,
		borderColor: CONST.BORDER_COLOR_GREY,
		borderWidth:1,
		width:scale(120),
		borderRadius:scale(2),
		marginLeft:scale(8)
	},
	dropdownListStyle: {
		backgroundColor: CONST.TITLEBAR_BACKGROUND_COLOR,
		borderColor: CONST.BORDER_COLOR_GREY,
		borderWidth:1,
		width:scale(120),
		marginTop:scale(5),
		borderRadius:scale(2)
	},
	dropdownTextStyle: {
		paddingLeft:scale(10),
		paddingVertical:scale(5),
		fontSize:scale(13),
		fontFamily:CONST.fontFamily.SemiBold,
		color:CONST.BLACK_COLOR,
		lineHeight:scale(13.5)
	},
	dropdownListTextStyle: {
		height: scale(37),
		paddingLeft:scale(10),
		fontFamily:CONST.fontFamily.SemiBold,
		fontSize:scale(13),
		color:CONST.BLACK_COLOR,
		lineHeight:scale(13.5)
	},
	dropdownArrowImage: {
		position:'absolute',
		top:scale(10),
		left:scale(115)
	},
	listenedBeforeIcon: {
		position: 'absolute',
		left: scale(-12),
		top:scale(3),
	}
});