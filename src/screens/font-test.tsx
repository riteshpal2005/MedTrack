import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FontTestScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-10">
      <View className="mb-10 p-6 bg-surface-variant rounded-3xl">
        <Text style={styles.systemFont} className="text-sm font-bold text-on-surface/50 mb-4 uppercase tracking-widest">
          System Default Font
        </Text>
        <Text style={styles.systemFont} className="text-3xl font-bold text-on-surface mb-2">
          The quick brown fox
        </Text>
        <Text style={styles.systemFont} className="text-base text-on-surface/70 leading-6">
          Jumps over the lazy dog. 1234567890. This text is explicitly rendering using the system default font for comparison.
        </Text>
      </View>

      <View className="p-6 bg-surface-variant rounded-3xl">
        <Text style={styles.soraFont} className="text-sm font-bold text-on-surface/50 mb-4 uppercase tracking-widest">
          Custom Sora Font
        </Text>
        <Text style={styles.soraFont} className="text-3xl font-bold text-on-surface mb-2">
          The quick brown fox
        </Text>
        <Text style={styles.soraFont} className="text-base text-on-surface/70 leading-6">
          Jumps over the lazy dog. 1234567890. This text is explicitly rendering using the system default font for comparison.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  systemFont: {
    fontFamily: 'System',
  },
  soraFont: {
    fontFamily: 'Sora_400Regular',
  },
});
