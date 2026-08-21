import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ITEM_HEIGHT = 50;

interface WheelPickerProps {
  items: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

function WheelPicker({ items, selectedValue, onValueChange }: WheelPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const paddedItems = ['', ...items, ''];

  useEffect(() => {
    const index = items.indexOf(selectedValue);
    if (index >= 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  }, [selectedValue, items]);

  const handleScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    
    if (index >= 0 && index < items.length) {
      const newValue = items[index];
      if (newValue !== selectedValue) {
        ReactNativeHapticFeedback.trigger('impactLight');
        onValueChange(newValue);
      }
    }
  };

  return (
    <View style={styles.wheelContainer} className="bg-surface-variant rounded-2xl">
      <View style={styles.highlightBar} className="bg-primary/10 border-y border-primary/20" />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {paddedItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text className={`text-2xl font-bold ${item === selectedValue ? 'text-primary' : 'text-on-surface/40'}`}>
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

interface CustomTimePickerProps {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
  onHourChange: (h: string) => void;
  onMinuteChange: (m: string) => void;
  onPeriodChange: (p: 'AM' | 'PM') => void;
}

export default function CustomTimePicker({ hour, minute, period, onHourChange, onMinuteChange, onPeriodChange }: CustomTimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  return (
    <View className="flex-row justify-center space-x-2 h-[150px]">
      <View className="flex-1">
        <WheelPicker items={hours} selectedValue={hour} onValueChange={onHourChange} />
      </View>
      <View className="justify-center items-center pb-2">
        <Text className="text-3xl font-bold text-on-surface/50">:</Text>
      </View>
      <View className="flex-1">
        <WheelPicker items={minutes} selectedValue={minute} onValueChange={onMinuteChange} />
      </View>
      <View className="flex-1">
        <WheelPicker items={periods} selectedValue={period} onValueChange={(p) => onPeriodChange(p as 'AM' | 'PM')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wheelContainer: {
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightBar: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingVertical: 0,
  },
});
