It's built on top of `react-native-vision-camera`, `react-native-image-crop-picker` and `react-native-fs`
it takes an image component and upon click, you get the image picker prompt, get the base64 string of the image and the image source changes to whatever image was picked.

## Installing
```
npm install react-native-ehyc-sdk
```
## Automatic Installation

* Add the required permissions in `AndroidManifest.xml`:
```xml
 <uses-permission android:name="android.permission.CAMERA" />
 <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### IOS
For iOS 11+, Add the `NSPhotoLibraryUsageDescription`, `NSCameraUsageDescription`, and `NSMicrophoneUsageDescription` (if allowing video) keys to your `Info.plist` with strings describing why your app needs these permissions. **Note: You will get a SIGABRT crash if you don't complete this step**
```
<plist version="1.0">
  <dict>
    ...
    <key>NSPhotoLibraryUsageDescription</key>
    <string>YOUR_REASON_FOR_USING_USER_PHOTOS_HERE</string>
    <key>NSCameraUsageDescription</key>
    <string>YOUR_REASON_FOR_USING_USER_CAMERA_HERE</string>
  </dict>
</plist>
```
