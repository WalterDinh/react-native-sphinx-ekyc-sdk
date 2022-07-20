import * as React from 'react';

import { Dimensions, StyleSheet, View, ScrollView, Platform, Modal, Alert } from 'react-native';
import {
    useCameraDevices,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { apiPostFormData } from '../../api/serviceHandle';
import { LoadingModal } from '../../components/loading';
import { RecordingGuildStep } from './RecordingGuildStep';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const frameWidth = Dimensions.get('window').width * 0.8;
const frameHeight = frameWidth;
const listStep = [0, 1, 2, 3];


export interface CameraRecordingProps {
    onSuccess: (score: number) => void;
}
const durationTime = Platform.OS === 'ios' ? 4000 : 5000;
export const CameraRecording: React.FC<CameraRecordingProps> = React.memo((props) => {
    const { onSuccess } = props;
    const [hasPermission, setHasPermission] = React.useState(false);
    const camera = React.useRef<Camera>(null);
    const devices = useCameraDevices('wide-angle-camera')
    const device = devices.front;
    const interestRef = React.useRef<ScrollView>(null);
    const [isLoading, setLoading] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
    }, []);



    const onConfirm = async (data: any) => {
        console.log('data',data);
        
        try {
            const formdata = new FormData();
            const objVideo = {
                uri: Platform.OS === 'ios' ? data.path.toString().replace('file://', '') : data.path,
                type: 'video/mp4',
                name: `video.${data.path}`,
            };
            formdata.append('video_face', objVideo);
            formdata.append('actions', 'pitch_head,eyes,mouth');
            const response = await apiPostFormData('liveness/video', formdata);
            if (!response.response.status) {
                Alert.alert('Lỗi', response.response?.message);
                if (interestRef.current) {
                    interestRef?.current.scrollTo({ animated: true, x: 0 });
                }
                setLoading(false);
            }
            if (response.response?.score) {
                onSuccess(response.response?.score);
            }
        } catch (error) {
            Alert.alert('Thông báo', 'Đã có lỗi xảy ra');
            if (interestRef.current) {
                interestRef?.current.scrollTo({ animated: true, x: 0 });
            }
            setLoading(false);
        } finally {
        }
    }

    const onRecording = async () => {
        if (camera.current) {
            camera.current.startRecording({
                fileType: 'mp4',
                flash: 'off',
                onRecordingFinished: (video) => onConfirm(video),
                onRecordingError: (error) => console.error(error),
            })
            setTimeout(async () => {
                if (camera.current) {
                    camera.current.pauseRecording();
                    if (interestRef.current) {
                        interestRef?.current.scrollTo({ animated: true, x: 2 * deviceWidth });
                    }
                }
            }, durationTime);
        }
    }
    const onContinueRecording = async (isFinish: boolean, step: number) => {
        if (camera.current) {
            camera.current.resumeRecording();
            setTimeout(async () => {
                if (camera.current) {
                    if (isFinish) {
                        setLoading(true);
                        camera.current.stopRecording();
                    } else {
                        camera.current.pauseRecording();
                        if (interestRef.current) {
                            interestRef?.current.scrollTo({ animated: true, x: (step + 1) * deviceWidth });
                        }
                    }
                }
            }, durationTime);
        }
    }
    const onNextStep = (step: number) => {
        switch (step) {
            case 0:
                if (interestRef.current) {
                    interestRef?.current.scrollTo({ animated: true, x: deviceWidth });
                }
                break;
            case 1:
                onRecording();
                break;
            case 2:
                onContinueRecording(false, step);
                break;
            case 3:
                onContinueRecording(true, step);
                break;
            default:
                break;
        }
    }


    // const onTakePhoto = async () => {
    //     console.log("photo");

    //     if (camera.current) {
    //         const photo = await camera.current.takePhoto({
    //             flash: 'on'
    //         })
    //         console.log("photo", photo);

    //     }
    // }



    // const renderButtonTakePhoto = () => {
    //     return (<View style={{ paddingTop: 24, paddingBottom: 40, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', }}>
    //         <TouchableOpacity onPress={() => onNextStep(2)} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
    //             <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: 'white', borderWidth: 2, borderColor: 'black' }} />
    //         </TouchableOpacity>
    //     </View>)
    // }


    const renderFrame = () => {
        // return (<View style={{ width: deviceWidth, height: deviceHeight, zIndex: 3, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
        //     <View style={{ width: deviceWidth, height: deviceHeight, borderRadius: 50, zIndex: 2, position: 'absolute' }}>
        //         <View style={{ flexDirection: 'row', flex: 1 }}>
        //             <View style={{ height: frameHeight, width: 32, backgroundColor: colorOutsideFrame }} />
        //             <View style={{ flex: 1, }}>
        //                 <View style={{ width: frameWidth, height: frameWidth, borderRadius: frameWidth / 2 }} />
        //             </View>
        //             <View style={{ height: frameHeight, width: 32, backgroundColor: colorOutsideFrame }} />
        //         </View>
        //         <View style={{ height: viewBottomHeight, width: deviceWidth, backgroundColor: colorOutsideFrame, justifyContent: 'flex-end' }} >
        //             <View style={{ paddingTop: 24, paddingBottom: 40, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
        //                 <TouchableOpacity onPress={onRecording} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        //                     <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: 'white', borderWidth: 2, borderColor: 'black' }} />
        //                 </TouchableOpacity>
        //             </View>
        //         </View>

        //     </View>

        // </View>)
        return (<View style={{ flexDirection: 'row', width: deviceWidth, height: frameHeight, zIndex: 3, position: 'absolute', }}>
            <View style={{ height: frameHeight, width: 32, }} />
            <View style={{ flex: 1, justifyContent: 'space-between', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.borderFrame, { borderLeftWidth: 3, borderTopWidth: 3, borderTopStartRadius: 16, }]} />
                    <View style={[styles.borderFrame, { borderRightWidth: 3, borderTopWidth: 3, borderTopEndRadius: 16 }]} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.borderFrame, { borderLeftWidth: 3, borderBottomWidth: 3, borderBottomStartRadius: 16 }]} />
                    <View style={[styles.borderFrame, { borderRightWidth: 3, borderBottomWidth: 3, borderBottomEndRadius: 16 }]} />
                </View>
            </View>
            <View style={{ height: frameHeight, width: 32, }} />
        </View>)
    }


    return <View style={{ width: deviceWidth }}>
        <View style={{ width: deviceWidth, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: deviceWidth, height: '100%', borderRadius: 50, zIndex: 2, position: 'absolute' }}>
                <View style={{ flex: 1, justifyContent: 'center', }}>
                    {renderFrame()}
                    {device != null && hasPermission ? (
                        <Camera
                            preset="high"
                            ref={camera}
                            style={{ flex: 1, zIndex: 1 }}
                            device={device}
                            isActive={true}
                            video={true}
                        />
                    ) : null
                    }
                </View>

                <View style={styles.container} >
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
                        showsHorizontalScrollIndicator={false}
                    >
                        {listStep.map((item, index) => <RecordingGuildStep key={index.toString()} step={item} onNextStep={() => onNextStep(item)} />)}
                    </ScrollView>

                </View>
            </View>
        </View>

        <Modal transparent={true} animationType='fade' visible={isLoading}>
            <LoadingModal />
        </Modal>
    </View >

});

const styles = StyleSheet.create({
    container:{ width: deviceWidth, backgroundColor: 'black', justifyContent: 'flex-end' },
    lable: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'normal',
        maxWidth: '80%',
        textAlign: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        maxWidth: '75%',
    },
    textButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    borderFrame: {
        width: frameWidth / 4,
        height: frameWidth / 4,
        borderColor: 'white'
    }
})