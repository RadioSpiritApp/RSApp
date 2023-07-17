import { StyleSheet } from 'react-native';
import scale, { verticalScale } from '../../utils/scale';
import { BLACK_COLOR, WHITE_COLOR, BORDER_COLOR_GREY, fontFamily } from '../../utils/Const';
module.exports = StyleSheet.create({
	subsContainer: {
		height: scale(55),
		backgroundColor: BLACK_COLOR,
		justifyContent: 'center',
		marginTop: verticalScale(15),
		margin: scale(10),
	},
	subsText: {
		color: WHITE_COLOR,
		fontSize: scale(16),
		textAlign: 'center',
		fontFamily: fontFamily.Bold,
	},
	modalContainer: {
		alignSelf: 'stretch',
		backgroundColor: WHITE_COLOR,
		borderRadius: 6,
	},
	modalContentText: {
		fontSize: scale(14),
		fontFamily: fontFamily.Bold,
		textAlign: 'center',
		marginTop: scale(12),
		color: BLACK_COLOR
	},
	buttonHeadingText: {
		fontSize: scale(13),
		fontFamily: fontFamily.Regular,
		textAlign: 'center',
		marginTop: scale(18),
		color: BLACK_COLOR
	},
	modalParagraphText: {
		fontSize: scale(13),
		fontFamily: fontFamily.Regular,
		textAlign: 'center',
		marginTop: scale(25),
		paddingHorizontal: scale(18),
		color:  BLACK_COLOR
	},
	scrollViewContent: {
		flexGrow: 1,
		marginTop:scale(40),
	},
	headingTextStyle: {
		fontSize: scale(22),
		fontFamily: fontFamily.Bold,
		textAlign:'center',
		color:  BLACK_COLOR,
	},
	descriptionTextStyle: {
		fontSize: scale(14.5),
		marginTop: scale(30),
		paddingHorizontal: scale(20),
		fontFamily: fontFamily.Regular,
		textAlign: 'center'
	},
	benefitContainer: {
		marginTop:scale(20),
		marginHorizontal:scale(10),
		paddingVertical:scale(15),
		paddingHorizontal:scale(10),
		borderColor: 'rgb(229,229,229)',
		borderWidth:1,
	},
	benefitContent: {
		flexDirection:'row',
		marginTop:verticalScale(5)
	},
	benefitContentText: {
		fontSize:scale(13),
		fontFamily: fontFamily.RegularItalic,
		marginLeft:scale(10),
		color: BLACK_COLOR,
	},
	premiumButton: {
		height:scale(55),
		backgroundColor: BLACK_COLOR,
		justifyContent:'center',
		alignItems:'center',
		marginTop:scale(18),
		marginHorizontal:scale(12)
	},
	premiumButtonText: {
		fontSize: scale(15),
		fontFamily: fontFamily.Bold,
		lineHeight:scale(22),
		textAlign:'center',
		color: WHITE_COLOR
	},
	dashedLine: {
		borderColor: BORDER_COLOR_GREY,
		fontSize: scale(12),
		alignSelf: 'center',
		marginTop: verticalScale(20),
		fontFamily: fontFamily.Regular,
		borderBottomWidth: 1,
		width: scale(16)
	},
	orText: {
		color: 'rgb(156, 156, 156)',
		fontSize: scale(12.5),
		lineHeight: scale(25),
		textAlign: 'center',
		marginTop: verticalScale(20),
		fontFamily: fontFamily.Regular,
		paddingHorizontal: 4,
	},
	subscriberContainer: {
		marginTop: verticalScale(14),
		flexDirection: 'row', 
		justifyContent: 'center',
	},
	subTitle: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		lineHeight: scale(18),
		textAlign: 'center',
		fontFamily: fontFamily.Regular,
	},
	rvLogin: {
		color: BLACK_COLOR,
		fontSize: scale(15),
		lineHeight: scale(25),
		textAlign: 'center',
		marginTop: verticalScale(13),
		fontFamily: fontFamily.Bold,
	},
	crossImageStyle: {
		padding:scale(10),
		position: 'absolute',
		right: 0,
		top: 0
	},
});