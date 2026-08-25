import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../store/theme-store';
import { database } from '../database';
import HistoryLog from '../database/models/HistoryLogs';
import withObservables from '@nozbe/with-observables';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react-native';

const HistoryItem = ({ log, isDark }: { log: HistoryLog; isDark: boolean }) => {
  const textColor = isDark ? 'text-white' : 'text-zinc-900';
  const cardBgColor = isDark ? 'bg-zinc-900' : 'bg-zinc-100';

  const getStatusIcon = () => {
    switch(log.status) {
      case 'taken': return <CheckCircle2 size={24} color="#10b981" />;
      case 'missed': return <XCircle size={24} color="#ef4444" />;
      case 'skipped': return <AlertCircle size={24} color="#f59e0b" />;
      default: return null;
    }
  };

  return (
    <View className={`flex-row items-center justify-between p-4 mb-3 rounded-2xl ${cardBgColor}`}>
      <View className="flex-1">
        <Text className={`text-lg font-semibold ${textColor}`}>Medicine ID: {log.medicine.id}</Text>
        <Text className={`text-sm mt-1 text-primary-500 font-medium`}>
          Scheduled: {log.scheduledTime}
        </Text>
        <Text className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Logged: {new Date(log.timestamp).toLocaleString()}
        </Text>
      </View>
      <View className="ml-4">
        {getStatusIcon()}
      </View>
    </View>
  );
};

const EnhancedHistoryItem = withObservables(['log'], ({ log }) => ({
  log: log.observe(),
}))(HistoryItem);

const HistoryScreen = ({ logs }: { logs: HistoryLog[] }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? 'bg-zinc-950' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-zinc-900';

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="px-4 py-3">
        <Text className={`text-2xl font-bold ${textColor}`}>History</Text>
      </View>
      
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EnhancedHistoryItem log={item} isDark={isDark} />}
        contentContainerClassName="p-4 pb-24"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Text className={`text-lg ${textColor}`}>No history logs yet.</Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Your taken or missed medicines will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default withObservables([], () => ({
  logs: database.collections.get<HistoryLog>('history_logs').query().observe(),
}))(HistoryScreen);
