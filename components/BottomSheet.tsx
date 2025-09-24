
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = [0, SCREEN_HEIGHT * 0.6, SCREEN_HEIGHT * 0.9];

export default function SimpleBottomSheet({ children, isVisible, onClose }: SimpleBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);

  useEffect(() => {
    if (isVisible) {
      snapToPoint(1);
    } else {
      snapToPoint(0);
    }
  }, [isVisible]);

  const snapToPoint = (pointIndex: number) => {
    const point = SNAP_POINTS[pointIndex];
    setCurrentSnapPoint(pointIndex);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: point,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(backdropOpacity, {
        toValue: pointIndex > 0 ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (pointIndex === 0 && onClose) {
        onClose();
      }
    });
  };

  const getClosestSnapPoint = (currentY: number, velocityY: number): number => {
    const distances = SNAP_POINTS.map(point => Math.abs(currentY - point));
    let closestIndex = distances.indexOf(Math.min(...distances));

    // Adjust based on velocity
    if (velocityY > 500 && closestIndex < SNAP_POINTS.length - 1) {
      closestIndex += 1;
    } else if (velocityY < -500 && closestIndex > 0) {
      closestIndex -= 1;
    }

    return closestIndex;
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const newY = SNAP_POINTS[currentSnapPoint] + gestureState.dy;
      if (newY >= SNAP_POINTS[0] && newY <= SNAP_POINTS[SNAP_POINTS.length - 1]) {
        translateY.setValue(newY);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const currentY = SNAP_POINTS[currentSnapPoint] + gestureState.dy;
      const closestSnapPoint = getClosestSnapPoint(currentY, gestureState.vy);
      snapToPoint(closestSnapPoint);
    },
  });

  const handleBackdropPress = () => {
    snapToPoint(0);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    position: 'absolute',
    top: SCREEN_HEIGHT,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.backgroundAlt,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    boxShadow: `0px -4px 20px ${colors.shadow}`,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
});
