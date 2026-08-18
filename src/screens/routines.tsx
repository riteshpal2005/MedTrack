import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoutinesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center">
      <Text className="text-2xl font-bold text-on-surface">Routines</Text>
    </SafeAreaView>
  );
}
