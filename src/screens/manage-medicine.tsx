import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../store/theme-store';
import { addMedicine } from '../database/helpers/medicine';

export default function ManageMedicineScreen() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [inventoryCount, setInventoryCount] = useState('0');
  const [warningLevel, setWarningLevel] = useState('0');
  const [scheduleTime, setScheduleTime] = useState('09:00'); // Simple HH:mm for MVP
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      // Hardcoded profileId '1' for MVP since we don't have multi-profile yet
      await addMedicine({
        profileId: '1',
        name,
        dosage,
        inventoryCount: parseInt(inventoryCount, 10) || 0,
        warningLevel: parseInt(warningLevel, 10) || 0,
        schedule: { time: scheduleTime },
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save medicine:', error);
    } finally {
      setLoading(false);
    }
  };

  const textColor = isDark ? 'text-white' : 'text-zinc-900';
  const bgColor = isDark ? 'bg-zinc-950' : 'bg-white';
  const inputBgColor = isDark ? 'bg-zinc-900' : 'bg-zinc-100';
  const placeholderColor = isDark ? '#a1a1aa' : '#71717a';

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2 rounded-full"
        >
          <ArrowLeft size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${textColor}`}>
          Add Medicine
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading || !name.trim()}
          className="p-2 -mr-2 rounded-full"
        >
          <Check size={24} color={name.trim() ? '#10b981' : placeholderColor} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-2">
        <View className="mb-6">
          <Text className={`mb-2 text-sm font-medium ${textColor}`}>
            Medicine Name *
          </Text>
          <TextInput
            className={`px-4 py-3 rounded-xl text-base ${inputBgColor} ${textColor}`}
            placeholder="e.g. Paracetamol"
            placeholderTextColor={placeholderColor}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-6">
          <Text className={`mb-2 text-sm font-medium ${textColor}`}>
            Dosage
          </Text>
          <TextInput
            className={`px-4 py-3 rounded-xl text-base ${inputBgColor} ${textColor}`}
            placeholder="e.g. 500mg"
            placeholderTextColor={placeholderColor}
            value={dosage}
            onChangeText={setDosage}
          />
        </View>

        <View className="mb-6">
          <Text className={`mb-2 text-sm font-medium ${textColor}`}>
            Schedule Time (HH:MM)
          </Text>
          <TextInput
            className={`px-4 py-3 rounded-xl text-base ${inputBgColor} ${textColor}`}
            placeholder="09:00"
            placeholderTextColor={placeholderColor}
            value={scheduleTime}
            onChangeText={setScheduleTime}
          />
        </View>

        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1">
            <Text className={`mb-2 text-sm font-medium ${textColor}`}>
              Inventory Count
            </Text>
            <TextInput
              className={`px-4 py-3 rounded-xl text-base ${inputBgColor} ${textColor}`}
              placeholder="0"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
              value={inventoryCount}
              onChangeText={setInventoryCount}
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className={`mb-2 text-sm font-medium ${textColor}`}>
              Warning Level
            </Text>
            <TextInput
              className={`px-4 py-3 rounded-xl text-base ${inputBgColor} ${textColor}`}
              placeholder="0"
              placeholderTextColor={placeholderColor}
              keyboardType="numeric"
              value={warningLevel}
              onChangeText={setWarningLevel}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
