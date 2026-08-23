import React, { useState, useEffect, useMemo } from 'react';
import { View, Pressable, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Clock, AlignLeft, Trash2 } from 'lucide-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { useRoutineStore, TaskType } from '../store/routine-store';
import CustomTimePicker from '../components/ui/custom-time-picker';
import { Button } from '../components/ui/button';
import { Heading, Label } from '../components/ui/typography';
import { useThemeStore } from '../store/theme-store';
import { RootStackParamList } from '../navigation/root-navigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageTask'>;

export default function ManageTaskScreen({ route, navigation }: Props) {
  const { taskToEdit } = route.params || {};
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const dynamicStyles = useMemo(() => getStyles(isDark), [isDark]);

  const [title, setTitle] = useState('');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [type, setType] = useState<TaskType>('skincare');
  
  const { addTask, updateTask, deleteTask } = useRoutineStore();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      try {
        const [t, p] = taskToEdit.time.split(' ');
        const [h, m] = t.split(':');
        setHour(h);
        setMinute(m);
        setPeriod(p as 'AM' | 'PM');
      } catch {
        setHour('08');
        setMinute('00');
        setPeriod('AM');
      }
      setType(taskToEdit.type);
    }
  }, [taskToEdit]);

  const handleSave = () => {
    if (!title.trim()) {
      ReactNativeHapticFeedback.trigger('notificationError');
      Alert.alert('Title Required', 'Please enter a name for your routine.');
      return;
    }
    
    const formattedHour = hour.padStart(2, '0');
    const formattedMinute = minute.padStart(2, '0');
    const time = `${formattedHour}:${formattedMinute} ${period}`;

    if (taskToEdit) {
      updateTask(taskToEdit.id, { title, time, type });
    } else {
      addTask({ title, time, type });
    }
    
    ReactNativeHapticFeedback.trigger('notificationSuccess');
    navigation.goBack();
  };

  const confirmDelete = () => {
    if (!taskToEdit) return;
    
    ReactNativeHapticFeedback.trigger('notificationWarning');
    Alert.alert(
      "Delete Routine",
      `Are you sure you want to delete "${taskToEdit.title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            ReactNativeHapticFeedback.trigger('impactHeavy');
            deleteTask(taskToEdit.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-6 flex-row justify-between items-center">
        <Pressable 
          onPress={() => navigation.goBack()} 
          className="w-12 h-12 bg-surface-variant rounded-full items-center justify-center active:scale-95"
        >
          <ArrowLeft size={24} color={isDark ? "#FFFFFF" : "#000000"} />
        </Pressable>
        <Heading className="mb-0 text-2xl">
          {taskToEdit ? 'Edit Routine' : 'New Routine'}
        </Heading>
        {taskToEdit ? (
          <Pressable 
            onPress={confirmDelete}
            className="w-12 h-12 bg-[#FFEBEE] rounded-full items-center justify-center active:scale-95"
          >
            <Trash2 size={22} color="#D32F2F" />
          </Pressable>
        ) : (
          <View className="w-12 h-12" /> // spacer
        )}
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="mb-8 mt-4">
          <View className="flex-row items-center mb-2 space-x-2">
            <AlignLeft size={18} color={isDark ? "#FFFFFF" : "#444746"} style={styles.iconOffset} />
            <Label>Task Name</Label>
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Morning Cleanser"
            placeholderTextColor="#8e8e8e"
            style={[styles.input, dynamicStyles.inputBackground]}
          />
        </View>

        <View className="mb-10">
          <View className="flex-row items-center mb-4 space-x-2">
            <Clock size={18} color={isDark ? "#FFFFFF" : "#444746"} style={styles.iconOffset} />
            <Label>Time</Label>
          </View>
          <View className="items-center justify-center bg-surface-variant p-6 rounded-3xl">
            <CustomTimePicker 
              hour={hour}
              minute={minute}
              period={period}
              onHourChange={setHour}
              onMinuteChange={setMinute}
              onPeriodChange={setPeriod}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-background">
        <Button 
          title={taskToEdit ? 'Save Changes' : 'Create Routine'}
          onPress={handleSave}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    fontSize: 18,
    fontFamily: 'Sora_500Medium',
  },
  iconOffset: {
    marginTop: -8,
  },
});

const getStyles = (isDark: boolean) => StyleSheet.create({
  inputBackground: { 
    backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5', 
    color: isDark ? '#FFFFFF' : '#000000' 
  },
});
