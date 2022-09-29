import { Alert, Platform } from "react-native"
import { resizeImage } from "."
import { apiPostFormData } from "../api/serviceHandle"

 export const onUploadImage = async (type: string, imagePath: any) => {
    try {
      const formData = new FormData()
      const resizeImagePath = resizeImage(imagePath?.path)
      const objImage = {
        uri:
          Platform.OS === 'ios'
            ? resizeImagePath.toString().replace('file://', '')
            : `file://${resizeImagePath}`,
        type: imagePath?.mime || 'image/jpg',
        name: `image.jpg`,
      }
      formData.append('image_file', objImage)
      const response = await apiPostFormData(
        `ekyc/upload/file?image_type=${type}`,
        formData
      )
      if (response.response.code == 1000 && !!response.response.image_id) {
        return response.response.image_id
      }else{
        Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Hãy thử lại ')
      }
    } catch (error) {
      Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Hãy thử lại ')
    }
  }
