import {
    Blur,
    Canvas,
    RadialGradient,
    Rect,
    vec,
} from "@shopify/react-native-skia";
import React, { useDeferredValue, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
const { width, height } = Dimensions.get("screen");

const visual_config = {
  blur: 9,
  center: {
    x: width / 2,
    y: height / 2,
  },
} as const;

const Animation_config = {
    durations:{
        MOUNT:200,
        SPEAKING_TRANSITION:600,
        QUIET_TRANSITION:400,
        PULSE:1000,
    },
    spring:{
        damping:0,
        stiffness:50
    }
} as const;

type GradientPosition = "top" | "bottom" | "center";

interface GradientProps {
  position: GradientPosition;
  isSpeaking: boolean;
}

const getTargetY = (pos: GradientPosition): number => {
  switch (pos) {
    case "top":
      return 0;
    case "center":
      return visual_config.center.y;
    case "bottom":
      return height;
    default:
      return visual_config.center.y;
  }
};

const Gradient = ({ position, isSpeaking }: GradientProps) => {
  const animatedY = useSharedValue(0);
  const center = useDeferredValue(vec(visual_config.center.x, animatedY.value));


  useEffect(()=>{
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY,Animation_config.spring);

  },[position,animatedY])


  useEffect(() => {
    animatedY.value = getTargetY(position);
  }, [position]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={128}
            colors={[
              colors.mediumBlue,
              colors.lightBlue,
              colors.teal,
              colors.iceBlue,
              colors.white,
            ]}
          />
          <Blur blur={visual_config.blur} mode={"clamp"} />
        </Rect>
      </Canvas>
    </View>
  );
};

const colors = {
  white: "#ffffff",
  teal: "#5AC8FA",
  mediumBlue: "#007AFF",
  lightBlue: "#4DA6FF",
  iceBlue: "#E6F3FF",
};

export default Gradient;
