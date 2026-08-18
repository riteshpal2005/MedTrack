import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../providers/theme-provider';
import BottomTabs from '../navigation/bottom-tabs';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from '../database';

export default function AppRoot() {
  return (
    <DatabaseProvider database={database}>
      <ThemeProvider>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </ThemeProvider>
    </DatabaseProvider>
  );
}