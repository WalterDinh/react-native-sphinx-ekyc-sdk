import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'


export interface ButtonProps extends TouchableOpacityProps {
    title: string;
    containerStyle?: ViewStyle;
}
export const Button: React.FC<ButtonProps> = (props) => {
    const { title, containerStyle } = props;
    return (
        <TouchableOpacity style={[styles.container, containerStyle]} {...props}>
            <Text style={styles.textButton}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 24
    },
    textButton: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    }
})
