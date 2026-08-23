import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore } from '../store/theme-store';
import { useRoutineStore } from '../store/routine-store';
import EmptyState from '../components/dashboard/empty-state';
import TaskTimeline from '../components/dashboard/task-timeline';
import FloatingActionButton from '../components/dashboard/floating-action-button';
import { Settings } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/root-navigator';

export default function DashboardScreen() {
  const { theme, setTheme } = useThemeStore();
  const { tasks } = useRoutineStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAddTask = () => {
    navigation.navigate('ManageTask', { taskToEdit: undefined });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-8 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="font-sans text-sm font-medium text-on-surface/70 uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text className="font-sans text-3xl font-bold text-on-surface">Hello!</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-surface-variant items-center justify-center">
          <Settings size={20} color={theme === 'dark' ? '#E2E2E2' : '#1F1F1F'} onPress={toggleTheme} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} className="flex-1">
        {tasks.length === 0 ? (
          <EmptyState type="first-launch" onAction={handleAddTask} />
        ) : (
          <TaskTimeline tasks={tasks} />
        )}
      </ScrollView>

      <FloatingActionButton onPress={handleAddTask} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
});