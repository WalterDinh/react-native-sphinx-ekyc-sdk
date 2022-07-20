import * as React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { useCountDown } from '../../hook/useCountdown';
import { Button } from './Button';


export interface RecordingGuildStepProps {
    step: number;
    onNextStep: () => void;
}
const deviceWidth = Dimensions.get('window').width;
const title = 'Cách thiết lập';
export const RecordingGuildStep: React.FC<RecordingGuildStepProps> = React.memo((props) => {
    const { step, onNextStep } = props;
    const [isStart, setStart] = React.useState(false)
    const countdown = useCountDown(isStart ? 5 : 0);


    const renderLabel = React.useMemo(() => {
        switch (step) {
            case 0:
                return `Đầu tiên, Định vị khuôn mặt của bạn trong khung hình camera. Sau đó làm theo từng bước theo hướng dẫn, có 3 bước (gật đầu, chớp mắt và đóng mở miệng), mỗi bước sẽ có 5 giây thực hiện`;
            case 1:
                return 'Vui lòng gật đầu';
            case 2:
                return 'Vui lòng chớp mắt';
            case 3:
                return 'Vui lòng đóng mở miệng';
            default:
                return ''
        }
    }, [step])


    const onPress = React.useCallback(() => {
        if (step !== 0) {
            setStart(true);
        }
        onNextStep();
        setTimeout(() => {
            setStart(false);
        }, 5000);
    }, [step])

    return <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
            {step == 0 && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.lable}>{renderLabel}</Text>
        </View>
        {step !== 0 &&
            <View style={styles.borderTextCountDown}>
                <Text style={styles.textCountDown}>{countdown || 5}</Text>
            </View>
        }
        <Button disabled={isStart} title={'Bắt đầu'} onPress={onPress} />
    </View>
});

const styles = StyleSheet.create({
    lable: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'normal',
        maxWidth: '80%',
        textAlign: 'center'
    },
    container: {
        width: deviceWidth,
        alignItems: 'center',
        paddingVertical: 16,
        justifyContent: 'space-between'
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
    textCountDown: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        lineHeight: 34
    },
    borderTextCountDown: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center'
    }
})
