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
