import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../store/theme-store';
import { Settings, CheckCircle2 } from 'lucide-react-native';
import { database } from '../database';
import Medicine from '../database/models/Medicine';
import withObservables from '@nozbe/with-observables';
import { logMedicineAction } from '../database/helpers/history';
import { updateInventory } from '../database/helpers/medicine';

import HistoryLog from '../database/models/HistoryLogs';
import { Q } from '@nozbe/watermelondb';

const DashboardMedicineItem = ({ medicine, logs, isDark }: { medicine: Medicine; logs: HistoryLog[]; isDark: boolean }) => {
  const [taken, setTaken] = useState(false);
  
  useEffect(() => {
    // Check if there is a 'taken' log for today
    const today = new Date();
    const takenToday = logs.some(log => {
      const logDate = new Date(log.timestamp);
      return log.status === 'taken' && 
             logDate.getDate() === today.getDate() && 
             logDate.getMonth() === today.getMonth() && 
             logDate.getFullYear() === today.getFullYear();
    });
    setTaken(takenToday);
  }, [logs]);

  const textColor = isDark ? 'text-white' : 'text-zinc-900';
  const cardBgColor = isDark ? 'bg-zinc-900' : 'bg-zinc-100';

  const handleTake = async () => {
    if (taken) return;
    try {
      // Logic: log history, update inventory
      await logMedicineAction(medicine.id, medicine.profile.id || '1', medicine.schedule?.time || '00:00', 'taken');
      await updateInventory(medicine.id, 1);
      setTaken(true);
      Alert.alert('Success', `You took ${medicine.name}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl ${cardBgColor}`}>
      <View className="flex-1">
        <Text className={`text-lg font-semibold ${textColor}`}>{medicine.name}</Text>
        <Text className={`text-sm mt-1 text-primary-500 font-medium`}>
          Scheduled: {medicine.schedule?.time || 'Anytime'}
        </Text>
        <Text className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {medicine.dosage}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={handleTake} 
        disabled={taken}
        className={`p-2 rounded-full ${taken ? 'bg-green-500/20' : 'bg-primary-500/10'}`}
      >
        <CheckCircle2 size={28} color={taken ? '#10b981' : '#7C3AED'} />
      </TouchableOpacity>
    </View>
  );
};

const EnhancedDashboardMedicineItem = withObservables(['medicine'], ({ medicine }) => ({
  medicine: medicine.observe(),
  logs: medicine.historyLogs.observe(),
}))(DashboardMedicineItem);


const DashboardScreen = ({ medicines }: { medicines: Medicine[] }) => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
          <Settings size={20} color={isDark ? '#E2E2E2' : '#1F1F1F'} onPress={toggleTheme} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} className="flex-1 px-4">
        <Text className={`text-xl font-bold mb-4 mt-2 ${isDark ? 'text-white' : 'text-black'}`}>Today's Medicines</Text>
        
        {medicines.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className={`text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>No medicines scheduled for today.</Text>
          </View>
        ) : (
          medicines.map((med) => (
            <EnhancedDashboardMedicineItem key={med.id} medicine={med} isDark={isDark} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});

export default withObservables([], () => ({
  medicines: database.collections.get<Medicine>('medicines').query().observe(),
}))(DashboardScreen);