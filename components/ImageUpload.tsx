
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, Platform, ActionSheetIOS } from 'react-native';
import { colors } from '../styles/commonStyles';
import { requestPermissions, pickImageFromLibrary, takePhotoWithCamera, validateImageUri } from '../utils/imageUtils';
import Icon from './Icon';

interface ImageUploadProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  onImageRemoved: () => void;
  style?: any;
}

export default function ImageUpload({ imageUri, onImageSelected, onImageRemoved, style }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicker = async () => {
    try {
      setIsLoading(true);
      
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        return;
      }

      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Take Photo', 'Choose from Library'],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              openCamera();
            } else if (buttonIndex === 2) {
              openImageLibrary();
            }
          }
        );
      } else {
        Alert.alert(
          'Select Image',
          'Choose an option',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Take Photo', onPress: openCamera },
            { text: 'Choose from Library', onPress: openImageLibrary },
          ]
        );
      }
    } catch (error) {
      console.error('Error in image picker:', error);
      Alert.alert('Error', 'Failed to access image picker');
    } finally {
      setIsLoading(false);
    }
  };

  const openCamera = async () => {
    try {
      const imageUri = await takePhotoWithCamera();
      if (imageUri && validateImageUri(imageUri)) {
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const openImageLibrary = async () => {
    try {
      const imageUri = await pickImageFromLibrary();
      if (imageUri && validateImageUri(imageUri)) {
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onImageRemoved },
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <View style={styles.imageActions}>
            <TouchableOpacity 
              style={styles.imageActionButton} 
              onPress={handleImagePicker}
              disabled={isLoading}
            >
              <Icon name="camera" size={20} color={colors.primary} />
              <Text style={styles.imageActionText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageActionButton} onPress={removeImage}>
              <Icon name="trash" size={20} color={colors.error} />
              <Text style={[styles.imageActionText, { color: colors.error }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={handleImagePicker}
          disabled={isLoading}
        >
          <Icon name="camera" size={32} color={colors.primary} />
          <Text style={styles.uploadButtonText}>
            {isLoading ? 'Loading...' : 'Add Photo'}
          </Text>
          <Text style={styles.uploadButtonSubtext}>
            Take a photo or choose from library
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 12,
  },
  uploadButtonSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  imageActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageActionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 6,
  },
});
