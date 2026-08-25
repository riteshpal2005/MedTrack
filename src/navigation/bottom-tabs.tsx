import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Home, Pill, ListChecks, Clock, User } from 'lucide-react-native';
import { useThemeStore } from '../store/theme-store';

import DashboardScreen from '../screens/dashboard';
import MedicationsScreen from '../screens/medications';
import RoutinesScreen from '../screens/routines';
import HistoryScreen from '../screens/history';
import ProfileScreen from '../screens/profile';

const Tab = createMaterialTopTabNavigator();

const DashboardIcon = ({ color }: { color: string }) => <Home color={color} size={24} />;
const MedicationsIcon = ({ color }: { color: string }) => <Pill color={color} size={24} />;
const RoutinesIcon = ({ color }: { color: string }) => <ListChecks color={color} size={24} />;
const HistoryIcon = ({ color }: { color: string }) => <Clock color={color} size={24} />;
const ProfileIcon = ({ color }: { color: string }) => <User color={color} size={24} />;

export default function BottomTabs() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#E0E0E0',
          borderTopWidth: 1,
          height: 80,
          elevation: 0,
        },
        tabBarIndicatorStyle: {
          display: 'none',
        },
        tabBarActiveTintColor: isDark ? '#C4B5FD' : '#7C3AED',
        tabBarInactiveTintColor: isDark ? '#E2E2E2' : '#444746',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarIcon: DashboardIcon }}
      />
      <Tab.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{ tabBarIcon: MedicationsIcon }}
      />
      <Tab.Screen
        name="Routines"
        component={RoutinesScreen}
        options={{ tabBarIcon: RoutinesIcon }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: HistoryIcon }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ProfileIcon }}
      />
    </Tab.Navigator>
  );
}
