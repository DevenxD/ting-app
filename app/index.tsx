import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'

const Home = () => {
	const theme = useTheme()
	const colorScheme = useColorScheme()
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: theme.colors.background,
		}
	})
	return (
		<View style={styles.container}>
			<Text style={{ color: theme.colors.onBackground }}>Home Screen</Text>
			<Text>{colorScheme}</Text>
			<Button mode='contained' onPress={() => { }}>Butt</Button>
		</View>
	)
}

export default Home

