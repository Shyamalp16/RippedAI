import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgress = ({ percentage }) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percentage / 100) * circumference;
  const formattedProgress = percentage.toFixed(0)

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Svg height="110" width="110" viewBox="0 0 120 120">
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#000000"
          fill="none"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ position: 'absolute', fontSize: 24, fontWeight: 'bold' }}>
        {`${formattedProgress}%`}
      </Text>
    </View>
  );
};

export default CircularProgress;
