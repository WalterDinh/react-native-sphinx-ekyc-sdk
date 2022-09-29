import * as React from 'react'
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import RNFS from 'react-native-fs'
import { apiPost } from '../../api/serviceHandle'
import { TakeCardPhoto } from './takeCardPhoto'
import { Camera } from 'react-native-vision-camera'
import { FaceDetectionScreenProps } from '../face_detection'
import { onUploadImage } from '../../helper/api'
import Spinner from 'react-native-loading-spinner-overlay'

const deviceWidth = Dimensions.get('window').width

const padding = 24
const width = deviceWidth - padding * 2
export const Step1: React.FC<FaceDetectionScreenProps> = (props) => {
  const { textSubStyle, textTitleStyle, type, onSuccess } = props
  const [showModal, setShowModal] = React.useState<
    null | 'cardID' | 'portrait' | 'loading' | 'camera'
  >(null)
  const [cardUri, setCardUri] = React.useState<null | {
    base64: string
    uri: string
    image: any
  }>(null)
  const [portraitUri, setPortraitUri] = React.useState<null | {
    base64: string
    uri: string
    image: any
  }>(null)
  const [loading, setLoading] = React.useState(false)
  const interestRef = React.useRef<ScrollView>(null)
  const imageSelfieRef = React.useRef<string | null>(null)
  const imageCardRef = React.useRef<string | null>(null)
  const heightCard = 300
  const [currentIndex, setCurrentIndex] = React.useState(0)
  React.useEffect(() => {
    ;(async () => {
      await Camera.requestCameraPermission()
    })()
  }, [])

  const openCamera = (type: 'cardID' | 'portrait') => {
    setShowModal(type)
  }

  const onNext = () => {
    if (interestRef.current) {
      interestRef?.current.scrollTo({ animated: true, x: deviceWidth })
      setCurrentIndex(currentIndex + 1)
    }
  }

  const onTakeCardPhoto = async (image: any) => {
    const base64Data = await RNFS.readFile(image.path, 'base64')
    const data = `data:jpeg;base64,${base64Data}`
    if (showModal === 'cardID') {
      setCardUri({ base64: base64Data, uri: data, image: image })
      setShowModal(null)
      return
    }
    if (showModal === 'portrait') {
      setPortraitUri({ base64: base64Data, uri: data, image: image })
      setShowModal(null)
    }
  }

  const onCloseModal = React.useCallback(
    (isError: boolean = false, errorMessage?: string) => {
      setShowModal(null)
      if (isError) {
        setPortraitUri(null)
        setCardUri(null)
        setCurrentIndex(0)
        Alert.alert('Thông báo', errorMessage ?? 'Đã có lỗi xảy ra')
        if (interestRef.current) {
          interestRef?.current.scrollTo({ animated: true, x: 0 })
        }
      }
    },
    []
  )

  const onDetectFontCard = async () => {
    try {
      setLoading(true)
      const id = await onUploadImage(type, cardUri?.image)
      if (!!id) {
        const response = await apiPost('ekyc/compare', {
          card_id: id,
          face_id: imageSelfieRef.current,
          card_type: type,
        })
        if (response.response.code == 1000) {
          response.response.imageId = id
          !!onSuccess && onSuccess(response.response)
        } else {
          Alert.alert('Thông báo', 'Đã có lỗi xảy ra')
        }
      }
    } catch (error) {
      Alert.alert('Thông báo', 'Đã có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const onLivenessFace = async (id: string) => {
    try {
      const response = await apiPost('ekyc/liveness', { image_id: id })
      if (response.response.code == 1000) {
        imageSelfieRef.current = id
        onNext()
      } else {
        Alert.alert('Thông báo', 'Xác định không phải mặt thật. Hãy thử lại')
      }
    } catch (error) {
      Alert.alert('Thông báo', 'Đã có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const onFaceAnalysis = async () => {
    try {
      setLoading(true)
      const id = (await onUploadImage('selfie', portraitUri?.image)) as string
      if (typeof id != 'string') {
        setLoading(false)
        return
      }
      const response = await apiPost('ekyc/analyze', { image_id: id })
      if (response.response.code == 1000) {
        onLivenessFace(id)
      } else {
        setLoading(false)
        Alert.alert('Thông báo', 'Lỗi không xác định được khuôn mặt ')
        return
      }
    } catch (error) {
      setLoading(false)
      Alert.alert('Thông báo', 'Đã có lỗi xảy ra')
    }
  }

  const renderSelectCardId = () => {
    const isDisableButton = cardUri === null
    return (
      <View style={styles.container}>
        <View style={styles.boxImage}>
          <Text style={[styles.textTitle, textTitleStyle]}>
            Ảnh chụp chứng minh thư/căn cước công dân
          </Text>
          <Text style={[styles.textSubTitle, textSubStyle]}>
            Ảnh hợp lệ là ảnh chụp rõ nét, không loá, không bị mất góc
          </Text>
          <TouchableOpacity onPress={() => openCamera('cardID')}>
            {cardUri ? (
              <Image
                fadeDuration={500}
                resizeMode={'contain'}
                style={{
                  width: width,
                  height: heightCard,
                  transform:
                    type === 'passport' ? undefined : [{ rotate: '-90deg' }],
                }}
                source={{ uri: cardUri.uri }}
              />
            ) : (
              <Image
                fadeDuration={500}
                resizeMode={type === 'passport' ? 'contain' : 'cover'}
                style={{ width: width, height: heightCard, borderRadius: 8 }}
                source={require('../../../assets/default.png')}
              />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onDetectFontCard}
          disabled={isDisableButton}
          style={isDisableButton ? styles.disableButton : styles.button}
        >
          <Text
            style={
              isDisableButton ? styles.textDisableButton : styles.textButton
            }
          >
            Tiếp tục
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderSelectSelfieImage = () => {
    const isDisableButton = portraitUri === null
    return (
      <View style={styles.container}>
        <View style={styles.boxImage}>
          <Text style={[styles.textTitle, textTitleStyle]}>
            Ảnh chụp xác nhận
          </Text>
          <Text style={[styles.textSubTitle, textSubStyle]}>
            Ảnh hợp lệ là ảnh chụp chính diện, rõ khuôn mặt
          </Text>
          <TouchableOpacity onPress={() => openCamera('portrait')}>
            {portraitUri ? (
              <Image
                style={{ width: width, height: 300, borderRadius: 8 }}
                source={{ uri: portraitUri.uri }}
              />
            ) : (
              <Image
                fadeDuration={500}
                resizeMode={'contain'}
                style={{ width: width, height: heightCard, borderRadius: 8 }}
                source={require('../../../assets/default.png')}
              />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={onFaceAnalysis}
          disabled={isDisableButton}
          style={isDisableButton ? styles.disableButton : styles.button}
        >
          <Text
            style={
              isDisableButton ? styles.textDisableButton : styles.textButton
            }
          >
            Xác nhận
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderModalCamera = () => {
    let typeCard = 'card'
    if (showModal == 'portrait') {
      typeCard = 'portrait'
    } else if (type == 'passport') {
      typeCard = 'passport'
    }
    return (
      <TakeCardPhoto
        type={typeCard as any}
        onBack={() => setShowModal(null)}
        onSuccess={onTakeCardPhoto}
      />
    )
  }

  if (showModal != null) {
    return renderModalCamera()
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        nestedScrollEnabled
        ref={interestRef}
        style={{
          width: deviceWidth,
        }}
        horizontal
        pagingEnabled
        snapToInterval={deviceWidth}
        scrollEventThrottle={16}
        scrollEnabled={false}
        bounces={true}
        showsHorizontalScrollIndicator={false}
      >
        {currentIndex === 1 ? renderSelectCardId() : renderSelectSelfieImage()}
        {renderSelectCardId()}
      </ScrollView>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.textButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: deviceWidth,
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  boxImage: {
    paddingHorizontal: padding,
    marginVertical: 8,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    maxWidth: width,
    textAlign: 'center',
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
    maxWidth: width,
    paddingBottom: 8,
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
    padding: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    zIndex: 99,
  },
  textButtonModal: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
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
