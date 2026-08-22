import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Edit2, Trash2, BellRing } from 'lucide-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useRoutineStore, RoutineTask } from '../store/routine-store';
import TaskModal from '../components/dashboard/task-modal';
import { Heading, SubText } from '../components/ui/typography';
import { requestNotificationPermission } from '../services/notification-service';

export default function RoutinesScreen() {
  const { tasks, deleteTask } = useRoutineStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<RoutineTask | null>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const openAddModal = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  const openEditModal = (task: RoutineTask) => {
    setTaskToEdit(task);
    setModalVisible(true);
  };

  const confirmDelete = (id: string, title: string) => {
    ReactNativeHapticFeedback.trigger('notificationWarning');
    Alert.alert(
      "Delete Routine",
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            ReactNativeHapticFeedback.trigger('impactHeavy');
            deleteTask(id);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-10 pb-6 flex-row justify-between items-center">
        <View>
          <Heading className="text-4xl mb-0">Routines</Heading>
          <SubText className="mt-2 font-medium">
            Manage your daily regimen
          </SubText>
        </View>
        <Pressable 
          onPress={openAddModal}
          className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg active:scale-95"
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6 pt-2">
        {tasks.length === 0 ? (
          <View className="items-center justify-center mt-32 bg-surface-variant p-8 rounded-3xl border border-outline/10 border-dashed">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
              <BellRing size={40} color="#0B57D0" />
            </View>
            <Heading className="text-center mb-2">
              No Routines
            </Heading>
            <SubText className="text-base text-center px-4 leading-6">
              You haven't set up any reminders yet. Tap the + button to create your first routine!
            </SubText>
          </View>
        ) : (
          tasks.map((task) => (
            <View 
              key={task.id} 
              className="bg-surface-variant p-5 rounded-3xl mb-4 flex-row justify-between items-center shadow-sm"
            >
              <View>
                <Heading className="text-xl mb-1">{task.title}</Heading>
                <Text className="text-sm font-bold text-brand-primary">{task.time}</Text>
              </View>
              <View className="flex-row space-x-3">
                <Pressable onPress={() => openEditModal(task)} className="p-3 bg-surface rounded-full shadow-sm active:opacity-70">
                  <Edit2 size={18} color="#0B57D0" />
                </Pressable>
                <Pressable onPress={() => confirmDelete(task.id, task.title)} className="p-3 bg-[#FFEBEE] rounded-full shadow-sm active:opacity-70">
                  <Trash2 size={18} color="#D32F2F" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TaskModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        taskToEdit={taskToEdit} 
      />
    </SafeAreaView>
  );
}
