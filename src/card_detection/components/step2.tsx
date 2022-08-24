import * as React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { FaceDetectionInfo } from '../face_detection';


const padding = 24;
const screenWidth = Dimensions.get('window').width;
export const Step2: React.FC<{ data?: FaceDetectionInfo }> = (props) => {
    const { data } = props;

    const renderInfo = (lable: string, content: string) => {
        return (
            <Text style={styles.textContent}>{`${lable}: ${content}`}</Text>
        )
    }
    return (
        <View style={[styles.container]}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.textTitle}>Thông tin cá nhân</Text>
                <View style={{ maxWidth:'80%' }}>
                    {renderInfo('Họ và tên', data?.info?.name || '')}
                    {renderInfo('ID', data?.info?.id || '')}
                    {renderInfo('Ngày sinh', data?.info?.birthday || '')}
                    {renderInfo('Giới tính', data?.info?.gender || '')}
                    {renderInfo('Quê quán', data?.info?.origin_address || '')}
                    {renderInfo('Thường trú', data?.info?.address || '')}
                    {renderInfo('Giá trị đến', data?.info?.license_date || '')}
                </View>
            </View>
            <Text style={styles.textScore}>{`Score: ${data?.score || 0}`}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    boxImage: {
        paddingHorizontal: padding,
        marginVertical: 8
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 28,
        lineHeight: 28,
        marginBottom: '18%'
    },
    textContent: {
        fontSize: 18,
        lineHeight: 32,
        alignSelf: 'auto'
    },
    textScore: {
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 24,
        color: 'red',
        alignSelf: 'center'
    },
})
