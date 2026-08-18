import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { useThemeStore } from '../../store/theme-store';
import EmptyState from '../../components/empty-state';
import TaskTimeline from '../../components/task-timeline';
import FloatingActionButton from '../../components/floating-action-button';
import { Settings } from 'lucide-react-native';

export default function HomeScreen() {
  const { theme, setTheme } = useThemeStore();
  // Using an empty array to force the empty state, as requested
  const [tasks, setTasks] = useState([]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleAddTask = () => {
    // This will open an add task modal/screen in the future
    console.log('Add task pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-8 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-medium text-on-surface/70 uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text className="text-3xl font-bold text-on-surface">Hello!</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-surface-variant items-center justify-center">
          <Settings size={20} color={theme === 'dark' ? '#E2E2E2' : '#1F1F1F'} onPress={toggleTheme} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
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