import React, { useEffect } from 'react'
import { FaceDetection, LivenessDetection } from 'react-native-ehyc-sdk'
import { NavigationContainer } from '@react-navigation/native';
import { View, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();



function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title='Chứng minh nhân dân' onPress={() => navigation.push('CMNDDetectionScreen')} />
      <Button title='Căn cước công dân' onPress={() => navigation.push('CCCDDetectionScreen')} />
      <Button title='Căn cước công dân gắn chip' onPress={() => navigation.push('CCCDQRDetectionScreen')} />
      <Button title='Hộ chiếu' onPress={() => navigation.push('PassportScreen')} />
      <Button title='Liveness Detection' onPress={() => navigation.push('LivenessDetection')} />
    </View>
  );
}

function CCCDDetectionScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <FaceDetection type='cccd' token='sphinx1' />
    </View>
  );
}


function CMNDDetectionScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <FaceDetection type='cmnd' token='sphinx1' />
    </View>
  );
}
function PassportScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <FaceDetection type='passport' token='sphinx1' />
    </View>
  );
}


function CCCDQRDetectionScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <FaceDetection type='qr_cccd' token='sphinx1' />
    </View>
  );
}


function LivenessDetectionScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LivenessDetection token='sphinx1' />
    </View>
  );
}



const App = () => {


  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CMNDDetectionScreen" component={CMNDDetectionScreen} />
      <Stack.Screen name="CCCDDetectionScreen" component={CCCDDetectionScreen} />
      <Stack.Screen name="PassportScreen" component={PassportScreen} />
      <Stack.Screen name="CCCDQRDetectionScreen" component={CCCDQRDetectionScreen} />
      <Stack.Screen name="LivenessDetection" component={LivenessDetectionScreen} />
    </Stack.Navigator>
  </NavigationContainer>

}

export default App
