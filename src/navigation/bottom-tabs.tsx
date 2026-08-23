import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Pill, ListChecks, Clock, User, Type } from 'lucide-react-native';
import { useThemeStore } from '../store/theme-store';

// Import Screens
import DashboardScreen from '../screens/dashboard';
import MedicationsScreen from '../screens/medications';
import RoutinesScreen from '../screens/routines';
import HistoryScreen from '../screens/history';
import ProfileScreen from '../screens/profile';
import FontTestScreen from '../screens/font-test';

const Tab = createBottomTabNavigator();

// Extract icon components to prevent re-creation during render
const DashboardIcon = ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />;
const MedicationsIcon = ({ color, size }: { color: string; size: number }) => <Pill color={color} size={size} />;
const RoutinesIcon = ({ color, size }: { color: string; size: number }) => <ListChecks color={color} size={size} />;
const HistoryIcon = ({ color, size }: { color: string; size: number }) => <Clock color={color} size={size} />;
const ProfileIcon = ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />;
const FontTestIcon = ({ color, size }: { color: string; size: number }) => <Type color={color} size={size} />;

export default function BottomTabs() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
          borderTopColor: isDark ? '#333333' : '#E0E0E0',
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
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
      <Tab.Screen
        name="Fonts"
        component={FontTestScreen}
        options={{ tabBarIcon: FontTestIcon }}
      />
    </Tab.Navigator>
  );
}
