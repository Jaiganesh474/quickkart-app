import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import ConfirmModal from '../components/ConfirmModal';

interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

export default function ManageDevicesScreen() {
  const navigation = useNavigation();
  
  const [sessions, setSessions] = useState<DeviceSession[]>([
    {
      id: '1',
      deviceName: 'QuickKart App - iPhone',
      deviceType: 'mobile',
      location: 'Chennai, India',
      lastActive: 'Active now',
      isCurrentDevice: true,
    },
    {
      id: '2',
      deviceName: 'Windows PC - Chrome Web',
      deviceType: 'desktop',
      location: 'Chennai, India',
      lastActive: '2 hours ago',
      isCurrentDevice: false,
    },
    {
      id: '3',
      deviceName: 'iPad Air - Safari',
      deviceType: 'tablet',
      location: 'Bangalore, India',
      lastActive: 'Yesterday',
      isCurrentDevice: false,
    }
  ]);

  const dispatch = useDispatch();
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [deviceToLogout, setDeviceToLogout] = useState<{id: string, name: string, isCurrent: boolean} | null>(null);
  const [isLogoutAll, setIsLogoutAll] = useState(false);

  const confirmLogoutDevice = (id: string, name: string, isCurrent: boolean = false) => {
    setIsLogoutAll(false);
    setDeviceToLogout({ id, name, isCurrent });
    setModalVisible(true);
  };

  const confirmLogoutAll = () => {
    setIsLogoutAll(true);
    setDeviceToLogout(null);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (isLogoutAll) {
      setSessions(prev => prev.filter(s => s.isCurrentDevice));
    } else if (deviceToLogout) {
      if (deviceToLogout.isCurrent) {
        setModalVisible(false);
        // Clear JWT token and redirect to login automatically via Redux state
        dispatch(logout());
        return;
      } else {
        setSessions(prev => prev.filter(s => s.id !== deviceToLogout.id));
      }
    }
    setModalVisible(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return 'phone-portrait-outline';
      case 'desktop': return 'desktop-outline';
      case 'tablet': return 'tablet-landscape-outline';
      default: return 'hardware-chip-outline';
    }
  };

  const currentDevice = sessions.find(s => s.isCurrentDevice);
  const otherDevices = sessions.filter(s => !s.isCurrentDevice);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Devices</Text>
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>CURRENT DEVICE</Text>
        {currentDevice && (
          <View style={[styles.deviceCard, styles.currentDeviceCard]}>
            <View style={styles.deviceIconBg}>
              <Ionicons name={getDeviceIcon(currentDevice.deviceType) as any} size={28} color={colors.primary} />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{currentDevice.deviceName}</Text>
              <Text style={styles.deviceLocation}>{currentDevice.location} • {currentDevice.lastActive}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Maintained Session</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.logoutBtn, { borderColor: colors.error }]} 
                  onPress={() => confirmLogoutDevice(currentDevice.id, currentDevice.deviceName, true)}
                >
                  <Text style={[styles.logoutBtnText, { color: colors.error }]}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.otherDevicesHeader}>
          <Text style={styles.sectionHeader}>OTHER DEVICES ({otherDevices.length})</Text>
        </View>

        {otherDevices.length > 0 ? (
          otherDevices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={[styles.deviceIconBg, { backgroundColor: '#f0f0f0' }]}>
                <Ionicons name={getDeviceIcon(device.deviceType) as any} size={28} color={colors.textMuted} />
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.deviceName}</Text>
                <Text style={styles.deviceLocation}>{device.location} • {device.lastActive}</Text>
                <TouchableOpacity 
                  style={styles.logoutBtn} 
                  onPress={() => confirmLogoutDevice(device.id, device.deviceName)}
                >
                  <Text style={styles.logoutBtnText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.success} />
            <Text style={styles.emptyText}>No other active sessions.</Text>
          </View>
        )}

        {otherDevices.length > 0 && (
          <TouchableOpacity style={styles.logoutAllBtn} onPress={confirmLogoutAll}>
            <Ionicons name="log-out-outline" size={20} color={colors.surface} style={{ marginRight: spacing.sm }} />
            <Text style={styles.logoutAllText}>Log Out From All Other Devices</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmModal 
        visible={isModalVisible}
        title={isLogoutAll ? "Log Out All Devices" : "Log Out Device"}
        message={isLogoutAll 
          ? "Are you sure you want to log out from all other active sessions?" 
          : `Are you sure you want to log out from ${deviceToLogout?.name}?`}
        confirmText="Log Out"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 18, fontWeight: '600', color: colors.text },
  scrollContent: { padding: spacing.md },
  sectionHeader: { fontSize: 13, fontWeight: 'bold', color: colors.textMuted, marginBottom: spacing.md, marginTop: spacing.sm, letterSpacing: 0.5 },
  otherDevicesHeader: { marginTop: spacing.xl },
  deviceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentDeviceCard: {
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)', // Subtle green border
  },
  deviceIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 144, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  logoutBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  logoutAllBtn: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  logoutAllText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  emptyText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 15,
  }
});
