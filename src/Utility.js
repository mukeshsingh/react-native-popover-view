import { Platform, Animated, NativeModules, findNodeHandle } from 'react-native'

export function Point(x, y) {
    this.x = x;
    this.y = y;
}

export function Size(width, height) {
    this.width = width;
    this.height = height;
}

export function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

export function isIOS() {
  return Platform.OS === 'ios';
}

// Transition config needed on tablets for popover to work
export let popoverTransitionConfig = () => ({
  transitionSpec: {
    duration: 1,
    timing: Animated.timing,
  },
  screenInterpolator: sceneProps => {
    const { position, scene } = sceneProps
    const { index } = scene

    const translateY = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 0, 0],
    })

    const opacity = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 1],
    })

    return { opacity, transform: [{ translateY }] }
  },
})

export function isRect(rect) {
  return rect && (rect.x || rect.x === 0) && (rect.y || rect.y === 0) && (rect.width || rect.width === 0) && (rect.height || rect.height === 0);
}

export function isPoint(point) {
  return point && (point.x || point.x === 0) && point.x !== NaN && (point.y || point.y === 0) && point.y !== NaN;
}

export function runAfterChange(getFirst, second, func) {
  let interval = setInterval(() => {
    getFirst(first => {
      if (first !== second) {
        clearInterval(interval);
        func();
      }
    }, 100)
  });
  setTimeout(() => clearInterval(interval), 2000); // Failsafe so that the interval doesn't run forever
}

export function waitForNewRect(ref, initialRect, onFinish) {
  runAfterChange(callback => {
    NativeModules.UIManager.measure(findNodeHandle(ref), (x0, y0, width, height, x, y) => {
      callback(new Rect(x, y, width, height));
    })
  }, initialRect, () => {
    NativeModules.UIManager.measure(findNodeHandle(ref), (x0, y0, width, height, x, y) => {
      onFinish(new Rect(x, y, width, height))
    })
  });
}

export function rectChanged(a, b) {
  if (!isRect(a) || !isRect(b)) return false;
  return (Math.round(a.x) !== Math.round(b.x) || Math.round(a.y) !== Math.round(b.y) || Math.round(a.width) !== Math.round(b.width) || Math.round(a.height) !== Math.round(b.height));
}