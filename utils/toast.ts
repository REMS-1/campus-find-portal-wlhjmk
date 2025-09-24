
import { Alert } from 'react-native';

export const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
  Alert.alert(title, message);
};

export const showSuccessToast = (message: string) => {
  showToast('Success', message, 'success');
};

export const showErrorToast = (message: string) => {
  showToast('Error', message, 'error');
};

export const showInfoToast = (message: string) => {
  showToast('Info', message, 'info');
};
