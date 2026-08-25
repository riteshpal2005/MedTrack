import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Trash2 } from 'lucide-react-native';
import { useThemeStore } from '../store/theme-store';
import { database } from '../database';
import Medicine from '../database/models/Medicine';
import { deleteMedicine } from '../database/helpers/medicine';
import withObservables from '@nozbe/with-observables';
import { RootStackParamList } from '../navigation/root-navigator';

const MedicineItem = ({ medicine, isDark }: { medicine: Medicine; isDark: boolean }) => {
  const textColor = isDark ? 'text-white' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const cardBgColor = isDark ? 'bg-zinc-900' : 'bg-zinc-100';

  const handleDelete = () => {
    Alert.alert('Delete Medicine', `Are you sure you want to delete ${medicine.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMedicine(medicine.id) },
    ]);
  };

  return (
    <View className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl ${cardBgColor}`}>
      <View className="flex-1">
        <Text className={`text-lg font-semibold ${textColor}`}>{medicine.name}</Text>
        <Text className={`text-sm mt-1 ${subTextColor}`}>
          {medicine.dosage} • {medicine.inventoryCount} left
        </Text>
        {medicine.schedule && medicine.schedule.time && (
          <Text className={`text-sm mt-1 text-primary-500 font-medium`}>
            Schedule: {medicine.schedule.time}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={handleDelete} className="p-2 bg-red-500/10 rounded-full">
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

const EnhancedMedicineItem = withObservables(['medicine'], ({ medicine }) => ({
  medicine: medicine.observe(),
}))(MedicineItem);

const MedicationsScreen = ({ medicines }: { medicines: Medicine[] }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const bgColor = isDark ? 'bg-zinc-950' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-zinc-900';

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="px-4 py-3">
        <Text className={`text-2xl font-bold ${textColor}`}>Medicines</Text>
      </View>
      
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EnhancedMedicineItem medicine={item} isDark={isDark} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className={`text-lg ${textColor}`}>No medicines added yet.</Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Tap the + button to add your first medicine.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('ManageMedicine', {})}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={32} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default withObservables([], () => ({
  medicines: database.collections.get<Medicine>('medicines').query().observe(),
}))(MedicationsScreen);
