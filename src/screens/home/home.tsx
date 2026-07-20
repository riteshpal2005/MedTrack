import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useThemeStore } from '../../store/theme-store';

export default function HomeScreen() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return(
    <View className='flex-1 items-center justify-center'>
      <Text className='text-xl font-bold text-primary'>
        Welcome to MedTrack!
      </Text>
      <Text className='text-on-surface mt-2'>
        Current Theme: {theme}
      </Text>
      <Pressable
        onPress={toggleTheme}
        className='mt-6 bg-primary-container px-6 py-3 rounded-full'
      >
        <Text className='text-on-primary-container font-bold'>
          Toggle Theme
        </Text>
      </Pressable>
    </View>
  )
}