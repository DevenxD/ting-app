// components/DynamicStatusBar.tsx
import React from 'react';
import { StatusBar, StatusBarStyle, Platform } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
interface DynamicStatusBarProps {
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
}

const DynamicStatusBar: React.FC<DynamicStatusBarProps> = ({
  backgroundColor: propBackgroundColor,
  barStyle: propBarStyle,
}) => {
  const { theme } = useThemeContext();

  const barStyle: StatusBarStyle = propBarStyle || (theme.dark ? 'light-content' : 'dark-content');

  const backgroundColor = propBackgroundColor || theme.colors.background;

  return (
    <>
      <StatusBar barStyle={barStyle} translucent={Platform.OS === 'android'} backgroundColor={backgroundColor}/>
    </>
  );
};



export default DynamicStatusBar;