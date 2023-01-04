import React, { ForwardedRef, ReactElement } from 'react';
import { View, ViewStyle } from 'react-native';
import { Placement, Size } from './Types';

export type ArrowProps = {
    placement: Placement;
    color: ViewStyle['backgroundColor'];
    arrowSize: Size;
    positionStyle: Pick<ViewStyle, 'top' | 'bottom' | 'left' | 'right'>;
    elevation?: number;
    borderWidth?: number;
    borderColor?: ViewStyle['borderColor'];
};
const Arrow = React.forwardRef((props: ArrowProps, ref: ForwardedRef<View>): ReactElement => {
  const { placement, color, arrowSize, positionStyle, elevation, borderColor, borderWidth = 0 } = props;

  /*
   * Make width and height slightly bigger so that it overlaps popover to eliminate seem
   * (unless transparency is in play, in which case the overlap would show)
   */
  const isTransparent = color
    ? color.toString() === 'transparent' ||
      color.toString().startsWith('rgba') ||
      color.toString().startsWith('hsla') ||
      (color.toString().startsWith('#') && color.toString().length > 7)
    : false;
  const width = arrowSize.width + (isTransparent ? 0 : 2);
  const height = arrowSize.height + (isTransparent ? 0 : 2);

  // Flip width and height when showing on side to account for inner transform
  const placeLeftOrRight = [Placement.LEFT, Placement.RIGHT].includes(placement);
  const arrowOuterStyle: ViewStyle = {
    position: 'absolute',
    width: placeLeftOrRight ? height : width,
    height: placeLeftOrRight ? width : height,
    overflow: 'hidden',
    elevation,
    ...positionStyle
  };

  // Create a triangle using borders
  const arrowInnerStyle: ViewStyle = {
    position: 'absolute',
    [placement]: 0,
    borderBottomColor: borderColor ?? color,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    width,
    height: height * 2,
    borderBottomWidth: height,
    borderRightWidth: width / 2,
    borderLeftWidth: width / 2
  };

  const arrowInnerStyle1: ViewStyle = {
    ...arrowInnerStyle,
    left: borderWidth,
    borderBottomColor: color,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    width: width - (borderWidth * 2),
    height: height * 2,
    borderBottomWidth: height - (borderWidth * 2),
    borderRightWidth: (width / 2) - borderWidth,
    borderLeftWidth: (width / 2) - borderWidth
  };
  // Rotate to show the triangle in different directions
  switch (placement) {
    case Placement.TOP:
      arrowInnerStyle.transform = [{ rotateZ: '180deg' }];
      arrowInnerStyle1.transform = [{ rotateZ: '180deg' }];
      break;
    case Placement.LEFT:
      arrowInnerStyle.transform = [{ rotateZ: '90deg' }];
      arrowInnerStyle1.transform = [{ rotateZ: '90deg' }];
      break;
    case Placement.RIGHT:
      arrowInnerStyle.transform = [{ rotateZ: '270deg' }];
      arrowInnerStyle1.transform = [{ rotateZ: '270deg' }];
      break;
    default:
  }

  return (
    <View style={arrowOuterStyle} ref={ref}>
      <View style={arrowInnerStyle} />
      <View style={arrowInnerStyle1} />
    </View>
  );
});

export default Arrow;
