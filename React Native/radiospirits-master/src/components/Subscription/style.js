import { StyleSheet } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import * as CONST from '../../utils/Const';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#6c93d1',
	},
	title: {
		marginTop:verticalScale(27),
		fontSize: scale(18),
		textAlign: 'center',
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
	},
	backIconContainer: {
		position: 'absolute',
		left:scale(10),
		paddingRight:scale(50),
		paddingVertical: verticalScale(14),
	},
	sampleText: {
		marginVertical: verticalScale(16),
		textAlign: 'center',
		fontSize: scale(16),
		fontFamily: CONST.fontFamily.Black,
		color: CONST.BLACK_COLOR,
	},
	headerContainer: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: CONST.BORDER_COLOR_GREY,
		justifyContent: 'center',
		alignItems:'center',
	},
	hLine: {
		height: scale(1.5),
		backgroundColor: CONST.BLACK_COLOR,
		opacity: 0.1,
		marginBottom:scale(15)
	},
	footerTextStyle:{
		textAlign:'center',
		fontFamily:CONST.fontFamily.Regular,
		color: CONST.BLACK_COLOR,
		fontSize:scale(13),
		lineHeight: scale(18),
	},
	subscriptionListCell:{
		marginHorizontal:scale(10),
		marginBottom:scale(30),
		height:scale(70),
		borderBottomWidth:4,
		borderRightWidth:2,
		borderLeftWidth:2,
		borderTopWidth:1,
		borderRadius:5,
		borderColor: CONST.BORDER_SHADOW_COLOR,
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingHorizontal:scale(15)
	},
	planTitleTextStyle:{
		fontFamily: CONST.fontFamily.SemiBold,
		color: CONST.BLACK_COLOR,
		fontSize: scale(15),
	},
	planAmountTextStyle:{
		fontFamily: CONST.fontFamily.Regular,
		color: CONST.BLACK_COLOR,
		fontSize: scale(13),
		lineHeight: scale(18),
	},
	subscribeButton:{
		height:scale(24),
		paddingHorizontal:scale(5), 
		borderRadius:6,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor: 'rgba(156,156,156,0.2)'
	},
	buttonText:{
		color: CONST.BLACK_COLOR,
		fontFamily: CONST.fontFamily.Bold,
		fontSize: scale(13),
		lineHeight: scale(18),
	},
	durationText:{
		marginTop:verticalScale(3),
		color: CONST.BLACK_COLOR,
		fontFamily: CONST.fontFamily.Regular,
		fontSize: scale(13),
		lineHeight: scale(18),
	},
	footerSection:{
		marginBottom:scale(10),
	},
	linkText:{
		textDecorationLine: 'underline',
	},
	footerContainer: {
		paddingHorizontal: scale(35),
	},
	modalCrossImageStyle: {
		position: 'absolute',
		right: 15,
		top: 15,
	},
	modalContainer: {
		height: scale(270),
		alignSelf: 'stretch',
		backgroundColor: CONST.WHITE_COLOR,
		borderRadius: 6,
	},
	subscriptionModalText: {
		fontSize: scale(13),
		fontFamily: CONST.Bold,
		marginTop:scale(20),
		marginHorizontal:scale(12)
	},
	emailInput: {
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: verticalScale(54),
		borderColor: '#d0d0d0',
		fontSize: scale(14),
		textAlign: 'left',
		padding: verticalScale(10),
		fontFamily: CONST.Regular,
	},
	emailContainer: {
		flexDirection: 'row' ,
		marginHorizontal:scale(12),
		marginTop:scale(8)
	},
	emailIconContainer: {
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#d0d0d0',
		justifyContent: 'center',
		alignItems: 'center',
		height: verticalScale(54),
		width: verticalScale(54),
		backgroundColor: CONST.ICON_BG,
	},
	buttonStyle: {
		height: verticalScale(54),
		backgroundColor: CONST.BLACK_COLOR,
		justifyContent: 'center',
		marginTop: verticalScale(18),
		marginHorizontal:scale(12),
	},
	buttonTextStyle: {
		color: CONST.WHITE_COLOR,
		fontSize: scale(15),
		textAlign: 'center',
		lineHeight: scale(22),
		fontFamily: CONST.Bold,
	},
	termsContainer: {
		backgroundColor: CONST.LIGHT_GREY_BG,
		borderRadius: scale(6),
		minHeight: scale(40),
		marginHorizontal: scale(10),
		marginBottom: scale(10),
	},
	termsHeaderContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: scale(40), 
		borderRadius: scale(6),
		backgroundColor: CONST.LIGHT_GREY_BG,
		paddingHorizontal: scale(10)
	},
	termsTextHeading: {
		fontFamily: CONST.fontFamily.SemiBold,
		fontSize: scale(15),
		color: CONST.BLACK_COLOR,
	},
	termsContentContainer: {
		padding: scale(10)
	},
	termsText: {
		fontFamily: CONST.fontFamily.Regular,
		fontSize: scale(13),
		color: CONST.BLACK_COLOR,
		paddingVertical: scale(5),
	},
	footerContainerTerms:{
		paddingBottom: scale(10),
	},
	indicatorStyle: {
		paddingRight: scale(3),
	}
});