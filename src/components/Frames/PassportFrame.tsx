import * as React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

const deviceHeight = Dimensions.get('window').height

const deviceWidth = Dimensions.get('window').width
const frameWidth = Dimensions.get('window').width * 0.8
const frameHeight = deviceHeight - 200
export const PassportFrame = () => {
  return (
    <View style={styles.frame}>
      <View style={{ height: frameHeight, width: 32 }} />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={[
              styles.borderFrame,
              {
                borderLeftWidth: 3,
                borderTopWidth: 3,
                borderTopStartRadius: 16,
              },
            ]}
          />
          <View
            style={[
              styles.borderFrame,
              {
                borderRightWidth: 3,
                borderTopWidth: 3,
                borderTopEndRadius: 16,
              },
            ]}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={[
              styles.borderFrame,
              {
                borderLeftWidth: 3,
                borderBottomWidth: 3,
                borderBottomStartRadius: 16,
              },
            ]}
          />
          <View
            style={[
              styles.borderFrame,
              {
                borderRightWidth: 3,
                borderBottomWidth: 3,
                borderBottomEndRadius: 16,
              },
            ]}
          />
        </View>
      </View>
      <View style={{ height: frameHeight, width: 32 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  borderFrame: {
    width: frameWidth / 4,
    height: frameWidth / 4,
    borderColor: 'white',
  },
  frameContainer: {
    width: deviceWidth,
    height: '100%',
    borderRadius: 50,
    zIndex: 2,
    position: 'absolute',
  },
  frame: {
    flexDirection: 'row',
    width: deviceWidth,
    height: frameHeight,
    zIndex: 3,
    position: 'absolute',
  },
})
