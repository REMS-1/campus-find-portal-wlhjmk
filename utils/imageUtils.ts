
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface ImageUploadOptions {
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
  maxWidth?: number;
  maxHeight?: number;
}

export const defaultImageOptions: ImageUploadOptions = {
  quality: 0.8,
  allowsEditing: true,
  aspect: [4, 3],
  maxWidth: 1024,
  maxHeight: 768,
};

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (mediaStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return false;
    }
    
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

export const pickImageFromLibrary = async (options: ImageUploadOptions = defaultImageOptions): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options.allowsEditing,
      aspect: options.aspect,
      quality: options.quality,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('Image selected from library:', result.assets[0].uri);
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error selecting image from library:', error);
    Alert.alert('Error', 'Failed to select image from library');
    return null;
  }
};

export const takePhotoWithCamera = async (options: ImageUploadOptions = defaultImageOptions): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options.allowsEditing,
      aspect: options.aspect,
      quality: options.quality,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('Photo taken with camera:', result.assets[0].uri);
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error taking photo with camera:', error);
    Alert.alert('Error', 'Failed to take photo');
    return null;
  }
};

export const validateImageUri = (uri: string): boolean => {
  if (!uri || typeof uri !== 'string') {
    return false;
  }
  
  // Check if it's a valid URI format
  const uriPattern = /^(file:\/\/|content:\/\/|https?:\/\/)/;
  return uriPattern.test(uri);
};

export const getImageInfo = async (uri: string): Promise<{ width: number; height: number; size?: number } | null> => {
  try {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
        });
      };
      image.onerror = () => {
        resolve(null);
      };
      image.src = uri;
    });
  } catch (error) {
    console.error('Error getting image info:', error);
    return null;
  }
};
