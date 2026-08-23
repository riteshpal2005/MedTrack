import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BellRing, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoutineStore } from '../store/routine-store';
import { Heading, SubText } from '../components/ui/typography';
import { requestNotificationPermission } from '../services/notification-service';
import { RootStackParamList } from '../navigation/root-navigator';

export default function RoutinesScreen() {
  const { tasks } = useRoutineStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

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
          onPress={() => navigation.navigate('ManageTask', { taskToEdit: undefined })}
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
            <Pressable 
              key={task.id} 
              onPress={() => navigation.navigate('ManageTask', { taskToEdit: task })}
              className="bg-surface-variant p-5 rounded-3xl mb-4 flex-row justify-between items-center shadow-sm active:scale-95 transition-transform"
            >
              <View>
                <Heading className="text-xl mb-1">{task.title}</Heading>
                <Text className="font-sans text-sm font-bold text-brand-primary">{task.time}</Text>
              </View>
              <View className="p-3 bg-surface rounded-full shadow-sm">
                <ChevronRight size={18} color="#0B57D0" />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
