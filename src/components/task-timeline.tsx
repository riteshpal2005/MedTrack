import React from 'react';
import { View, Text } from 'react-native';

interface Task {
  id: string;
  title: string;
  time: string;
  type: 'medication' | 'skincare' | 'hydration';
  completed: boolean;
}

interface TaskTimelineProps {
  tasks: Task[];
}

export default function TaskTimeline({ tasks }: TaskTimelineProps) {
  if (tasks.length === 0) return null;

  return (
    <View className="px-4 py-2">
      <Text className="text-xl font-bold text-on-surface mb-4">Today's Schedule</Text>
      {tasks.map((task) => (
        <View key={task.id} className="bg-surface-variant p-4 rounded-xl mb-3 flex-row justify-between items-center">
          <View>
            <Text className="text-on-surface font-bold text-lg">{task.title}</Text>
            <Text className="text-on-surface/70 mt-1">{task.time}</Text>
          </View>
          <View className={`w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-primary border-primary' : 'border-outline'}`} />
        </View>
      ))}
    </View>
  );
}
