import * as React from 'react'
import { Dimensions, Image, ScrollView, TextStyle, StyleProp, ImageStyle, StyleSheet, Text, TouchableOpacity, View, ViewStyle, Modal, Platform, TouchableWithoutFeedback, Alert } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'
import { apiPostFormData } from '../../api/serviceHandle';
import { LoadingModal } from '../../components/loading';
import { TakeCardPhoto } from './takeCardPhoto';
import { Camera } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';

export interface FaceDetectionScreenProps {
    containerStyle?: StyleProp<any>;
    token: string;
    textButtonStyle?: TextStyle;
    textTitleStyle?: TextStyle;
    textSubStyle?: TextStyle;
    cardStyle?: ImageStyle;
    portraitStyle?: ImageStyle;
    buttonStyle?: ViewStyle;
    cardTitle?: string;
    portraitTitle?: string;
    portraitSubTitle?: string;
    cardSubTitle?: string;
    onSuccess: (data: any) => void;
}


const deviceWidth = Dimensions.get('window').width;

const padding = 24;
const width = deviceWidth - padding * 2;
const timeoutModal = Platform.OS === 'ios' ? 700 : 500;
export const Step1: React.FC<FaceDetectionScreenProps> = (props) => {
    const { onSuccess, textSubStyle, textTitleStyle } = props
    const [showModal, setShowModal] = React.useState<null | 'cardID' | 'portrait' | 'loading' | 'camera'>(null);
    const [cardUri, setCardUri] = React.useState<null | { base64: string, uri: string, image: any }>(null);
    const [portraitUri, setPortraitUri] = React.useState<null | { base64: string, uri: string, image: any }>(null);
    const interestRef = React.useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [showCamera, setShowCamera] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            await Camera.requestCameraPermission();
        })();
    }, []);


    const openImagePicker = (type: 'cardID' | 'portrait' | 'loading' | 'camera') => {
        setShowModal(type);
    }

    const onNext = () => {
        if (interestRef.current) {
            interestRef?.current.scrollTo({ animated: true, x: deviceWidth });
            setCurrentIndex(1);
        }
    }

    const onTakeCardPhoto = async (image: any) => {
        const base64Data = await RNFS.readFile(image.path, 'base64');
        const data = `data:jpeg;base64,${base64Data}`;
        setCardUri({ base64: base64Data, uri: data, image: image });
    }

    const onChooseImage = async () => {
        onCloseModal();
        setTimeout(() => {
            ImagePicker.openPicker({
                mediaType: 'photo',
                includeBase64: true,
            }).then(async image => {
                const base64Data = await RNFS.readFile(image.path, 'base64');
                const data = `data:${image.mime};base64,${base64Data}`;
                if (showModal == 'cardID') {
                    setCardUri({ base64: base64Data, uri: data, image });
                }
                if (showModal == 'portrait') {
                    setPortraitUri({ base64: base64Data, uri: data, image });
                }
            });
        }, timeoutModal);

    };

    const onCloseModal = React.useCallback((isError: boolean = false, errorMessage?: string) => {
        setShowModal(null);
        if (isError) {
            setPortraitUri(null);
            setCardUri(null);
            setCurrentIndex(0);
            Alert.alert('Thông báo', errorMessage ?? 'Đã có lỗi xảy ra');
            if (interestRef.current) {
                interestRef?.current.scrollTo({ animated: true, x: 0 });
            }
        }
    }, []);

    const onTakePhoto = async () => {
        onCloseModal();
        setTimeout(() => {
            if (currentIndex == 0) {
                setShowCamera(true);
                return;
            }
            ImagePicker.openCamera({
                useFrontCamera: true,
                cropping: false,
                includeBase64: true,
                width: 768,
                height: 1024,
                mediaType: 'photo',
            }).then(async image => {
                const base64Data = await RNFS.readFile(image.path, 'base64');
                const data = `data:${image.mime};base64,${base64Data}`;
                setPortraitUri({ base64: base64Data, uri: data, image });
            }).catch((err) => {
                console.log(err, 'err');
            });
        }, timeoutModal);

    };

    const resizeImage = (path: string) => {
        const compressSizer = (size: number) => {
            const MB = size / Math.pow(1024, 2);
            if (Math.round(MB) === 0) return 1;
            if (Math.round(MB) === 1) return 0.9;
            if (Math.round(MB) === 2) return 0.8;
            if (Math.round(MB) === 3) return 0.7;
            if (Math.round(MB) === 4) return 0.6;
            if (Math.round(MB) >= 5) return 0.5;
            if (Math.round(MB) >= 10) return 0.4;
            if (Math.round(MB) >= 15) return 0.3;
            if (Math.round(MB) >= 20) return 0.2;
            if (Math.round(MB) >= 25) return 0.1;
        };
        let newPath = path;
        ImageResizer.createResizedImage(path, 480, 480, 'JPEG', 100)
            .then(response => {
                const opacity = compressSizer(response.size);
                newPath = response.path;
                if (opacity && opacity < 0.7) {
                    ImageResizer.createResizedImage(path, 480, 480, 'JPEG', opacity)
                        .then(res => {
                            newPath = res.path;
                        }).catch(err => {
                            Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Hãy thử lại ');
                        });
                }
            })
            .catch(err => {
                Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Hãy thử lại ');
            });
        return newPath
    }

    const onConfirm = async () => {
        openImagePicker('loading');
        try {
            const formdata = new FormData();
            const cardPath = resizeImage(cardUri?.image.path)
            const portraitPath = resizeImage(portraitUri?.image.path)

            const objCardImage = {
                uri: Platform.OS === 'ios' ? cardPath.toString().replace('file://', '') : `file://${cardPath}`,
                type: cardUri?.image.mime || 'image/jpg',
                name: `image.jpg`,
            };
            formdata.append('card_file', objCardImage);
            const objSelfieImage = {
                uri: Platform.OS === 'ios' ? portraitPath.toString().replace('file://', '') : portraitPath,
                type: portraitUri?.image.mime || 'image/jpg',
                name: `image${portraitUri?.image?.name}.${portraitUri?.image.mime}`,
            };
            formdata.append('selfie_file', objSelfieImage);
            const response = await apiPostFormData('ekyc/files', formdata);
            onSuccess(response.response);
            onCloseModal(response.response?.code != 1000, response.response?.message);
        } catch (error) {
            onCloseModal(true);
        }
    }


    const renderSelectCardId = () => {
        const isDisableButton = cardUri === null;
        return (<View style={styles.container}>
            <View style={styles.boxImage}>
                <Text style={[styles.textTitle, textTitleStyle]}>Ảnh chụp chứng minh thư/căn cước công dân</Text>
                <Text style={[styles.textSubTitle, textSubStyle]}>Ảnh hợp lệ là ảnh chụp ngang, rõ nét không bị mất góc</Text>
                <TouchableOpacity onPress={() => openImagePicker('cardID')}>
                    {cardUri ? <Image style={{ width: width, height: 200, borderRadius: 8, }}
                        source={{ uri: cardUri.uri }}
                    /> : <View style={{ width: width, height: 200, borderRadius: 8, backgroundColor: 'gray' }} />}
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={onNext}
                disabled={isDisableButton}
                style={isDisableButton ? styles.disableButton : styles.button}>
                <Text style={isDisableButton ? styles.textDisableButton : styles.textButton}>Tiếp tục</Text>
            </TouchableOpacity>

        </View>)
    }

    const renderSelectSelfieImage = () => {
        const isDisableButton = portraitUri === null;
        return (<View style={styles.container}>
            <View style={styles.boxImage}>
                <Text style={[styles.textTitle, textTitleStyle]}>Ảnh chụp xác nhận</Text>
                <Text style={[styles.textSubTitle, textSubStyle]}>Ảnh hợp lệ là ảnh chụp chính diện, rõ khuôn mặt</Text>
                <TouchableOpacity onPress={() => onTakePhoto()}>
                    {portraitUri ? <Image style={{ width: width, height: 300, borderRadius: 8 }}
                        source={{ uri: portraitUri.uri }}
                    /> : <View style={{ width: width, height: 300, borderRadius: 8, backgroundColor: 'gray' }} />}
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={onConfirm}
                disabled={isDisableButton}
                style={isDisableButton ? styles.disableButton : styles.button}>
                <Text style={isDisableButton ? styles.textDisableButton : styles.textButton}>Xác nhận</Text>
            </TouchableOpacity>
        </View>)
    }

    const renderBottomsheetModal = () => {
        return (<View onTouchEnd={() => onCloseModal()} style={styles.modalView}>
            <TouchableOpacity
                disabled
                onPress={() => { }}
                activeOpacity={1}
                style={styles.boxButton}>
                <TouchableOpacity
                    style={styles.textButtonModal}
                    onPress={onTakePhoto}>
                    <Text style={styles.textModal}>Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onChooseImage}
                    style={styles.textButtonModal}>
                    <Text style={styles.textModal}>Chọn từ thư viện ảnh</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>)
    }




    const checkRenderModal = () => {
        switch (showModal) {
            case 'camera':
                return <TakeCardPhoto onBack={() => setShowCamera(false)} onSuccess={onTakeCardPhoto} />
            case 'loading':
                return (<LoadingModal />)
            default:
                return renderBottomsheetModal()
        }
    }
    if (showCamera) {
        return <TakeCardPhoto onBack={() => setShowCamera(false)} onSuccess={onTakeCardPhoto} />
    }
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                nestedScrollEnabled
                ref={interestRef}
                style={{ width: deviceWidth }}
                horizontal
                pagingEnabled
                snapToInterval={deviceWidth}
                scrollEventThrottle={16}
                scrollEnabled={false}
                bounces={true}
                showsHorizontalScrollIndicator={false}  >
                {renderSelectCardId()}
                {renderSelectSelfieImage()}
            </ScrollView>
            <Modal transparent={true} animationType='fade' visible={showModal != null} onRequestClose={onCloseModal}>
                {checkRenderModal()}
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: deviceWidth,
        marginVertical: 16,
        justifyContent: 'space-between'
    },
    boxImage: {
        paddingHorizontal: padding,
        marginVertical: 8
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 24,
        maxWidth: width
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 24,
        color: '#ffff',
        alignSelf: 'center'
    },
    textDisableButton: {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 24,
        color: '#000',
        alignSelf: 'center'
    },
    textSubTitle: {
        fontSize: 12,
        lineHeight: 18,
        maxWidth: width,
        paddingBottom: 8
    },
    button: {
        padding: 16,
        backgroundColor: '#000',
        marginHorizontal: padding,
        borderRadius: 8,
        marginVertical: 32
    },
    disableButton: {
        padding: 16,
        backgroundColor: '#ffff',
        marginHorizontal: padding,
        borderRadius: 8,
        marginVertical: 32,
        borderColor: '#000',
        borderWidth: 2
    },
    modalView: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    textModal: {
        fontSize: 16
    },
    boxButton: {
        backgroundColor: '#fff',
        padding: 24,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        zIndex: 99
    },
    textButtonModal: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 8
    },
    imageLoading: {
        width: 100,
        height: 100,
        alignSelf: "center"
    },
    boxImageLoading: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
