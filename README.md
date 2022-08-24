It's built on top of `react-native-vision-camera`, `react-native-image-crop-picker`, `react-native-image-resizer` and `react-native-fs`
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
## Using
```
import React, { useEffect } from 'react'
import { FaceDetection, LivenessDetection } from 'react-native-ehyc-sdk'
import { NavigationContainer } from '@react-navigation/native';
import { View, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();



function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title='Face Detection' onPress={() => navigation.push('FaceDetection')} />
      <View style={{ height: 40 }} />
      <Button title='Liveness Detection' onPress={() => navigation.push('LivenessDetection')} />
    </View>
  );
}

function FaceDetectionScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <FaceDetection token='38sphinx3' />
    </View>
  );
}

function LivenessDetectionScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LivenessDetection token='38sphinx3' />
    </View>
  );
}

const App = () => {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FaceDetection" component={FaceDetectionScreen} />
      <Stack.Screen name="LivenessDetection" component={LivenessDetectionScreen} />
    </Stack.Navigator>
  </NavigationContainer>

}

export default App
```
