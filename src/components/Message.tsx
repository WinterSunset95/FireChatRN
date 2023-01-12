import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Message(props:any) {
	const time = props.message.timestamp
    return (
        <Text style={props.owned ? {paddingBottom: 10, alignSelf: 'flex-end', maxWidth: 350} : {paddingBottom: 10, maxWidth: 350}}>
            <View style={styles.main}>
                <Text style={styles.whiteText}>{props.message.user}</Text>
                <View style={styles.secondary}>
                    <Text style={styles.blackText}>{props.message.message}</Text>
                </View>
				<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
					<Text style={[styles.whiteText, {fontSize: 10}]}>{time}</Text>
					{props.message.read ? <FontAwesomeIcon icon={faCheckCircle} size={10} color={'#ffffff'} /> : null}
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
		maxWidth: 400
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
