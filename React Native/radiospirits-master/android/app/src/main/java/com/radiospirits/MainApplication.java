package com.radiospirits;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.guichaguri.trackplayer.TrackPlayer;
import io.invertase.firebase.RNFirebasePackage;
import com.ninty.system.setting.SystemSettingPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFirebasePackage(),
            new SystemSettingPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNFetchBlobPackage(),
              new TrackPlayer(),
            new RNIapPackage(),
            new ImagePickerPackage(),
            new RNDeviceInfo(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new OrientationPackage(),
            new CastPackager(),
            new RNFirebaseAnalyticsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
