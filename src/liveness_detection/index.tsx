import * as React from 'react'
import { Dimensions, StyleSheet, View, FlatList, Text } from 'react-native'
import { setToken } from '../api/serviceHandle'
import { CameraRecording } from './components/Recording';



const listStep = [1, 2, 3];

const screenWidth = Dimensions.get('window').width;

export const LivenessDetection: React.FC<any> = (props) => {
    const { token } = props
    const interestRef = React.useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [score, setScore] = React.useState<number>(0)
    React.useEffect(() => {
        setToken(token)
    }, [])
    const onSuccess = (data?: number) => {
        if (interestRef.current && !!data) {
            setScore(data);
            interestRef?.current.scrollToIndex({ animated: true, index: currentIndex + 1 });
        }
    }

    const renderItem = (item: number) => {
        switch (item) {
            case 1:
                return <CameraRecording onSuccess={onSuccess} />
            case 2:
                return <View style={styles.container} >
                    <Text style={styles.textScore}>{`Score: ${score}`}</Text>
                </View>;
            default:
                return <View/>
        }
    };

    const onItemChange = (e: any) => {
        const contentOffset = e.nativeEvent.contentOffset;
        const viewSize = e.nativeEvent.layoutMeasurement;
        const newCurrentIndex = Math.round(contentOffset.x / viewSize.width);
        setCurrentIndex(newCurrentIndex)
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                nestedScrollEnabled
                ref={interestRef}
                data={listStep}
                renderItem={({ item, index }: any) =>
                    renderItem(item)
                }
                keyExtractor={(item: any, index: any) => index.toString()}
                horizontal
                pagingEnabled
                snapToInterval={screenWidth}
                scrollEventThrottle={16}
                scrollEnabled={false}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onItemChange}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textScore: {
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 24,
        color: 'red',
        alignSelf: 'center'
    },
})
