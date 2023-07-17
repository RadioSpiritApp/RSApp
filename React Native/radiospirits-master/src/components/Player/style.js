import { StyleSheet, Platform } from 'react-native';
import * as CONST from '../../utils/Const';
import scale,{verticalScale} from '../../utils/scale';

module.exports = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: CONST.WHITE_COLOR,
	},
	headerContainer: {
		backgroundColor: 'white',
		alignItems:'center',
		justifyContent: 'center',
		marginTop: Platform.OS == 'ios' ? scale(40) : scale(20),
	},
	playerBodyContainer: {
		marginTop:scale(36),
	},
	playerArtworkContainer: {
		height: scale(214),
		backgroundColor: CONST.BLACK_COLOR,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: scale(40),
		marginHorizontal: scale(81),
		borderRadius: scale(5),
	},
	playerControlContainer: {
		marginTop: scale(40)
	},
	playerTabImage:{
		height: scale(214),
		width: scale(214),
	},
	episodeInitials:{
		fontSize: scale(53.5),
		color: CONST.WHITE_COLOR,
		fontFamily: CONST.fontFamily.SemiBold,
	},
	playerSeekBarContainer: {
		marginTop: scale(40),
		marginHorizontal: Platform.OS == 'ios' ? scale(18) : scale(8),
	},
	playerFooterContainer: {
		height: scale(60),
		flexDirection: 'row',
		justifyContent:'space-between',
		marginHorizontal:scale(14)
	},
	artwork: {
		height: scale(210),
		width: scale(210),
		backgroundColor: 'purple',
		borderRadius: 4
	},
	genreName: {
		fontFamily: CONST.fontFamily.SemiBold,
		fontSize: scale(22),
		textAlign: 'center',
		color: CONST.BLACK_COLOR,
	},
	episodeName: {
		fontFamily: 'Raleway-Regular',
		fontSize: scale(13),
		textAlign: 'center',
		color: CONST.GREY_COLOR,
		margin: scale(1),
	},
	displayDate: {
		fontFamily: 'Raleway-Regular',
		fontSize: scale(13),
		textAlign: 'center',
		color: '#000000',
		margin: scale(1)
	},
	playTime: {
		fontFamily: 'Raleway-SemiBold',
		fontSize: scale(13),
		textAlign: 'center',
		color: '#000000',
	},
	dismissButton: {
		height: scale(40),
		width: scale(40),
		alignItems: 'center',
		justifyContent: 'center',
	},
	airplayButton: {
		height: scale(40),
		alignItems: 'center',
		justifyContent: 'center'
	},
	// Options modal style.  
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
	progress: {
		height: 2,
		width: '100%',
		flexDirection: 'row',
	},
	timeDuration: { 
		flexDirection: 'row',
		justifyContent:'space-between',
		marginHorizontal:scale(20),
		marginTop: Platform.OS == 'ios' ? scale(-15) : 0,
	},
	airPlayView: {
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bufferStateIndicator: {
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'center' 
	}
});