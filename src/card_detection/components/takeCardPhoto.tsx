import * as React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const padding = 24;
const screenWidth = Dimensions.get('window').width;
const frameWidth = screenWidth * 0.76;
const frameHeight = frameWidth * 85.6 / 52.98;
const borderWidth = 3;
const borderRadius = 8;

interface TakeCardPhotoProps {
    onBack: () => void;
    onSuccess: (data: any) => void;
}

export const TakeCardPhoto: React.FC<TakeCardPhotoProps> = (props) => {
    const { onSuccess, onBack } = props;
    const camera = React.useRef<Camera>(null);
    const [hasPermission, setHasPermission] = React.useState(false);
    const devices = useCameraDevices('wide-angle-camera');
    const device = devices.back;
    React.useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();

    }, []);


    const onTakePhoto = React.useCallback(async () => {
        try {
            if (camera.current) {
                const photo = await camera.current.takePhoto({
                    flash: 'auto',
                    skipMetadata: true,
                })
                onBack();
                onSuccess(photo);
            }
        } catch (error) {
            onBack();
        }
    }, [camera, onBack, onSuccess])

    const renderFrame = () => {
        return (<View style={styles.frame}>
            <View style={{ height: frameHeight, width: 32, }} />
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.borderFrame, styles.borderTopLeft]}>
                        <Image
                            style={styles.iconUser}
                            source={require("../../../assets/icons-user.png")}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={[styles.borderFrame, styles.borderTopRight]} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.borderFrame, styles.borderBottomLeft]} />
                    <View style={[styles.borderFrame, styles.borderBottomRight]} />
                </View>
            </View>
            <View style={{ height: frameHeight, width: 32, }} />
        </View>)
    }

    const renderButtonTakePhoto = () => {
        return (<View style={styles.buttonTakePhotoContainer}>
            <TouchableOpacity onPress={onTakePhoto} style={styles.buttonTakePhoto}>
                <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: 'white', borderWidth: 2, borderColor: 'black' }} />
            </TouchableOpacity>
        </View>)
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.frameContainer}>
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'gray' }}>
                    {renderFrame()}
                    {device != null && hasPermission ? (
                        <Camera
                            ref={camera}
                            style={{ flex: 1, zIndex: 1 }}
                            device={device}
                            isActive
                            photo
                        />
                    ) : null
                    }
                </View>
                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={onBack} style={{ width: 80, marginBottom: 20 }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Cancel</Text>
                    </TouchableOpacity>
                    {renderButtonTakePhoto()}
                    <View style={{ width: 80 }} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        flex: 1,
    },
    boxImage: {
        paddingHorizontal: padding,
        marginVertical: 8
    },
    frame: {
        flexDirection: 'row',
        width: screenWidth,
        position: 'absolute',
        zIndex: 3,
    },
    borderFrame: {
        width: frameWidth / 4,
        height: frameWidth / 4,
        borderColor: 'white'
    },
    borderTopRight: {
        borderRightWidth: borderWidth,
        borderTopWidth: borderWidth,
        borderTopEndRadius: borderRadius
    },
    borderTopLeft: {
        borderLeftWidth: borderWidth,
        borderTopWidth: borderWidth,
        borderTopStartRadius: borderRadius,
    },
    borderBottomRight: {
        borderRightWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderBottomEndRadius: borderRadius
    },
    borderBottomLeft: {
        borderLeftWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderBottomStartRadius: borderRadius
    },
    containerButton: {
        width: screenWidth,
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    frameContainer: {
        width: screenWidth,
        height: '100%',
        zIndex: 2,
        position: 'absolute'
    },
    iconUser: {
        position: 'absolute',
        top: 32,
        left: (frameWidth / 4) - 20,
        height: frameWidth / 2,
        width: frameWidth / 2,
        tintColor: 'white',
        transform: [{ rotate: '90deg' }]
    },
    iconClose: {
        height: 40,
        width: 40,
        tintColor: 'white',
        marginBottom: 20,
    },
    buttonTakePhotoContainer: {
        paddingTop: 24,
        paddingBottom: 40,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonTakePhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
