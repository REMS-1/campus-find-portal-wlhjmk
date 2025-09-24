
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface ImageViewerProps {
  imageUri: string;
  style?: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ImageViewer({ imageUri, style }: ImageViewerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openFullScreen = () => {
    setIsModalVisible(true);
  };

  const closeFullScreen = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={openFullScreen} style={style}>
        <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        <View style={styles.expandIcon}>
          <Icon name="expand" size={20} color={colors.backgroundAlt} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFullScreen}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeFullScreen} style={styles.closeButton}>
              <Icon name="close" size={24} color={colors.backgroundAlt} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
  },
  expandIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullScreenImage: {
    width: screenWidth - 40,
    height: screenHeight - 200,
  },
});
