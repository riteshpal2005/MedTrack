import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;

// Utility functions for dynamic sizing based on screen width/height
export const wp = (percentage: number) => {
  return (percentage * screenWidth) / 100;
};

export const hp = (percentage: number) => {
  return (percentage * screenHeight) / 100;
};
