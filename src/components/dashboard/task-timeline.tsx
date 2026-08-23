import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { RoutineTask, useRoutineStore } from '../../store/routine-store';
import { Check } from 'lucide-react-native';

interface TaskTimelineProps {
  tasks: RoutineTask[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TaskItem = ({ task }: { task: RoutineTask }) => {
  const { toggleTaskCompletion } = useRoutineStore();

  const handleToggle = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    });
    toggleTaskCompletion(task.id);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(task.completed ? 0.6 : 1, { duration: 300 }),
      transform: [{ scale: withSpring(task.completed ? 0.98 : 1) }]
    };
  });

  const checkCircleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(task.completed ? '#0B57D0' : 'transparent', { duration: 300 }),
      borderColor: withTiming(task.completed ? '#0B57D0' : '#8e8e8e', { duration: 300 }),
    };
  });

  return (
    <AnimatedPressable 
      onPress={handleToggle}
      style={animatedStyle}
      className="bg-surface-variant p-5 rounded-3xl mb-4 flex-row justify-between items-center shadow-sm"
    >
      <View>
        <Text className={`font-sans text-on-surface font-bold text-xl ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </Text>
        <Text className="font-sans text-on-surface/70 mt-1 font-medium text-sm">
          {task.time}
        </Text>
      </View>
      <Animated.View 
        style={checkCircleStyle}
        className="w-8 h-8 rounded-full border-2 items-center justify-center"
      >
        {task.completed && (
           <Check size={16} color="#FFFFFF" strokeWidth={3} />
        )}
      </Animated.View>
    </AnimatedPressable>
  );
};

export default function TaskTimeline({ tasks }: TaskTimelineProps) {
  if (tasks.length === 0) return null;

  return (
    <View className="px-6 py-2 mt-4">
      <Text className="font-sans text-sm font-bold text-on-surface/70 uppercase tracking-widest mb-4 ml-1">Today's Schedule</Text>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </View>
  );
}
