
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { LostFoundItem } from '../types';
import Icon from './Icon';
import ImageViewer from './ImageViewer';

interface ItemCardProps {
  item: LostFoundItem;
  onPress: () => void;
}

export default function ItemCard({ item, onPress }: ItemCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    return item.status === 'resolved' ? colors.success : colors.accent;
  };

  const getTypeIcon = () => {
    return item.type === 'lost' ? 'search' : 'checkmark-circle';
  };

  const getTypeColor = () => {
    return item.type === 'lost' ? colors.error : colors.success;
  };

  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Icon 
            name={getTypeIcon()} 
            size={16} 
            color={getTypeColor()} 
          />
          <Text style={[styles.typeText, { color: getTypeColor() }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
      
      {item.imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        </View>
      )}
      
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Icon name="location" size={14} color={colors.textSecondary} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.backgroundAlt,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  imageContainer: {
    marginBottom: 12,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
});
