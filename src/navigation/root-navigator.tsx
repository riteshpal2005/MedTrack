import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './bottom-tabs';
import ManageTaskScreen from '../screens/manage-task';
import { RoutineTask } from '../store/routine-store';

export type RootStackParamList = {
  Tabs: undefined;
  ManageTask: { taskToEdit?: RoutineTask };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen 
        name="ManageTask" 
        component={ManageTaskScreen} 
        options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
