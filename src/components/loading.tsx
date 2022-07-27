import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'



export const LoadingModal = () => {
    return (
        <View style={styles.boxImageLoading}>
            <Image
                style={styles.imageLoading}
                source={require("../../assets/loading.gif")}
                resizeMode="contain"
            />
            <Text style={styles.textScore}>Đang xác minh...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
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
    },
    textScore: {
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 30,
        color: 'black',
        alignSelf: 'center'
    },
})
