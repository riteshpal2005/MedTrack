import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '../providers/theme-provider';
import RootNavigator from '../navigation/root-navigator';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';
import { database } from '../database';
import Profile from '../database/models/Profile';

export default function AppRoot() {
  useEffect(() => {
    const initProfile = async () => {
      const profilesCount = await database.collections.get<Profile>('profiles').query().fetchCount();
      if (profilesCount === 0) {
        await database.write(async () => {
          await database.collections.get<Profile>('profiles').create((profile) => {
            profile._raw.id = '1';
            profile.name = 'My Profile';
            profile.createdAt = new Date();
          });
        });
      }
    };
    initProfile();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <DatabaseProvider database={database}>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <RootNavigator />
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