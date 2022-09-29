import * as React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay/lib'
import { apiPost } from '../../api/serviceHandle'
import { FaceDetectionInfo } from '../face_detection'

const padding = 24
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export const Step2: React.FC<{
  data?: FaceDetectionInfo
  type: string
  onSuccess?: (data: any) => void
}> = (props) => {
  const { data, type, onSuccess } = props
  const [info, setInfo] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const getInfo = async (id: string) => {
      try {
        setLoading(true)
        const response = await apiPost(
          `ekyc/ocr_info?card_type=${type}&image_face=front`,
          {
            image_id: id,
          }
        )
        if (response.response?.code === 1000) {
          setInfo(response.response?.info)
          onSuccess &&
            onSuccess({ ...response.response?.info, score: data?.score })
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        setLoading(false)
      }
    }
    if (!!data) {
      getInfo(data?.imageId)
    }
  }, [data])

  const renderInfo = (label: string, content: string) => {
    if (content === '') return null
    return (
      <Text style={styles.textContent}>
        {`${label}:`} <Text style={{ fontWeight: 'bold' }}>{content}</Text>
      </Text>
    )
  }
  return (
    <ScrollView style={[styles.container]}>
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text style={styles.textTitle}>Thông tin cá nhân</Text>
        {!!info && (
          <View style={{ maxWidth: '85%', marginTop: 16 }}>
            {renderInfo(
              'Họ và tên',
              (info?.surname || '') + ' ' + info?.name || info?.fullname || ''
            )}
            {renderInfo('ID', info?.id || '')}
            {renderInfo('Ngày sinh', info?.birthday || info?.birth_date || '')}
            {renderInfo('Giới tính', info?.gender || info?.sex || '')}
            {renderInfo('Quê quán', info?.origin_address || '')}
            {renderInfo('Thường trú', info?.address || '')}
            {renderInfo(
              'Giá trị đến',
              info?.license_date || info?.expiry_date || ''
            )}
            {renderInfo('Nước', info?.country || '')}
            {renderInfo('Số hộ chiếu', info?.document_number || '')}
            {renderInfo('Loại', info?.document_type || '')}
            {renderInfo('Mã số', info?.nationality || '')}
          </View>
        )}
        <Text style={styles.textScore}>{`Score: ${data?.score || 0}`}</Text>
      </View>
      <Spinner visible={loading} textStyle={styles.textButton} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight - 64,
  },
  boxImage: {
    paddingHorizontal: padding,
    marginVertical: 8,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 28,
    lineHeight: 28,
    marginBottom: 32,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 32,
    alignSelf: 'auto',
  },
  textScore: {
    marginTop: 24,
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 24,
    color: 'red',
    alignSelf: 'center',
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 24,
    color: '#ffff',
    alignSelf: 'center',
  },
})
