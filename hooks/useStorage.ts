
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LostFoundItem } from '../types';

const ITEMS_KEY = 'lost_found_items';

export const useStorage = () => {
  const saveItems = async (items: LostFoundItem[]) => {
    try {
      await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
      console.log('Items saved successfully');
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };

  const loadItems = async (): Promise<LostFoundItem[]> => {
    try {
      const itemsJson = await AsyncStorage.getItem(ITEMS_KEY);
      if (itemsJson) {
        const items = JSON.parse(itemsJson);
        console.log('Items loaded successfully:', items.length);
        return items;
      }
      console.log('No items found in storage');
      return [];
    } catch (error) {
      console.error('Error loading items:', error);
      return [];
    }
  };

  const addItem = async (item: LostFoundItem) => {
    try {
      const existingItems = await loadItems();
      const updatedItems = [...existingItems, item];
      await saveItems(updatedItems);
      console.log('Item added successfully:', item.title);
      return updatedItems;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateItem = async (itemId: string, updates: Partial<LostFoundItem>) => {
    try {
      const existingItems = await loadItems();
      const updatedItems = existingItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      await saveItems(updatedItems);
      console.log('Item updated successfully:', itemId);
      return updatedItems;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const existingItems = await loadItems();
      const updatedItems = existingItems.filter(item => item.id !== itemId);
      await saveItems(updatedItems);
      console.log('Item deleted successfully:', itemId);
      return updatedItems;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  return {
    saveItems,
    loadItems,
    addItem,
    updateItem,
    deleteItem,
  };
};
