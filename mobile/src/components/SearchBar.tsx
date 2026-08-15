import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function SearchBar({ placeholder = "Search for products..." }: { placeholder?: string }) {
  const navigation = useNavigation();
  const [isListening, setIsListening] = useState(false);

  const handleMicPress = () => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          // @ts-ignore
          navigation.navigate('SearchScreen', { initialQuery: transcript });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          // Fallback if mic fails
          // @ts-ignore
          navigation.navigate('SearchScreen', { initialQuery: 'laptops' });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        // Fallback for browsers without speech support
        // @ts-ignore
        navigation.navigate('SearchScreen', { initialQuery: 'smartphones' });
      }
    } else {
      // Mock for native platforms without speech package installed
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        // @ts-ignore
        navigation.navigate('SearchScreen', { initialQuery: 'headphones' });
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('SearchScreen' as never)}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.icon} />
        <Text style={styles.inputText}>{placeholder}</Text>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleMicPress}>
          <MaterialIcons name={isListening ? "mic" : "mic-none"} size={24} color={isListening ? colors.error : colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CameraSearch' as never)}>
          <Ionicons name="camera-outline" size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: spacing.sm,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: colors.textMuted,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
