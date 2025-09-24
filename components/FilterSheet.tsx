
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { categories, locations } from '../data/mockData';
import { FilterOptions } from '../types';
import SimpleBottomSheet from './BottomSheet';
import Button from './Button';

interface FilterSheetProps {
  isVisible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterSheet({ isVisible, onClose, filters, onFiltersChange }: FilterSheetProps) {
  const handleCategorySelect = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleLocationSelect = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      category: 'All Categories',
      location: 'All Locations',
      dateRange: 'All Time',
    });
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={commonStyles.subtitle}>Filter Items</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  filters.category === category && styles.activeFilterChip,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filters.category === category && styles.activeFilterChipText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {locations.map((location) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.filterChip,
                  filters.location === location && styles.activeFilterChip,
                ]}
                onPress={() => handleLocationSelect(location)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filters.location === location && styles.activeFilterChipText,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Clear Filters"
            onPress={handleClearFilters}
            style={[buttonStyles.outline, { marginBottom: 12 }]}
            textStyle={{ color: colors.primary }}
          />
          <Button
            text="Apply Filters"
            onPress={onClose}
            style={buttonStyles.primary}
            textStyle={{ color: colors.backgroundAlt }}
          />
        </View>
      </View>
    </SimpleBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: colors.backgroundAlt,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
