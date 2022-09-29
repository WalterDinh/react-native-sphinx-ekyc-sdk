import { Alert } from "react-native"
import ImageResizer from "react-native-image-resizer"

const compressSizer = (size: number) => {
    const MB = size / Math.pow(1024, 2)
    if (Math.round(MB) === 0) return 1
    if (Math.round(MB) === 1) return 0.9
    if (Math.round(MB) === 2) return 0.8
    if (Math.round(MB) === 3) return 0.7
    if (Math.round(MB) === 4) return 0.6
    if (Math.round(MB) >= 5) return 0.5
    if (Math.round(MB) >= 10) return 0.4
    if (Math.round(MB) >= 15) return 0.3
    if (Math.round(MB) >= 20) return 0.2
    if (Math.round(MB) >= 25) return 0.1
  }
 export const resizeImage = (path: string) => {
    let newPath = path
    ImageResizer.createResizedImage(path, 480, 480, 'JPEG', 100)
      .then((response) => {
        const opacity = compressSizer(response.size)
        if (opacity) {
          ImageResizer.createResizedImage(path, 480, 480, 'JPEG', opacity)
            .then((res) => {
              newPath = res.path
            })
            .catch((err) => {
              Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Hãy thử lại ')
            })
        }
      })
      .catch((err) => {
        Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Hãy thử lại ')
      })
    return newPath
  }
