import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function CameraSearchScreen() {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = () => {
    setIsScanning(true);
    
    // Simulate ML Image Analysis API call
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulated extracted keywords from computer vision model
      const simulatedExtractedTags = "shoes sneaker sports footwear";
      
      // Navigate to the ML Text Search screen with these keywords
      // @ts-ignore
      navigation.replace('SearchScreen', { initialQuery: simulatedExtractedTags });
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visual Search</Text>
        <TouchableOpacity>
          <Ionicons name="flash-outline" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder Simulation */}
      <View style={styles.viewfinderContainer}>
        {isScanning ? (
           <View style={styles.scanningOverlay}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={styles.scanningText}>Analyzing image...</Text>
             <Text style={styles.scanningSubtext}>Finding exact or similar matches</Text>
           </View>
        ) : (
           <View style={styles.focusFrame}>
             {/* Frame Corners */}
             <View style={[styles.corner, styles.topLeft]} />
             <View style={[styles.corner, styles.topRight]} />
             <View style={[styles.corner, styles.bottomLeft]} />
             <View style={[styles.corner, styles.bottomRight]} />
             
             <Text style={styles.instructionText}>Point your camera at a product</Text>
           </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <MaterialIcons name="photo-library" size={24} color={colors.surface} />
          <Text style={styles.btnText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity 
           style={styles.captureBtnOuter}
           onPress={handleCapture}
           disabled={isScanning}
        >
          <View style={styles.captureBtnInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn}>
          <Ionicons name="barcode-outline" size={24} color={colors.surface} />
          <Text style={styles.btnText}>Barcode</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Black for camera background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    zIndex: 10,
  },
  headerTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111', // Slightly off-black to represent viewfinder
  },
  focusFrame: {
    width: 250,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 200,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanningOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scanningText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.lg,
  },
  scanningSubtext: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.sm,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: spacing.xxl,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  captureBtnOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF',
  },
  secondaryBtn: {
    alignItems: 'center',
    width: 60,
  },
  btnText: {
    color: colors.surface,
    fontSize: 12,
    marginTop: 4,
  }
});
