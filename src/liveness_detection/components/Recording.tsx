import * as React from 'react';

import { Dimensions, StyleSheet, View, ScrollView, Platform, Modal, Alert, SafeAreaView } from 'react-native';
import {
    useCameraDevices,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { apiPostFormData } from '../../api/serviceHandle';
import { LoadingModal } from '../../components/loading';
import { RecordingGuildStep } from './RecordingGuildStep';
const deviceWidth = Dimensions.get('window').width;
const frameWidth = Dimensions.get('window').width * 0.8;
const frameHeight = frameWidth;
const dataAction = ['pitch_head', 'yaw_head', 'eyes', 'mouth']

export interface CameraRecordingProps {
    onSuccess: (score: number) => void;
}
const durationTime = Platform.OS === 'ios' ? 4200 : 5000;

export const CameraRecording: React.FC<CameraRecordingProps> = React.memo((props) => {
    const { onSuccess } = props;
    const [hasPermission, setHasPermission] = React.useState(false);
    const camera = React.useRef<Camera>(null);
    const devices = useCameraDevices('wide-angle-camera')
    const device = devices.front;
    const interestRef = React.useRef<ScrollView>(null);
    const [isLoading, setLoading] = React.useState(false);
    const [listStep, setListStep] = React.useState(['intro'])


    React.useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
        })();
        setListStep([...listStep, dataAction[Math.floor(Math.random() * 4)], dataAction[Math.floor(Math.random() * 4)], dataAction[Math.floor(Math.random() * 4)]])

    }, []);


    const onConfirm = async (data: any) => {
        try {
            const formdata = new FormData();
            const objVideo = {
                uri: Platform.OS === 'ios' ? data.path.toString().replace('file://', '') : data.path,
                type: 'video/mp4',
                name: `video.mp4`,
            };
            const listActions = listStep.filter(elm => elm != 'intro');
            formdata.append('video_face', objVideo);
            formdata.append('actions', listActions.join(','));
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
                setLoading(false);
            }
        } catch (error) {            
            Alert.alert('Thông báo', 'Đã có lỗi xảy ra');
            if (interestRef.current) {
                interestRef?.current.scrollTo({ animated: true, x: 0 });
            }
            setLoading(false);
        }
    }

    const onRecording = async () => {
        if (camera.current) {
            camera.current.startRecording({
                videoCodec: 'h264',
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
    const onNextStep = (index: number) => {
        switch (index) {
            case 0:
                if (interestRef.current) {
                    interestRef?.current.scrollTo({ animated: true, x: deviceWidth });
                }
                break;
            case 1:
                onRecording();
                break;
            case 2:
                onContinueRecording(false, 2);
                break;
            case 3:
                onContinueRecording(true, 3);
                break;
            default:
                break;
        }
    }

 

    const renderFrame = () => {
        return (<View style={styles.frame}>
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
            <View style={styles.frameContainer}>
                <View style={{ flex: 1, justifyContent: 'center', }}>
                    {renderFrame()}
                    {device != null && hasPermission ? (
                        <Camera
                            fps={60}
                            preset="iframe-960x540"
                            ref={camera}
                            style={{ flex: 1, zIndex: 1 }}
                            device={device}
                            isActive
                            video
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
                        {listStep.map((item, index) => <RecordingGuildStep key={index.toString()} stepName={item as any} step={index} onNextStep={() => onNextStep(index)} />)}
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
    container: { width: deviceWidth, backgroundColor: 'black', justifyContent: 'flex-end' },
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
    },
    frameContainer:{
        width: deviceWidth, 
        height: '100%', 
        borderRadius: 50, 
        zIndex: 2, 
        position: 'absolute' 
    },
    frame:{
        flexDirection: 'row', 
        width: deviceWidth, 
        height: frameHeight, 
        zIndex: 3, 
        position: 'absolute',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
})