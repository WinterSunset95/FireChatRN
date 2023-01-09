import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Message( {text, name, owned, timestamp, picture }:any ) {
    return (
        <Text style={owned ? {paddingBottom: 10, alignSelf: 'flex-end'} : {paddingBottom: 10, maxWidth: 300}}>
            <View style={styles.main}>
                <Text style={owned ? {color: 'white'} : styles.whiteText}>{name}</Text>
                <View style={styles.secondary}>
                    <Text style={styles.blackText}>{text}</Text>
                </View>
            </View>
			<Text>{timestamp}</Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 0,
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 5,
				maxWidth: 300
    },

    secondary: {
        flex: 0,
        backgroundColor: '#bbb',
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
