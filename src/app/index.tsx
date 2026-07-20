import React from 'react';
import { ThemeProvider } from '../providers/theme-provider';
import HomeScreen from '../screens/home/home';

export default function AppRoot() {
  return(
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  )
}