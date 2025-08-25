import {
  Blur,
  Canvas,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import React, { useDeferredValue, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useDerivedValue, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
const { width, height } = Dimensions.get("screen");

const visual_config = {
  blur: 9,
  center: {
    x: width / 2,
    y: height / 2,
  },
} as const;

const Animation_config = {
  durations: {
    MOUNT: 200,
    SPEAKING_TRANSITION: 600,
    QUIET_TRANSITION: 400,
    PULSE: 1000,
  },
  spring: {
    damping: 10,
    stiffness: 50
  }
} as const;

const radius_config = {
  minScale: 0.6,
  maxScale: 1.4,
  speakingScale: 1.0,
  quietScale: 0.6,
  baseRadius: {
    default: width,
    speaking: width / 4,
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
const CalculateRadiusRounds = (baseRadius: number) => {
  "worklet";
  return {
    min: baseRadius * radius_config.minScale,
    max: baseRadius * radius_config.maxScale,
  }
}

const CalculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
  "worklet";
  const { min, max } = CalculateRadiusRounds(baseRadius);
  const scale = isSpeaking ? radius_config.speakingScale : radius_config.quietScale;
  return min + (max - min) * scale;
}

const Gradient = ({ position, isSpeaking }: GradientProps) => {
  const animatedY = useSharedValue(0);
  const Scale = useSharedValue(1);
  const baseradius = useSharedValue(radius_config.baseRadius.default);
  const mountRadius = useSharedValue(0);
  const center = useDeferredValue(vec(visual_config.center.x, animatedY.value));


  const animatedRadius = useDerivedValue(() => {
    const { min, max } = CalculateRadiusRounds(baseradius.value);
    const calculatedRadius = min + (max - min) * Scale.value;

    return mountRadius.value < calculatedRadius
      ? mountRadius.value
      : calculatedRadius;
  });



  useEffect(() => {
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY, Animation_config.spring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, animatedY])


  useEffect(() => {
    animatedY.value = getTargetY(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    const TargetRadius = CalculateTargetRadius(radius_config.baseRadius.default, isSpeaking);
    mountRadius.value = withTiming(TargetRadius, {
      duration: Animation_config.durations.MOUNT,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const duration = Animation_config.durations.SPEAKING_TRANSITION;
    if (isSpeaking) {
      baseradius.value = withTiming(radius_config.baseRadius.speaking);
      animatedY.value = withTiming(getTargetY("center"), { duration })
    } else {
      baseradius.value = withTiming(radius_config.baseRadius.default)
      animatedY.value = withTiming(getTargetY(position), { duration })
    }
  }, [isSpeaking, baseradius, animatedY, position])

  useEffect(() => {
    if (isSpeaking) {
      Scale.value = withRepeat(
        withTiming(radius_config.speakingScale, { duration: Animation_config.durations.PULSE }),
        -1,
        true

      )
    }else {
      Scale.value = withTiming(radius_config.quietScale, { duration: Animation_config.durations.QUIET_TRANSITION });
    }
  }, [isSpeaking, Scale])

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={animatedRadius}
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
