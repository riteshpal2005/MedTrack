import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useThemeStore } from '../store/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  
  const { theme } = useThemeStore();

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  return (
    <View className={`flex-1 bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor='transparent'
        translucent
      />
      {children}
    </View>
  )

}
