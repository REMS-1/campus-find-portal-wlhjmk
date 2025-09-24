
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../../styles/commonStyles';
import { LostFoundItem } from '../../types';
import { useStorage } from '../../hooks/useStorage';
import { mockItems } from '../../data/mockData';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadItems, updateItem } = useStorage();

  useEffect(() => {
    loadItemDetails();
  }, [id]);

  const loadItemDetails = async () => {
    try {
      const items = await loadItems();
      let foundItem = items.find(item => item.id === id);
      
      // Fallback to mock data if not found in storage
      if (!foundItem) {
        foundItem = mockItems.find(item => item.id === id);
      }
      
      setItem(foundItem || null);
      console.log('Item loaded:', foundItem?.title);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!item?.contactInfo) return;

    const isEmail = item.contactInfo.includes('@');
    const url = isEmail ? `mailto:${item.contactInfo}` : `tel:${item.contactInfo}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open contact method');
    });
  };

  const handleMarkResolved = async () => {
    if (!item) return;

    Alert.alert(
      'Mark as Resolved',
      'Are you sure you want to mark this item as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await updateItem(item.id, { status: 'resolved' });
              setItem({ ...item, status: 'resolved' });
              Alert.alert('Success', 'Item marked as resolved!');
            } catch (error) {
              console.error('Error updating item:', error);
              Alert.alert('Error', 'Failed to update item status');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={[commonStyles.container, commonStyles.centerContent]}>
        <Text style={commonStyles.text}>Item not found</Text>
        <Button
          text="Go Back"
          onPress={() => router.back()}
          style={buttonStyles.primary}
          textStyle={{ color: colors.backgroundAlt }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>Item Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.card, styles.mainCard]}>
          <View style={styles.itemHeader}>
            <View style={styles.typeContainer}>
              <Icon 
                name={item.type === 'lost' ? 'search' : 'checkmark-circle'} 
                size={20} 
                color={item.type === 'lost' ? colors.error : colors.success} 
              />
              <Text style={[styles.typeText, { color: item.type === 'lost' ? colors.error : colors.success }]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { 
              backgroundColor: item.status === 'resolved' ? colors.success : colors.accent 
            }]}>
              <Text style={styles.statusText}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <Icon name="location" size={18} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={18} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Icon name="mail" size={18} color={colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Contact</Text>
              <Text style={styles.detailValue}>{item.contactInfo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            text="Contact Owner"
            onPress={handleContact}
            style={[buttonStyles.primary, { flex: 1, marginRight: 8 }]}
            textStyle={{ color: colors.backgroundAlt }}
          />
          
          {item.status === 'active' && (
            <Button
              text="Mark Resolved"
              onPress={handleMarkResolved}
              style={[buttonStyles.secondary, { flex: 1, marginLeft: 8 }]}
              textStyle={{ color: colors.backgroundAlt }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  mainCard: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 40,
  },
});
