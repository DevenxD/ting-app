import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Settings, StyleSheet, useColorScheme, View } from 'react-native'
import { Button, Searchbar, Surface, Text, useTheme } from 'react-native-paper'
import { SearchBar } from 'react-native-screens'

const Home = () => {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'center',
			// justifyContent: 'center',
			padding: 0,
			// backgroundColor: theme.colors.background
		}
	})

	const [search, setSearch] = useState("")

	const router = useRouter()

	return (
		<Surface style={styles.container}>
			<Searchbar
				style={{ margin: 8 }}
				icon='cog'
				onIconPress={() => router.push('/settings')}
				placeholder='Search'
				value={search}
				onChangeText={(text) => setSearch(text)}
			/>
			<Text>Home Screen Here</Text>
			<Button mode='contained' onPress={() => { }}>Butt</Button>
		</Surface>
	)
}

export default Home

