import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-95"
      style={styles.shadow}
    >
      <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
