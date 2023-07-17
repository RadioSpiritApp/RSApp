//Screen Constatnts
export const SCREEN_HEIGHT = 667;
export const SCREEN_WIDTH = 375;

//Color Constants
export const WHITE_COLOR = '#FFFFFF';
export const BLACK_COLOR = '#000000';
export const GREY_COLOR = '#626262';
export const STATUS_BAR_BACKGROUND_COLOR = '#FFFFFF';
export const ACTIVE_TAB_COLOR = '#457ced';
export const TITLEBAR_BACKGROUND_COLOR = 'rgb(253,249,249)';
export const BORDER_COLOR_GREY = 'rgb(208,208,208)';
export const BORDER_COLOR_GREY_LIGHT = 'rgb(221,221,221)';
export const BORDER_SHADOW_COLOR = 'rgba(0,0,0,0.03)';
export const BLUE_COLOR_COLLAPSE = 'rgb(69,124,237)';
export const ICON_BG = 'rgb(253, 249, 249)';
export const LIGHT_GREY_BG = 'rgb(235, 235, 235)';

//Font Weight Constants
export const fontWeight = {
	Thin: '100',
	UltraLight: '200',
	Light: '300',
	Regular: '400',
	Medium: '500',
	Semibold: '600',
	Bold: '700',
	Heavy: '800',
	Black: '900'
};

//Font Family constants 
export const fontFamily = {
	Regular: 'Raleway-Regular',
	Medium: 'Raleway-Medium',
	SemiBold: 'Raleway-SemiBold',
	Light: 'Raleway-Light',
	Bold: 'Raleway-Bold',
	MediumItalic: 'Raleway-MediumItalic',
	RegularItalic: 'Raleway-Italic',
	Black: 'Raleway-Black',
};

//Message Constants
export const NO_SERIES_AVAILABLE = 'No Series Available';
export const NO_EPISODES_AVAILABLE = 'No Episodes Available';
export const NO_GENRES_AVAILABLE = 'No Genres Available';
export const NO_INTERNET_CONNECTION = 'No Internet Connection';
export const TOKEN_EXPIRED_MESSAGE = 'Session expired, please login to continue';
export const SUSPEND_USER_MESSAGE = 'Your account is currently suspended. Please contact Radio Spirits team';

//Saga Constants 
export const SOCIAL_LOGIN = 'SOCIAL_LOGIN';
export const CREATE_DEVICE = 'CREATE_DEVICE';
export const REFERENCE_ID = 'REFERENCE_ID';
export const USER_SIGNUP = 'USER_SIGNUP';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const RV_USER_LOGIN = 'RV_USER_LOGIN';
export const GET_HOMEPAGE_DATA = 'GET_HOMEPAGE_DATA';
export const GET_BROWSE_DATA = 'GET_BROWSE_DATA';
export const GET_GENRE_BROWSE_DATA = 'GET_GENRE_BROWSE_DATA';
export const GET_EPISODE_DATA = 'GET_EPISODE_DATA';
export const GET_GENRE_DATA = 'GET_GENRE_DATA';
export const EMAIL_VERIFIED = 'EMAIL_VERIFIED';
export const SEARCH_SERIES = 'SEARCH_SERIES';
export const SEARCH_EPISODE = 'SEARCH_EPISODE';
export const GET_IAP_PRODUCTS = 'GET_IAP_PRODUCTS';
export const POST_IAP_STATUS = 'POST_IAP_STATUS';
export const CONFIGURABLE_TEXT = 'CONFIGURABLE_TEXT';
export const GET_ADVERTISEMENT = 'GET_ADVERTISEMENT';
export const GET_WHEN_RADIO_WAS_EPISODE_DATA = 'GET_WHEN_RADIO_WAS_EPISODE_DATA';
export const SEARCH_WHEN_RADIO_WAS_EPISODE = 'SEARCH_WHEN_RADIO_WAS_EPISODE';
export const DOWNLOAD_EPISODE = 'DOWNLOAD_EPISODE';
export const DOWNLOAD_EPISODE_SUCCESS = 'DOWNLOAD_EPISODE_SUCCESS';
export const DOWNLOAD_EPISODE_FAILED = 'DOWNLOAD_EPISODE_FAILED';
export const DELETE_DOWNLOADED_EPISODE = 'DELETE_DOWNLOADED_EPISODE';
export const UPDATE_DOWNLOAD_LIST = 'UPDATE_DOWNLOAD_LIST';
export const CLEAR_DOWNLOAD_LIST = 'CLEAR_DOWNLOAD_LIST';
export const POST_SEEK_TIME = 'POST_SEEK_TIME';
export const GET_RECENT_EPISODE = 'GET_RECENT_EPISODE';
export const UPDATE_STREAM_COUNT = 'UPDATE_STREAM_COUNT';

//Reducers Constants 
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';

export const START_SPINNER = 'START_SPINNER';
export const STOP_SPINNER = 'STOP_SPINNER';

export const SHOW_PREMIUM_MODAL = 'SHOW_PREMIUM_MODAL';
export const HIDE_PREMIUM_MODAL = 'HIDE_PREMIUM_MODAL';

export const PLAYER_TYPE = 'PLAYER_TYPE';
export const INTERNET_STATUS = 'INTERNET_STATUS';

export const RESET_LOGOUT = 'RESET_LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export const CREATE_DEVICE_SUCCESS = 'CREATE_DEVICE_SUCCESS';
export const CREATE_DEVICE_FAILED = 'CREATE_DEVICE_FAILED';

export const REFERENCE_ID_SUCCESS = 'REFERENCE_ID_SUCCESS';
export const REFERENCE_ID_FAILED = 'REFERENCE_ID_FAILED';

export const USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS';
export const USER_SIGNUP_FAILED = 'USER_SIGNUP_FAILED';

export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED';

export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_FAILED = 'USER_LOGOUT_FAILED';

export const GET_HOMEPAGE_DATA_SUCCESS = 'GET_HOMEPAGE_DATA_SUCCESS';
export const GET_HOMEPAGE_DATA_FAILED = 'GET_HOMEPAGE_DATA_FAILED';

export const GET_BROWSE_DATA_SUCCESS = 'GET_BROWSE_DATA_SUCCESS';
export const GET_BROWSE_DATA_FAILED = 'GET_BROWSE_DATA_FAILED';

export const GET_GENRE_BROWSE_DATA_SUCCESS = 'GET_GENRE_BROWSE_DATA_SUCCESS';
export const GET_GENRE_BROWSE_DATA_FAILED = 'GET_GENRE_BROWSE_DATA_FAILED';

export const GET_EPISODE_DATA_SUCCESS = 'GET_EPISODE_DATA_SUCCESS';
export const GET_EPISODE_DATA_FAILED = 'GET_EPISODE_DATA_FAILED';

export const GET_GENRE_DATA_SUCCESS = 'GET_GENRE_DATA_SUCCESS';
export const GET_GENRE_DATA_FAILED = 'GET_GENRE_DATA_FAILED';

export const EMAIL_VERIFIED_SUCCESS = 'EMAIL_VERIFIED_SUCCESS';
export const EMAIL_VERIFIED_FAILED = 'EMAIL_VERIFIED_FAILED';

export const RESET_SEARCH_SERIES = 'RESET_SEARCH_SERIES';
export const SEARCH_SERIES_SUCCESS = 'SEARCH_SERIES_SUCCESS';
export const SEARCH_SERIES_FAILED = 'SEARCH_SERIES_FAILED';

export const RESET_EPISODE_SERIES = 'RESET_EPISODE_SERIES';
export const RESET_BROWSE_DATA = 'RESET_BROWSE_DATA';
export const RESET_GENRE_BROWSE_DATA = 'RESET_GENRE_BROWSE_DATA';
export const RESET_EPISODE_DATA = 'RESET_EPISODE_DATA';
export const SEARCH_EPISODE_SUCCESS = 'SEARCH_EPISODE_SUCCESS';
export const SEARCH_EPISODE_FAILED = 'SEARCH_EPISODE_FAILED';

export const RESET_SEARCH_WHEN_RADIO_WAS_EPISODE = 'RESET_SEARCH_WHEN_RADIO_WAS_EPISODE';
export const SEARCH_WHEN_RADIO_WAS_EPISODE_SUCCESS = 'SEARCH_WHEN_RADIO_WAS_EPISODE_SUCCESS';
export const SEARCH_WHEN_RADIO_WAS_EPISODE_FAILED = 'SEARCH_WHEN_RADIO_WAS_EPISODE_FAILED';

export const RESTORE_USER_SUCCESS = 'RESTORE_USER_SUCCESS';

export const GET_IAP_PRODUCTS_SUCCESS = 'GET_IAP_PRODUCTS_SUCCESS';
export const GET_IAP_PRODUCTS_FAILED = 'GET_IAP_PRODUCTS_FAILED';

export const POST_IAP_STATUS_SUCCESS = 'POST_IAP_STATUS_SUCCESS';
export const POST_IAP_STATUS_FAILED = 'POST_IAP_STATUS_FAILED';

export const RESET_WHEN_RADIO_WAS_EPISODE_DATA = 'RESET_WHEN_RADIO_WAS_EPISODE_DATA';
export const GET_WHEN_RADIO_WAS_SUCCESS = 'GET_WHEN_RADIO_WAS_SUCCESS';
export const GET_WHEN_RADIO_WAS_FAILED = 'GET_WHEN_RADIO_WAS_FAILED';

export const CONFIGURABLE_TEXT_SUCCESS = 'CONFIGURABLE_TEXT_SUCCESS';
export const CONFIGURABLE_TEXT_FAILED = 'CONFIGURABLE_TEXT_FAILED';

export const GET_ADVERTISEMENT_SUCCESS = 'GET_ADVERTISEMENT_SUCCESS';
export const GET_ADVERTISEMENT_FAILED = 'GET_ADVERTISEMENT_FAILED';

export const PLAYER_STATE = 'PLAYER_STATE';
export const PREMIUM_PLAYER_STATE = 'PREMIUM_PLAYER_STATE';

export const PLAY_ALL_EPISODE = 'PLAY_ALL_EPISODE';
export const UPDATE_CURRENT_AUDIO = 'UPDATE_CURRENT_AUDIO';
export const PLAY_ALL_EPISODE_FAILED = 'PLAY_ALL_EPISODE_FAILED';
export const UPDATE_RESET_ENABLE = 'UPDATE_RESET_ENABLE';

export const GET_FREE_PLAYER_DATA = 'GET_FREE_PLAYER_DATA';
export const GET_FREE_PLAYER_DATA_SUCCESS = 'GET_FREE_PLAYER_DATA_SUCCESS';
export const GET_FREE_PLAYER_DATA_FAILED = 'GET_FREE_PLAYER_DATA_FAILED';

export const EMPTY_FREE_PLAYER_LIST = 'EMPTY_FREE_PLAYER_LIST';
export const UPDATE_FREE_PLAYER_VOLUME = 'UPDATE_FREE_PLAYER_VOLUME';
export const UPDATE_FREE_PLAYER_SEEK_BAR = 'UPDATE_FREE_PLAYER_SEEK_BAR';

export const CHANGE_PLAYER_STATE = 'CHANGE_PLAYER_STATE';
export const UPDATE_PLAYER_AUDIO_LIST = 'UPDATE_PLAYER_AUDIO_LIST';
export const EMPTY_PLAYER_LIST = 'EMPTY_PLAYER_LIST';
export const UPDATE_PLAYER_VOLUME = 'UPDATE_PLAYER_VOLUME';
export const EMPTY_PLAYER_STATUS = 'EMPTY_PLAYER_STATUS';
export const PLAYER_AUDIO_DATA_FAILURE = 'PLAYER_AUDIO_DATA_FAILURE';
export const CHANGE_PLAY_FROM_DOWNLOAD_STATE = 'CHANGE_PLAY_FROM_DOWNLOAD_STATE';

export const GET_PREMIUM_PLAYER_DATA = 'GET_PREMIUM_PLAYER_DATA';
export const GET_PREMIUM_PLAYER_DATA_SUCCESS = 'GET_PREMIUM_PLAYER_DATA_SUCCESS';
export const GET_PREMIUM_PLAYER_DATA_FAILED = 'GET_PREMIUM_PLAYER_DATA_FAILED';

export const RESET_RECENT_EPISODE = 'RESET_RECENT_EPISODE';
export const GET_RECENT_EPISODE_SUCCESS = 'GET_RECENT_EPISODE_SUCCESS';
export const GET_RECENT_EPISODE_FAILED = 'GET_RECENT_EPISODE_FAILED';

export const POST_SEEK_TIME_SUCCESS = 'POST_SEEK_TIME_SUCCESS';
export const POST_SEEK_TIME_FAILED = 'POST_SEEK_TIME_FAILED';

export const FREE_EPISODE_LIST = 'FREE_EPISODE_LIST';
export const RE_RENDER_BROWSE_TAB = 'RE_RENDER_BROWSE_TAB';
export const TOGGLE_BUFFER_STATE = 'TOGGLE_BUFFER_STATE';

export const DATE_CHECK_STATUS_UPDATE = 'DATE_CHECK_STATUS_UPDATE';

//Async Storage
export const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
export const USER_OBJECT = 'USER_OBJECT';
export const TODAY_DATE = 'TODAY_DATE';

//Validation constants
export const EMAIL_VALIDATION = 'Please enter a valid email address';
export const PASSWORD_VALIDATION = 'Please enter a valid password';
export const PURCHASE = 'Purchase';
export const RESTORE = 'Restore';

//Messages
export const GENRE_MSG_TITLE = 'Choose GENRE from one of the links below. Then click on the specific Series that you are interested in to view all shows available in that series.';
export const APPLESTORE_TEXT = 'App Store';
export const PLAYSTORE_TEXT = 'Play Store';

//image constants
export const HOME_INACTIVE = require('@assets/bottomtab/homeIcon.png');
export const HOME_ACTIVE = require('@assets/bottomtab/activehomeIcon.png');
export const BROWSE_INACTIVE = require('@assets/bottomtab/searchIcon.png');
export const BROWSE_ACTIVE = require('@assets/bottomtab/activesearchIcon.png');
export const MY_LIBRARY_INACTIVE= require('@assets/bottomtab/libraryIcon.png');
export const MY_LIBRARY_ACTIVE = require('@assets/bottomtab/activelibraryIcon.png');
export const BONUS_INACTIVE = require('@assets/bottomtab/bonusIcon.png');
export const BONUS_ACTIVE = require('@assets/bottomtab/activebonusIcon.png');
export const SETTINGS_INACTIVE = require('@assets/bottomtab/settingsIcon.png');
export const SETTINGS_ACTIVE = require('@assets/bottomtab/activesettingsIcon.png');
export const LOGO_IMG = require('@assets/common/rsLogo.png');
export const TICK_ICON = require('@assets/common/tickIcon.png');
export const BACK_ICON = require('@assets/common/backIcon.png');
export const UP_ARROW = require('@assets/common/uparrow.png');
export const DOWN_ARROW = require('@assets/common/downarrow.png');
export const SERIES_PLACEHOLDER = require('@assets/common/seriesPlaceholder.png');
export const EPISODE_PLACEHOLDER = require('@assets/common/episodePlaceholder.png');
export const GENRE_PLACEHOLDER = require('@assets/common/genrePlaceholder.png');
export const SUBSCRIPTION_ICON = require('@assets/common/radioSpiritIcon.png');
export const PREMIUM_PLAN_ICON = require('@assets/settings/viewPremiumPlansIcon.png');
export const LOGIN_IMAGE = require('@assets/settings/signupIcon.png');
export const RE_SUBSCRIPTION_ICON = require('@assets/settings/restoreSubscriptionIcon.png');
export const LOGIN_ICON = require('@assets/settings/loginIcon.png');
export const LOGOUT_ICON = require('@assets/settings/logoutIcon.png');
export const FAQS_ICON = require('@assets/settings/FAQsIcon.png');
export const EDIT_ICON = require('@assets/settings/editIcon.png');
export const SEARCH_ICON = require('@assets/searchIcon/searchIcon.png');
export const SOURCE = require('@assets/splash/splashScreenBg.png');
export const SPLASH_SCREEN = require('@assets/splash/splashScreen.png');
export const DOWNLOAD_IMAGE = require('@assets/downloads/downloadIcon.png');
export const DOWNLOADED_IMAGE = require('@assets/downloads/downloadedIcon.png');
export const TOP_IMAGE = require('@assets/popupBg/popupBg.png');
export const CROSS_IMAGE = require('@assets/popupBg/crossIcon.png');
export const EMAIL_ICON = require('@assets/signup/emailIcon.png');
export const PASSWORD_ICON = require('@assets/signup/passwordIcon.png');
export const CROSS_ICON = require('@assets/signup/crossIcon.png');
export const VERIFY_EMAIL_ICON = require('@assets/verifyEmail/verifyEmailIcon.png');
export const CIRCLE_ICON = require('@assets/Player/circle.png');
export const MINIMIZE_ICON = require('@assets/Player/downArrow.png');
export const MORE_ICON = require('@assets/Player/moreIcon.png');
export const PLAY_ICON = require('@assets/Player/playIcon.png');
export const PAUSE_ICON = require('@assets/Player/pauseIcon.png');
export const AIR_PLAY = require('@assets/Player/airPlayIcon.png');
export const SOUND_ICON = require('@assets/Player/soundIcon.png');
export const SOUND_ICON2 = require('@assets/Player/soundIcon2.png');
export const SOUND_ICON3 = require('@assets/Player/soundIcon3.png');
export const PLAY_ALL_ICON = require('@assets/Player/playAllIcon.png');
export const NEXT_ICON = require('@assets/Player/next.png');
export const PREV_ICON = require('@assets/Player/prev.png');
export const DOWNLOAD_SHOW_ICON = require('@assets/downloads/downloadShowIcon.png');
export const HAND_ICON = require('@assets/handIcon/handIcon.png');
export const DROPDOWN_ICON= require('@assets/dropdownArrow/dropdownArrow.png');
export const HOME_LOGO= require('@assets/homeLogo/homeLogo.png');

// Screen constants
export const BONUS = 'BONUS';
export const FAQS = 'FAQ';
export const TERMS_OF_SERVICES = 'TERMS OF SERVICES';
export const PRIVACY_POLICY = 'PRIVACY POLICY';
export const RV_FORGOT_PASSWORD = 'RV Forgot Password';

// Screen uri constants
export const BONUS_URI = 'https://www.radiospirits.com/app/bonus/';
export const FAQS_URI = 'https://www.radiospirits.com/app/faq/';
export const TERMS_OF_SERVICES_URI = 'https://www.radiospirits.com/app/tos/';
export const PRIVACY_POLICY_URI = 'https://www.radiospirits.com/app/privacy/';
export const RV_FORGOT_PASSWORD_URI = 'https://www.radiovault.com/app/forgotpw/';

// String constants
export const WHEN_RADIO_WAS_TITLE = 'When Radio Was';
export const RECENTLY_ADDED_TITLE = 'Recently Added';
export const CONTINUE_LISTENING_TITLE = 'Continue Listening';
export const MORE_OF_TITLE = 'More Of...';
export const FEATURED_TITLE = 'Featured';
export const POPULAR_TITLE = 'Popular';
export const FREE_PLAYER = 'FREE_PLAYER';
export const PREMIUM_PLAYER = 'PREMIUM_PLAYER';

//Google Analytics
export const SIGN_UP_SCREEN = 'SIGN UP SCREEN';
export const RV_LOGIN_SCREEN = 'RV LOGIN SCREEN';
export const HOME_TAB_SCREEN = 'HOME TAB SCREEN';
export const BROWSE_TAB_SCREEN = 'BROWSE TAB SCREEN';
export const MY_LIBRARY_TAB_SCREEN = 'MY LIBRARY TAB SCREEN';
export const BONUS_TAB_SCREEN = 'BONUS TAB SCREEN';
export const SETTINGS_TAB_SCREEN = 'SETTINGS TAB SCREEN';
export const SUBSCRIPTION_SCREEN = 'SUBSCRIPTION SCREEN';
export const EMAIL_VALIDATOR_SCREEN = 'EMAIL VALIDATOR SCREEN';
export const MINI_PLAYER_SCREEN = 'MINI PLAYER SCREEN';
export const FREE_PLAYER_SCREEN = 'FREE PLAYER SCREEN';
export const PAID_PLAYER_SCREEN = 'PAID PLAYER SCREEN';
export const SEARCH_SCREEN = 'SEARCH SCREEN';

//Events
export const SCREEN_VIEW = 'SCREEN_VIEW';

// Array Constant
export const RECENTLY_PLAYED_OPTION = ['Series Name', 'Episode Name', 'Air Date'];
export const LOGOUT_OBJECT = { success: true, message: 'Signed out successfully'};

// Cancel Subscription url
export const CANCEL_SUBSCRIPTION_URL_IOS = 'itms-apps://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions';
export const CANCEL_SUBSCRIPTION_URL_ANDROID = 'https://play.google.com/store/account/subscriptions';
