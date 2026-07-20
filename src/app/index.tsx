import React from 'react';
import { ThemeProvider } from '../providers/theme-provider';
import HomeScreen from '../screens/home/home';
import { DatabaseProvider} from '@nozbe/watermelondb/DatabaseProvider'
import { database } from '../database';

export default function AppRoot() {
  return(
    <DatabaseProvider database={database}>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </DatabaseProvider>
  )
}