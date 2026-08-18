import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sparkles, CheckCircle2 } from 'lucide-react-native';
import { useThemeStore } from '../store/theme-store';

type EmptyStateType = 'first-launch' | 'all-caught-up';

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
}

export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  // Use a fallback color for icons based on theme. Tailwind classes handle text/bg.
  const iconColor = isDark ? '#A8C7FA' : '#0B57D0'; // Primary container or primary colors roughly

  if (type === 'all-caught-up') {
    return (
      <View className="flex-1 items-center justify-center p-8 mt-10">
        <View className="bg-primary-container p-6 rounded-full mb-6 shadow-sm">
          <CheckCircle2 size={48} color={iconColor} strokeWidth={1.5} />
        </View>
        <Text className="text-2xl font-bold text-primary mb-2 text-center">
          You're All Caught Up!
        </Text>
        <Text className="text-on-surface text-center text-base mb-8 opacity-70">
          You've completed everything on your schedule for today. Time to relax and enjoy the rest of your day.
        </Text>
      </View>
    );
  }

  // first-launch default
  return (
    <View className="flex-1 items-center justify-center p-8 mt-10">
      <View className="bg-primary-container p-6 rounded-full mb-6 shadow-sm">
        <Sparkles size={48} color={iconColor} strokeWidth={1.5} />
      </View>
      <Text className="text-2xl font-bold text-primary mb-2 text-center">
        Let's Build Your Routine
      </Text>
      <Text className="text-on-surface text-center text-base mb-8 opacity-70">
        Your day is a blank canvas. Start by adding your first medication, supplement, or skincare task.
      </Text>
      <Pressable
        onPress={onAction}
        className="bg-primary px-8 py-4 rounded-full shadow-md active:opacity-80 flex-row items-center"
      >
        <Text className="text-on-primary font-bold text-lg">
          Add First Task
        </Text>
      </Pressable>
    </View>
  );
}
