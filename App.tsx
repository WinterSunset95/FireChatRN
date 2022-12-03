import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Global from './src/pages/Global'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
			<Global />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
