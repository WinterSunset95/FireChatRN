import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

export default function Message(props:any) {
	const time = props.timestamp
    return (
        <Text style={props.owned ? {paddingBottom: 10, alignSelf: 'flex-end'} : {paddingBottom: 10, maxWidth: 300}}>
            <View style={styles.main}>
                <Text style={styles.whiteText}>{props.name}</Text>
                <View style={styles.secondary}>
                    <Text style={styles.blackText}>{props.text}</Text>
                </View>
				<Text style={[styles.whiteText]}>{time}</Text>
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
