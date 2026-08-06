import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

export default function ZoomableImage({ source, fallbackSource }) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [currentScale, setCurrentScale] = useState(1);
  const [imgError, setImgError] = useState(false);
  const lastTapRef = useRef(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Cycle zoom: 1x -> 2x -> 3x -> 1x
      let nextScale = 1;
      if (currentScale === 1) {
        nextScale = 2;
      } else if (currentScale === 2) {
        nextScale = 3;
      } else {
        nextScale = 1;
      }

      setCurrentScale(nextScale);
      Animated.spring(scaleAnim, {
        toValue: nextScale,
        useNativeDriver: true,
        friction: 6,
        tension: 40,
      }).start();

      // Reset scroll position when returning to 1x
      if (nextScale === 1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }

    lastTapRef.current = now;
  };

  const imageSource = imgError && fallbackSource ? fallbackSource : source;

  return (
    <View style={[styles.container, { width: windowWidth, height: windowHeight * 0.78 }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        vertical={true}
        maximumZoomScale={3}
        minimumZoomScale={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { width: windowWidth }]}
      >
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                width: windowWidth,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={typeof imageSource === 'number' ? imageSource : { uri: imageSource.uri }}
              style={[styles.image, { width: windowWidth }]}
              resizeMode="contain"
              onError={() => setImgError(true)}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  imageWrapper: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
  },
});
