




import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
	fullFlex: {
		flex: 1,
	},
	blackText: {
		color: 'black',
	},
	whitetext: {
		color: 'white',
	},
	body: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	header: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
		paddingStart: 0,
		paddingEnd: 60,
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
	},
	headerTextField: {
		flex: 0,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	headerImage: {
		width: 30,
		height: 30,
		borderRadius: 1000,
		marginRight: 5,
	},
	globalListContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		width: '100%',
	},
	menuContainer: {
		flex: 1,
		justifyContent: 'space-between',
	},
	menuButton: {
		padding: 5,
		borderRadius: 5,
	},
	menuButtonText: {
		fontSize: 20,
	}
})
export default styles
