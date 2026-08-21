import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '../providers/theme-provider';
import BottomTabs from '../navigation/bottom-tabs';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from '../database';

export default function AppRoot() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <DatabaseProvider database={database}>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <BottomTabs />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});