import * as React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native'

const screenWidth = Dimensions.get('window').width
const frameWidth = screenWidth - 32
const frameHeight = (frameWidth * 85.6) / 52.98
const borderWidth = 3
const borderRadius = 8

export const CardFrame = (props: { cameraHeight: number }) => {
  const height =
    props.cameraHeight > frameHeight
      ? frameHeight - 32
      : props.cameraHeight - 32
  return (
    <View style={styles.frame}>
      <View style={{ height: height, width: 16 }} />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={[styles.borderFrame, styles.borderTopLeft]}>
            <Image
              style={styles.iconUser}
              source={require('../../../assets/icons-user.png')}
              resizeMode='contain'
            />
          </View>
          <View style={[styles.borderFrame, styles.borderTopRight]} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={[styles.borderFrame, styles.borderBottomLeft]} />
          <View style={[styles.borderFrame, styles.borderBottomRight]} />
        </View>
      </View>
      <View style={{ height: height, width: 16 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  frame: {
    flexDirection: 'row',
    width: screenWidth,
    position: 'absolute',
    zIndex: 3,
  },
  borderFrame: {
    width: frameWidth / 4,
    height: frameWidth / 4,
    borderColor: 'white',
  },
  borderTopRight: {
    borderRightWidth: borderWidth,
    borderTopWidth: borderWidth,
    borderTopEndRadius: borderRadius,
  },
  borderTopLeft: {
    borderLeftWidth: borderWidth,
    borderTopWidth: borderWidth,
    borderTopStartRadius: borderRadius,
  },
  borderBottomRight: {
    borderRightWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderBottomEndRadius: borderRadius,
  },
  iconUser: {
    position: 'absolute',
    top: 8,
    left: frameWidth / 4 - 30,
    height: frameWidth / 2,
    width: frameWidth / 2,
    tintColor: 'white',
    transform: [{ rotate: '90deg' }],
  },
  borderBottomLeft: {
    borderLeftWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderBottomStartRadius: borderRadius,
  },
  containerButton: {
    width: screenWidth,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  frameContainer: {
    width: screenWidth,
    height: '100%',
    zIndex: 2,
    position: 'absolute',
  },
})
