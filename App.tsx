import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./view/Scene";
import Lights from "./components/Lights";
import { Text, View, StyleSheet, Button } from "react-native";

import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { withTiming } from "react-native-reanimated";

export default function App() {
  const [changeTargetView, setChangeTargetView] = useState(0);
  const [rotateAngle, setRotateAngle] = useState(0);

  const changeView: SharedValue<number> = useSharedValue(0);

  React.useEffect(() => {
    changeView.value = changeTargetView;
  });

  const changeTarget = () => {
    if (changeTargetView == 0) setChangeTargetView(1);
    else setChangeTargetView(0);
  };

  const pressed: SharedValue<boolean> = useSharedValue(false);
  const offset: SharedValue<number> = useSharedValue(0.5);
  const transX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin((event) => {
      pressed.value = true;
      transX.value = offset.value;
    })
    .onChange((event) => {
      offset.value = transX.value + event.translationY / -432;
    })
    .onFinalize((event) => {
      offset.value = withSpring(offset.value);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateY: offset.value * -432 },
      { scale: withTiming(pressed.value ? 1.2 : 1) },
    ],
    backgroundColor: pressed.value ? "#FFE04B" : "#b58df1",
  }));

  const pressed2: SharedValue<boolean> = useSharedValue(false);
  const offset2: SharedValue<number> = useSharedValue(0.5);
  const transX2 = useSharedValue(0);

  const pan2 = Gesture.Pan()
    .onBegin((event) => {
      pressed2.value = true;
      transX2.value = offset2.value;
    })
    .onChange((event) => {
      offset2.value = transX2.value + event.translationX / -432;
    })
    .onFinalize((event) => {
      offset2.value = withSpring(offset2.value);
      pressed2.value = false;
    });

  const animatedStyles2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset2.value * -432 },
      { scale: withTiming(pressed2.value ? 1.2 : 1) },
    ],
    backgroundColor: pressed2.value ? "#FFE04B" : "#b58df1",
  }));

  console.log("Reloading.....");
  return (
    <>
      <Canvas className="webGL">
        <Lights />
        <Scene
          // position={[0, 0, 0]}
          target={"topRight"}
          distance={2}
          cutAngle={15}
          side="right"
          showAimPoint={true}
          eyeHeight={offset} // min = 1.8, max = 7
          eyeDistance={offset2} // min= 0, max = 1
          rotateAngle={rotateAngle}
          // handleCheck={handleCheck}
          changeTargetView={changeView}
        />
        {/* <Controls target={target} distance={2} cutAngle={15} /> */}
      </Canvas>

      <View style={styles.container}>
        <View className="h-16 w-16 ml-[55%] rounded-full bg-white opacity-50 pt-3 ">
          <Button onPress={changeTarget} title="Press" color={"gray"} />
        </View>

        <GestureHandlerRootView className="flex-1 ml-5 absolute left-0 bg-black">
          <GestureDetector gesture={pan}>
            <Animated.View
              style={animatedStyles}
              className="h-16 w-16 bg-white opacity-50 rounded-full justify-center items-center flex-col -pt-1"
            >
              <Text className="text-gray-500 ">Up</Text>
              <Text className="text-gray-500 ">Down</Text>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>

        <GestureHandlerRootView className="flex-1 absolute mr-5 right-0 bg-black">
          <GestureDetector gesture={pan2}>
            <Animated.View
              style={animatedStyles2}
              className="h-16 w-16 bg-white opacity-50  bottom-20 rounded-full justify-center items-center flex-col -pt-1"
            >
              <Text className="text-gray-500 ">Left</Text>
              <Text className="text-gray-500 ">Right</Text>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>

        {/* <Adjust
          label="Eye Height"
          min={0}
          max={1.5}
          changeValue={changeEyeHeightValue}
          value={eyeHeight}
        />


        <Adjust
          label="Rotate"
          min={-50}
          max={50}
          changeValue={changeRotateAngleValue}
          value={rotateAngle}
        /> */}
      </View>

      {/* <View
        style={{
          backgroundColor: checkValue ? "green" : "red",
          cursor: "pointer",
          borderRadius: 5,
          width: 60,
          height: 30,
          top: 50,
          left: "46%",
          position: "absolute",
        }}
      ></View> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    color: "#999",
    fontSize: 12,
    position: "absolute",
    border: 1,
    bottom: 50,
    borderRadius: 8,
    padding: 0,
    marginTop: 4,
  },

  box: {
    height: 50,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginVertical: 64,
  },
});
