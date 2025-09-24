
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { LostFoundItem, TabType, FilterOptions } from '../types';
import { useStorage } from '../hooks/useStorage';
import { useAuth } from '../contexts/AuthContext';
import { mockItems } from '../data/mockData';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import FilterSheet from '../components/FilterSheet';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('lost');
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostFoundItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All Categories',
    location: 'All Locations',
    dateRange: 'All Time',
  });
  const [refreshing, setRefreshing] = useState(false);

  const { loadItems } = useStorage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadAllItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, activeTab, searchQuery, filters]);

  const loadAllItems = async () => {
    try {
      const storedItems = await loadItems();
      // Combine stored items with mock data, prioritizing stored items
      const allItems = [...mockItems, ...storedItems];
      // Remove duplicates based on ID
      const uniqueItems = allItems.filter((item, index, self) => 
        index === self.findIndex(i => i.id === item.id)
      );
      setItems(uniqueItems);
      console.log('All items loaded:', uniqueItems.length);
    } catch (error) {
      console.error('Error loading items:', error);
      setItems(mockItems);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by tab type
    if (activeTab === 'my-items') {
      filtered = filtered.filter(item => item.userId === user?.id);
    } else {
      filtered = filtered.filter(item => item.type === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.category !== 'All Categories') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by location
    if (filters.location !== 'All Locations') {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    setFilteredItems(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllItems();
    setRefreshing(false);
  };

  const handleItemPress = (item: LostFoundItem) => {
    router.push(`/item/${item.id}`);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'lost':
        return 'Lost Items';
      case 'found':
        return 'Found Items';
      case 'my-items':
        return 'My Items';
      default:
        return 'Items';
    }
  };

  const getEmptyMessage = () => {
    if (searchQuery.trim()) {
      return 'No items match your search';
    }
    switch (activeTab) {
      case 'lost':
        return 'No lost items reported yet';
      case 'found':
        return 'No found items reported yet';
      case 'my-items':
        return 'You haven\'t reported any items yet';
      default:
        return 'No items found';
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={commonStyles.title}>Lost & Found</Text>
            <Text style={commonStyles.textSecondary}>
              {user ? `Welcome back, ${user.name}!` : 'Help reunite people with their belongings'}
            </Text>
          </View>
          {user ? (
            <TouchableOpacity
              onPress={signOut}
              style={{
                backgroundColor: colors.backgroundAlt,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: colors.backgroundAlt, fontSize: 12, fontWeight: '600' }}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
        />

        {/* Filter and Report Buttons */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.backgroundAlt,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginRight: 12,
              flex: 1,
            }}
            onPress={() => setIsFilterSheetVisible(true)}
          >
            <Icon name="filter" size={18} color={colors.primary} />
            <Text style={{ marginLeft: 8, color: colors.text, fontWeight: '500' }}>
              Filter
            </Text>
          </TouchableOpacity>

          <Button
            text="Report Item"
            onPress={() => user ? router.push('/report') : router.push('/auth/login')}
            style={[buttonStyles.primary, { flex: 1 }]}
            textStyle={{ color: colors.backgroundAlt }}
          />
        </View>

        {/* Tabs */}
        <View style={commonStyles.tabContainer}>
          <TouchableOpacity
            style={[commonStyles.tab, activeTab === 'lost' && commonStyles.activeTab]}
            onPress={() => setActiveTab('lost')}
          >
            <Text style={[commonStyles.tabText, activeTab === 'lost' && commonStyles.activeTabText]}>
              Lost
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[commonStyles.tab, activeTab === 'found' && commonStyles.activeTab]}
            onPress={() => setActiveTab('found')}
          >
            <Text style={[commonStyles.tabText, activeTab === 'found' && commonStyles.activeTabText]}>
              Found
            </Text>
          </TouchableOpacity>
          {user && (
            <TouchableOpacity
              style={[commonStyles.tab, activeTab === 'my-items' && commonStyles.activeTab]}
              onPress={() => setActiveTab('my-items')}
            >
              <Text style={[commonStyles.tabText, activeTab === 'my-items' && commonStyles.activeTabText]}>
                My Items
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Items List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))
          ) : (
            <View style={[commonStyles.centerContent, { paddingVertical: 60 }]}>
              <Icon 
                name={activeTab === 'lost' ? 'search' : activeTab === 'found' ? 'checkmark-circle' : 'list'} 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                {getEmptyMessage()}
              </Text>
              {!searchQuery.trim() && (
                <Button
                  text="Report an Item"
                  onPress={() => user ? router.push('/report') : router.push('/auth/login')}
                  style={[buttonStyles.outline, { marginTop: 20 }]}
                  textStyle={{ color: colors.primary }}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Filter Sheet */}
      <FilterSheet
        isVisible={isFilterSheetVisible}
        onClose={() => setIsFilterSheetVisible(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </SafeAreaView>
  );
}
