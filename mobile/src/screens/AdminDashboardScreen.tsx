import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Alert, Platform, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { 
  useGetPendingSellersQuery, 
  useApproveSellerMutation,
  useGetBannersQuery,
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation
} from '../services/api';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = React.useState('Sellers');
  
  const { data: pendingSellers, isLoading, refetch } = useGetPendingSellersQuery();
  const [approveSeller, { isLoading: isApproving }] = useApproveSellerMutation();

  const { data: banners, refetch: refetchBanners } = useGetBannersQuery();
  const [addBanner] = useAddBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const { data: categories, refetch: refetchCategories } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isBannerModalVisible, setBannerModalVisible] = React.useState(false);
  const [bannerPrompt, setBannerPrompt] = React.useState('');
  const [isGeneratingBanner, setIsGeneratingBanner] = React.useState(false);

  const handleAddBanner = () => {
    setBannerModalVisible(true);
  };

  const handleGenerateBanner = () => {
    if (!bannerPrompt) {
      Toast.show({ type: 'error', text1: 'Enter a prompt!' });
      return;
    }
    setIsGeneratingBanner(true);
    // Simulate AI Generation time
    setTimeout(() => {
      const safePrompt = encodeURIComponent(bannerPrompt.trim());
      // Pollinations AI provides free, real-time AI image generation via URL!
      const generatedUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=400&nologo=true`;
      
      addBanner({ title: bannerPrompt, imageUrl: generatedUrl, active: true })
        .unwrap()
        .then(() => {
          Toast.show({ type: 'success', text1: 'AI Banner Generated!' });
          refetchBanners();
          setBannerModalVisible(false);
          setBannerPrompt('');
        })
        .finally(() => {
          setIsGeneratingBanner(false);
        });
    }, 2000);
  };

  const handleLocalBanner = () => {
    const url = window.prompt("Enter local banner image URL:");
    if (url) {
      addBanner({ title: "Local Banner", imageUrl: url, active: true })
        .unwrap()
        .then(() => {
          Toast.show({ type: 'success', text1: 'Banner Added' });
          refetchBanners();
          setBannerModalVisible(false);
        });
    }
  };

  const handleAddCategory = () => {
    const name = window.prompt("Enter category name (e.g. Bottoms):");
    if (name) {
      addCategory({ name, iconUrl: 'https://via.placeholder.com/50' })
        .unwrap()
        .then(() => {
          Toast.show({ type: 'success', text1: 'Category Added' });
          refetchCategories();
        });
    }
  };

  const handleApprove = async (id: number, name: string) => {
    try {
      await approveSeller(id).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${name} has been approved as a seller!`
      });
      refetch();
    } catch (e) {
      console.error('Failed to approve', e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to approve seller'
      });
    }
  };

  const renderSellerItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name || 'Unknown User'}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.approveBtn} 
          onPress={() => handleApprove(item.id, item.name)}
          disabled={isApproving}
        >
          <Text style={styles.approveBtnText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <View style={styles.tabContainer}>
        {['Sellers', 'Banners', 'Categories'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'Sellers' && (
          <>
            <Text style={styles.sectionTitle}>Pending Seller Requests</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
            ) : pendingSellers && pendingSellers.length > 0 ? (
              <FlatList
                data={pendingSellers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSellerItem}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.border} />
                <Text style={styles.emptyText}>No pending requests.</Text>
                <Text style={styles.emptySubtext}>All caught up!</Text>
              </View>
            )}
          </>
        )}

        {activeTab === 'Banners' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Banners</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddBanner}>
                <Text style={styles.addButtonText}>+ Add Banner</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={banners}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.userName}>{item.imageUrl}</Text>
                  <TouchableOpacity onPress={() => deleteBanner(item.id).unwrap().then(() => refetchBanners())}>
                    <Text style={{ color: colors.error }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}

        {activeTab === 'Categories' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Categories</Text>
              <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Text style={styles.addButtonText}>+ Add Category</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <TouchableOpacity onPress={() => deleteCategory(item.id).unwrap().then(() => refetchCategories())}>
                    <Text style={{ color: colors.error }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </>
        )}
      </View>

      {/* AI Banner Modal */}
      <Modal visible={isBannerModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Banner</Text>
            
            <View style={styles.bannerOptions}>
              <TouchableOpacity style={styles.bannerOptionBtn} onPress={handleLocalBanner}>
                <Ionicons name="folder-outline" size={24} color={colors.primary} />
                <Text style={styles.bannerOptionText}>Choose Local</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />
            <Text style={styles.modalSubtitle}>Or Generate with AI</Text>
            
            <TextInput
              style={styles.aiInput}
              placeholder="e.g. Flash sales for shoes"
              value={bannerPrompt}
              onChangeText={setBannerPrompt}
            />
            
            <TouchableOpacity 
              style={[styles.aiGenerateBtn, isGeneratingBanner && { opacity: 0.7 }]} 
              onPress={handleGenerateBanner}
              disabled={isGeneratingBanner}
            >
              {isGeneratingBanner ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color={colors.surface} />
                  <Text style={styles.aiGenerateBtnText}>AI Generate</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setBannerModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif' },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  listContainer: {
    padding: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySub: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textMuted,
  },
  cardBody: {
    marginVertical: spacing.sm,
    padding: spacing.sm,
    backgroundColor: '#F9FAFB',
    borderRadius: radius.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 6,
    fontSize: 13,
    color: colors.text,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
  },
  rejectBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectBtnText: {
    color: colors.text,
    fontWeight: '600',
  },
  approveBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: '#4CAF50',
  },
  approveBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  addButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginVertical: spacing.md,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  bannerOptions: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: spacing.sm,
  },
  bannerOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: '#F0F9FF',
  },
  bannerOptionText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  aiInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    width: '100%',
    marginBottom: spacing.md,
  },
  aiGenerateBtn: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  aiGenerateBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  }
});
