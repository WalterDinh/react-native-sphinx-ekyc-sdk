import * as React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

const screenWidth = Dimensions.get('window').width
const frameWidth = screenWidth * 0.9
const frameHeight = frameWidth
const borderWidth = 3
const borderRadius = 30

export const PortalFrame = () => {
  return (
    <View style={styles.frame}>
      <View style={{ height: frameHeight, width: '15%' }} />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.row}>
          <View style={[styles.borderFrame, styles.borderTopLeft]}></View>
          <View style={[styles.borderFrame, styles.borderTopRight]} />
        </View>

        <View style={styles.row}>
          <View style={[styles.borderFrame, styles.borderBottomLeft]} />
          <View style={[styles.borderFrame, styles.borderBottomRight]} />
        </View>
      </View>
      <View style={{ height: frameHeight, width: '15%' }} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frame: {
    flexDirection: 'row',
    width: screenWidth,
    position: 'absolute',
    zIndex: 3,
  },
  borderFrame: {
    width: frameHeight / 4,
    height: frameHeight / 4,
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
