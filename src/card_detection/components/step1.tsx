import * as React from 'react'
import { Dimensions, Image, ScrollView, TextStyle, StyleProp, ImageStyle, StyleSheet, Text, TouchableOpacity, View, ViewStyle, Modal, Platform, TouchableWithoutFeedback, Alert } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs'
import { apiPostFormData } from '../../api/serviceHandle';
import { LoadingModal } from '../../components/loading';


export interface FaceDetectionScreenProps {
    containerStyle?: StyleProp<any>;
    token?: string;
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
const width = deviceWidth - padding * 2
export const Step1: React.FC<FaceDetectionScreenProps> = (props) => {
    const { onSuccess, textSubStyle, textTitleStyle } = props
    const [showModal, setShowModal] = React.useState<null | 'cardID' | 'portrait' | 'loading'>(null);
    const [cardUri, setCardUri] = React.useState<null | { base64: string, uri: string, image: any }>(null);
    const [portraitUri, setPortraitUri] = React.useState<null | { base64: string, uri: string, image: any }>(null);
    const interestRef = React.useRef<ScrollView>(null);


    const openImagePicker = (type: 'cardID' | 'portrait' | 'loading') => {
        setShowModal(type);
    }

    const onNext = () => {
        if (interestRef.current) {
            interestRef?.current.scrollTo({ animated: true, x: deviceWidth });
        }
    }



    const onChooseImage = async () => {
        onCloseModal();
        setTimeout(() => {
            ImagePicker.openPicker({
                mediaType: 'photo',
                includeBase64: true,
            }).then(async image => {
                onCloseModal();
                const base64Data = await RNFS.readFile(image.path, 'base64');
                const data = `data:${image.mime};base64,${base64Data}`;
                if (showModal == 'cardID') {
                    setCardUri({ base64: base64Data, uri: data, image });
                }
                if (showModal == 'portrait') {
                    setPortraitUri({ base64: base64Data, uri: data, image });
                }
            });
        }, 1000);

    };

    const onCloseModal = (isError: boolean = false) => {
        setShowModal(null);
        if (isError) {
            setPortraitUri(null);
            setCardUri(null);
            Alert.alert('Thông báo', 'Đã có lỗi xảy ra');
            if (interestRef.current) {
                interestRef?.current.scrollTo({ animated: true, x: 0 });
            }
        }
    };

    const onTakePhoto = async () => {
        onCloseModal();
        setTimeout(() => {
            ImagePicker.openCamera({
                cropping: false,
                includeBase64: true,
                mediaType: 'photo',
            }).then(async image => {
                const base64Data = await RNFS.readFile(image.path, 'base64');
                const data = `data:${image.mime};base64,${base64Data}`;
                if (showModal == 'cardID') {
                    setCardUri({ base64: base64Data, uri: data, image });
                }
                if (showModal == 'portrait') {
                    setPortraitUri({ base64: base64Data, uri: data, image });
                }
            }).catch((err) => {
                console.log('err', err);

            });
        }, 1000);

    };

    const onConfirm = async () => {
        openImagePicker('loading');
        try {
            const formdata = new FormData();
            const objCardImage = {
                uri: Platform.OS === 'ios' ? cardUri?.image.path.toString().replace('file://', '') : cardUri?.image.path,
                type: cardUri?.image.mime || 'image/jpg',
                name: `image${cardUri?.image?.name}.${cardUri?.image.mime}`,
            };
            formdata.append('card_file', objCardImage);
            const objSelfieImage = {
                uri: Platform.OS === 'ios' ? portraitUri?.image.path.toString().replace('file://', '') : portraitUri?.image.path,
                type: portraitUri?.image.mime || 'image/jpg',
                name: `image${portraitUri?.image?.name}.${portraitUri?.image.mime}`,
            };
            formdata.append('selfie_file', objSelfieImage);
            const response = await apiPostFormData('ekyc/files', formdata);
            onSuccess(response.response)
            onCloseModal(true);
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
                    <Image style={{ width: width, height: 200, borderRadius: 8 }}
                        source={cardUri ? { uri: cardUri.uri } : require('../../../assest/default.png')}
                    />
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
                <TouchableOpacity onPress={() => openImagePicker('portrait')}>
                    <Image style={{ width: width, height: 300, borderRadius: 8 }}
                        source={portraitUri ? { uri: portraitUri.uri } : require('../../../assest/default.png')}
                    />
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

    return (
        <View style={{ flex: 1 }}>
            <ScrollView nestedScrollEnabled
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
                {showModal == 'loading' ? (<LoadingModal />) :
                    (<View onTouchEnd={() => onCloseModal()} style={styles.modalView}>
                        <TouchableOpacity
                            disabled
                            onPress={() => { }}
                            activeOpacity={1}
                            style={styles.boxButton}>
                            <TouchableOpacity
                                style={[styles.textButtonModal, { marginBottom: 16 }]}
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
    boxButton: { backgroundColor: '#fff', padding: 40, borderTopLeftRadius: 8, borderTopRightRadius: 8, zIndex: 99 },
    textButtonModal: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
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
