import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar, Menu, Surface, Text } from 'react-native-paper'
import { ThemeMode, useThemeContext } from './contexts/ThemeContext'

const Settings = () => {
	const router = useRouter()
	const [themeMenuVisible, setThemeMenuVisible] = useState(false)
	const { themeMode, updateTheme } = useThemeContext()
	const changeTheme = (theme: ThemeMode) => {
		updateTheme(theme)
		setThemeMenuVisible(false)
	}
	return (
		<Surface style={styles.container}>
			<Appbar>
				<Appbar.BackAction onPress={router.back} />
				<Appbar.Content title="Settings" />
			</Appbar>
			<View style={{ ...styles.container, paddingHorizontal: 12, paddingVertical: 16, flexDirection: 'row' }}>
				<Text variant='titleLarge' style={styles.label}>Theme</Text>
				<Menu
					visible={themeMenuVisible}
					onDismiss={() => setThemeMenuVisible(false)}
					anchor={<Text variant='titleMedium' style={{ marginHorizontal: 8 }} onPress={() => setThemeMenuVisible(true)}>{themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}</Text>}
				>
					<Menu.Item title='Auto' onPress={() => changeTheme('auto')} />
					<Menu.Item title='Light' onPress={() => changeTheme('light')} />
					<Menu.Item title='Dark' onPress={() => changeTheme('dark')} />
				</Menu>
			</View>
		</Surface>
	)
}

export default Settings

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	label: {
		// fontSize: 22
		// flex: 2
		marginRight: 'auto'
	}
})
