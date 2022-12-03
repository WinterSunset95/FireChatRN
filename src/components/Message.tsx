import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Message( {text, name}:any ) {
    return (
        <Text style={{paddingBottom: 10}}>
            <View style={styles.main}>
                <Text style={styles.whiteText}>{name}</Text>
                <View style={styles.secondary}>
                    <Text style={styles.blackText}>{text}</Text>
                </View>
            </View>
        </Text>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 0,
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 5,
    },

    secondary: {
        flex: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
    },

    whiteText: {
        color: 'white',
        padding: 5,
    },

    blackText: {
        color: 'black',
    }
})