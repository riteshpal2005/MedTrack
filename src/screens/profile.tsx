import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../store/theme-store';
import { database } from '../database';
import HealthRecord from '../database/models/HealthRecord';
import withObservables from '@nozbe/with-observables';
import { addHealthRecords } from '../database/helpers/healthRecord';
import { FileText, Plus } from 'lucide-react-native';

const HealthRecordItem = ({ record, isDark }: { record: HealthRecord; isDark: boolean }) => {
  const textColor = isDark ? 'text-white' : 'text-zinc-900';
  const cardBgColor = isDark ? 'bg-zinc-900' : 'bg-zinc-100';

  return (
    <View className={`flex-row p-4 mb-3 rounded-2xl ${cardBgColor}`}>
      <FileText size={24} color="#7C3AED" className="mr-3 mt-1" />
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-500'}`}>
          {record.type.toUpperCase()} • {new Date(record.createdAt).toLocaleDateString()}
        </Text>
        <Text className={`text-base mt-2 ${textColor}`}>
          {record.notes}
        </Text>
      </View>
    </View>
  );
};

const EnhancedHealthRecordItem = withObservables(['record'], ({ record }) => ({
  record: record.observe(),
}))(HealthRecordItem);

const ProfileScreen = ({ records }: { records: HealthRecord[] }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [note, setNote] = useState('');
  
  const bgColor = isDark ? 'bg-zinc-950' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-zinc-900';
  const inputBgColor = isDark ? 'bg-zinc-900' : 'bg-zinc-100';

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      await addHealthRecords('1', 'Note', note);
      setNote('');
    } catch {
      Alert.alert('Error', 'Failed to save record.');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="px-4 py-3">
        <Text className={`text-2xl font-bold ${textColor}`}>Health Records</Text>
      </View>
      
      <View className="px-4 mb-4 flex-row items-center">
        <TextInput
          className={`flex-1 px-4 py-3 rounded-xl mr-2 text-base ${inputBgColor} ${textColor}`}
          placeholder="Add a medical note or symptom..."
          placeholderTextColor={isDark ? '#a1a1aa' : '#71717a'}
          value={note}
          onChangeText={setNote}
        />
        <TouchableOpacity 
          onPress={handleAddNote}
          className="w-12 h-12 bg-primary-500 rounded-xl items-center justify-center"
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EnhancedHealthRecordItem record={item} isDark={isDark} />}
        contentContainerClassName="p-4 pb-24"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className={`text-lg ${textColor}`}>No records found.</Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Save your symptoms or doctor notes here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default withObservables([], () => ({
  records: database.collections.get<HealthRecord>('health_records').query().observe(),
}))(ProfileScreen);
