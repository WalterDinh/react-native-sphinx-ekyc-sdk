import * as React from 'react'
import {
  Dimensions,
  TextStyle,
  StyleProp,
  ImageStyle,
  StyleSheet,
  View,
  ViewStyle,
  FlatList,
  Animated,
  Button,
} from 'react-native'
import { setToken } from '../api/serviceHandle'

import { Step1 } from './components/step1'
import { Step2 } from './components/step2'

export interface FaceDetectionScreenProps {
  containerStyle?: StyleProp<any>
  token: string
  textButtonStyle?: TextStyle
  textTitleStyle?: TextStyle
  textSubStyle?: TextStyle
  cardStyle?: ImageStyle
  portraitStyle?: ImageStyle
  buttonStyle?: ViewStyle
  cardTitle?: string
  portraitTitle?: string
  portraitSubTitle?: string
  cardSubTitle?: string
  type: 'cmnd' | 'cccd' | 'passport' | 'qr_cccd'
  onSuccess?: (data: any) => void
}

export interface Info {
  address: string
  birthday?: any
  gender?: any
  id?: any
  license_date?: any
  name: string
  old_id?: any
  origin_address: string
}

export interface LivenessStatus {
  check_speed: number
  score: number
  status: string
}

export interface FaceDetectionInfo {
  code: number
  imageId: string
  score: number
}

const listStep = [1, 2, 3]
const padding = 24

const screenWidth = Dimensions.get('window').width

export const FaceDetection: React.FC<FaceDetectionScreenProps> = (props) => {
  const { token, type, onSuccess } = props
  const interestRef = React.useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [info, setDataInfo] = React.useState<FaceDetectionInfo>()
  React.useEffect(() => {
    setToken(token)
  }, [])
  const onHandleSuccess = (data?: FaceDetectionInfo) => {
    if (interestRef.current && !!data) {
      setDataInfo(data)
      interestRef?.current.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      })
    }
  }

  const renderItem = (item: number) => {
    switch (item) {
      case 1:
        return <Step1 {...props} onSuccess={onHandleSuccess} />
      case 2:
        return <Step2 onSuccess={onSuccess} type={type} data={info} />
      default:
        return <View />
    }
  }

  const onItemChange = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset
    const viewSize = e.nativeEvent.layoutMeasurement
    const newCurrentIndex = Math.round(contentOffset.x / viewSize.width)
    setCurrentIndex(newCurrentIndex)
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        nestedScrollEnabled
        ref={interestRef}
        data={listStep}
        renderItem={({ item, index }: any) => renderItem(item)}
        keyExtractor={(item: any, index: any) => index.toString()}
        horizontal
        pagingEnabled
        snapToInterval={screenWidth}
        scrollEventThrottle={16}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onItemChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
  boxImage: {
    paddingHorizontal: padding,
    marginVertical: 8,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    color: '#ffff',
    alignSelf: 'center',
  },
  textDisableButton: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    color: '#000',
    alignSelf: 'center',
  },
  textSubTitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    padding: 16,
    backgroundColor: '#000',
    marginHorizontal: padding,
    borderRadius: 8,
    marginVertical: 32,
  },
  disableButton: {
    padding: 16,
    backgroundColor: '#ffff',
    marginHorizontal: padding,
    borderRadius: 8,
    marginVertical: 32,
    borderColor: '#000',
    borderWidth: 2,
  },
  modalView: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  textModal: {
    fontSize: 16,
  },
  boxButton: {
    backgroundColor: '#fff',
    padding: 40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textButtonModal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageLoading: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  boxImageLoading: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
