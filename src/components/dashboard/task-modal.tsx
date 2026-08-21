import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Pressable, StyleSheet, Keyboard } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { X, Clock, AlignLeft } from 'lucide-react-native';
import { useRoutineStore, RoutineTask, TaskType } from '../../store/routine-store';
import CustomTimePicker from '../ui/custom-time-picker';
import { Button } from '../ui/button';
import { Heading, Label } from '../ui/typography';
import { useThemeStore } from '../../store/theme-store';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  taskToEdit?: RoutineTask | null;
}

export default function TaskModal({ visible, onClose, taskToEdit }: TaskModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const dynamicStyles = useMemo(() => getStyles(isDark), [isDark]);

  const [title, setTitle] = useState('');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [type, setType] = useState<TaskType>('skincare');
  
  const { addTask, updateTask } = useRoutineStore();

  useEffect(() => {
    if (visible) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        try {
          const [t, p] = taskToEdit.time.split(' ');
          const [h, m] = t.split(':');
          setHour(h);
          setMinute(m);
          setPeriod(p as 'AM' | 'PM');
        } catch {
          setHour('08');
          setMinute('00');
          setPeriod('AM');
        }
        setType(taskToEdit.type);
      } else {
        setTitle('');
        setHour('08');
        setMinute('00');
        setPeriod('AM');
        setType('skincare');
      }
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      Keyboard.dismiss();
    }
  }, [visible, taskToEdit]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    []
  );

  const handleSave = () => {
    if (!title.trim()) return;
    
    const formattedHour = hour.padStart(2, '0');
    const formattedMinute = minute.padStart(2, '0');
    const time = `${formattedHour}:${formattedMinute} ${period}`;

    if (taskToEdit) {
      updateTask(taskToEdit.id, { title, time, type });
    } else {
      addTask({ title, time, type });
    }
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['75%']}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={dynamicStyles.bottomSheetBackground}
      handleIndicatorStyle={dynamicStyles.handleIndicator}
    >
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Heading className="mb-0">
            {taskToEdit ? 'Edit Routine' : 'New Routine'}
          </Heading>
          <Pressable onPress={() => bottomSheetModalRef.current?.dismiss()} className="p-3 bg-surface-variant rounded-full active:scale-95">
            <X size={24} color="#444746" />
          </Pressable>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center mb-1 space-x-2">
            <AlignLeft size={16} color="#444746" style={styles.iconOffset} />
            <Label>Task Name</Label>
          </View>
          <BottomSheetTextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Cleanser & Toner"
            placeholderTextColor="#8e8e8e"
            style={[styles.input, dynamicStyles.inputBackground]}
          />
        </View>

        <View className="mb-10">
          <View className="flex-row items-center mb-3 space-x-2">
            <Clock size={16} color="#444746" style={styles.iconOffset} />
            <Label>Time</Label>
          </View>
          <CustomTimePicker 
            hour={hour}
            minute={minute}
            period={period}
            onHourChange={setHour}
            onMinuteChange={setMinute}
            onPeriodChange={setPeriod}
          />
        </View>

        <View className="flex-1 justify-end pb-8">
          <Button 
            title={taskToEdit ? 'Save Changes' : 'Create Routine'}
            onPress={handleSave}
            size="lg"
          />
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  iconOffset: {
    marginTop: -8,
  },
});

const getStyles = (isDark: boolean) => StyleSheet.create({
  bottomSheetBackground: { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' },
  handleIndicator: { backgroundColor: isDark ? '#444746' : '#E0E0E0' },
  inputBackground: { backgroundColor: isDark ? '#333333' : '#F5F5F5', color: isDark ? '#FFFFFF' : '#000000' },
});
