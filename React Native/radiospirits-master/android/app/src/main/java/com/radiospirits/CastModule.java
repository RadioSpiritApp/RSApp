package com.radiospirits;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CastModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public CastModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CastModule";
    }

    @ReactMethod
    public void castScreen() {
        try {
            getReactApplicationContext().startActivity(new Intent("android.settings.WIFI_DISPLAY_SETTINGS"));
            return;
        } catch (ActivityNotFoundException activitynotfoundexception) {
            activitynotfoundexception.printStackTrace();
        } catch (Exception castSupportNotFoundException) {
            castSupportNotFoundException.printStackTrace();
            Toast.makeText(getReactApplicationContext(), "Device not supported", Toast.LENGTH_LONG).show();
        }
        try {
            getReactApplicationContext().startActivity(new Intent("android.settings.CAST_SETTINGS"));
            return;
        } catch (Exception exception1) {
            Toast.makeText(getReactApplicationContext(), "Device not supported", Toast.LENGTH_LONG).show();
        }
    }
}
