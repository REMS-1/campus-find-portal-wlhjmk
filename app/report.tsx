
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { LostFoundItem } from '../types';
import { useStorage } from '../hooks/useStorage';
import { categories, locations } from '../data/mockData';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function ReportScreen() {
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Main Library');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactInfo, setContactInfo] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addItem } = useStorage();

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !contactInfo.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem: LostFoundItem = {
        id: Date.now().toString(),
        type: itemType,
        title: title.trim(),
        category,
        description: description.trim(),
        location,
        date,
        contactInfo: contactInfo.trim(),
        imageUri,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      await addItem(newItem);
      
      Alert.alert(
        'Success',
        `Your ${itemType} item has been reported successfully!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting item:', error);
      Alert.alert('Error', 'Failed to submit item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>Report Item</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={commonStyles.tabContainer}>
          <TouchableOpacity
            style={[commonStyles.tab, itemType === 'lost' && commonStyles.activeTab]}
            onPress={() => setItemType('lost')}
          >
            <Text style={[commonStyles.tabText, itemType === 'lost' && commonStyles.activeTabText]}>
              Lost Item
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[commonStyles.tab, itemType === 'found' && commonStyles.activeTab]}
            onPress={() => setItemType('found')}
          >
            <Text style={[commonStyles.tabText, itemType === 'found' && commonStyles.activeTabText]}>
              Found Item
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Item Name *</Text>
          <TextInput
            style={commonStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., iPhone 14 Pro, Blue Backpack"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.slice(1).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.activeCategoryChip,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.activeCategoryChipText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={commonStyles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Provide detailed description including color, size, distinctive features..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {locations.slice(1).map((loc) => (
              <TouchableOpacity
                key={loc}
                style={[
                  styles.categoryChip,
                  location === loc && styles.activeCategoryChip,
                ]}
                onPress={() => setLocation(loc)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    location === loc && styles.activeCategoryChipText,
                  ]}
                >
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Date</Text>
          <TextInput
            style={commonStyles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Contact Information *</Text>
          <TextInput
            style={commonStyles.input}
            value={contactInfo}
            onChangeText={setContactInfo}
            placeholder="Email or phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
            <Icon name="camera" size={24} color={colors.primary} />
            <Text style={styles.imageButtonText}>
              {imageUri ? 'Change Photo' : 'Add Photo (Optional)'}
            </Text>
          </TouchableOpacity>

          <Button
            text={isSubmitting ? 'Submitting...' : `Report ${itemType === 'lost' ? 'Lost' : 'Found'} Item`}
            onPress={handleSubmit}
            style={[buttonStyles.primary, { marginTop: 20, marginBottom: 40 }]}
            textStyle={{ color: colors.backgroundAlt }}
          />
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
  form: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  activeCategoryChipText: {
    color: colors.backgroundAlt,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    marginTop: 16,
  },
  imageButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});
