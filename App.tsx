import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import Lights from "./components/Lights";
import Scene from "./view/Scene";

export default function App() {
  const changeViewTarget: SharedValue<number> = useSharedValue(0);

  const changeView: SharedValue<number> = useSharedValue(0);
  const touch: SharedValue<boolean> = useSharedValue(false);

  const changeTarget = () => {
    changeViewTarget.value = 1 - changeViewTarget.value;
    touch.value = true;
  };
  const stopChangeTarget = () => {
    changeViewTarget.value = 0;
    touch.value = false;
  };
  useDerivedValue(() => {
    if (touch.value === true) {
      changeView.value = withTiming(changeViewTarget.value, {
        duration: 800,
        easing: Easing.in(Easing.poly(4)),
      });
    } else {
      changeView.value = withTiming(changeViewTarget.value, {
        duration: 800,
        easing: Easing.in(Easing.poly(2)),
      });
    }
  });

  const pressed: SharedValue<boolean> = useSharedValue(false);
  const offset: SharedValue<number> = useSharedValue(0.5);
  const transX: SharedValue<number> = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin((event) => {
      pressed.value = true;
      transX.value = offset.value;
    })
    .onChange((event) => {
      const step = transX.value + (event.translationY / -420) * 1;
      if (step >= 0 && step <= 1) offset.value = step;
    })
    .onTouchesDown((event) => {
      const firstTouch = event.allTouches[0];
      const yValue = firstTouch.y;

      offset.value = withTiming((420 - yValue) / 420, {
        duration: 500,
      });
      // offset.value = (420 - yValue) / 420;
    })
    .onFinalize((event) => {
      offset.value = withSpring(offset.value);
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      // { translateY: offset.value * -432 },
      { scale: withTiming(pressed.value ? 1.02 : 1) },
    ],
  }));

  const pressedState: SharedValue<boolean> = useSharedValue(false);
  const pressed2: SharedValue<boolean> = useSharedValue(false);
  const offset2: SharedValue<number> = useSharedValue(0);
  const moveX: SharedValue<number> = useSharedValue(0);
  const transX2: SharedValue<number> = useSharedValue(0);

  const [isAutoCounting, setIsAutoCounting] = useState(false);

  console.log("isAutoCounting", isAutoCounting);

  const pan2 = Gesture.Pan()

    .onBegin((event) => {
      if (isAutoCounting == true) {
        pressedState.value = true;
        transX2.value = offset2.value;
      }
    })
    .onChange((event) => {
      if (isAutoCounting == true) {
        offset2.value = transX2.value + event.translationX / 420;

        if (Math.abs(moveX.value + offset2.value) <= 2) {
          moveX.value += offset2.value;
        }
      }
    })

    .onFinalize((event) => {
      if (isAutoCounting == true) {
        offset2.value = withSpring(0);
        pressedState.value = false;
      }
    });

  const animatedStyles2 = useAnimatedStyle(() => ({
    transform: [{ translateX: offset2.value * 420 }],
  }));

  const animatedStylesChangeView = useAnimatedStyle(() => ({
    transform: [{ translateX: 0 }, { scale: withTiming(touch.value === true ? 1.1 : 1) }],
  }));

  const [rotateAngle, setRotateAngle] = useState<number>(0);
  const changeRotateAngleValue = (e: number) => {
    setRotateAngle(e);
  };

  const [count, setCount] = useState(10);
  const [barColor, setBarColor] = useState("#22c55e");
  const [notiDisplay, setNotiDisplay] = useState<"flex" | "none">("flex");

  const [gameResult, setGameResult] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);

  // const [gameStatus, setGameStatus] = useState<string>("");

  // Callback function to receive the result from the child component
  const handleCheck = (result: boolean) => {
    setGameResult(result);
  };

  console.log("appResult", gameResult);

  let TimerStr: string;

  useEffect(() => {
    let timer: number;

    if (isAutoCounting && count > 0) {
      timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000); // Increment every 1 second (1000 milliseconds)
    }

    if (count === 0) {
      timer = setInterval(() => {
        setNotiDisplay("flex");
      }, 1000); // Increment every 1 second (1000 milliseconds)
    }

    if (count == 10) setNotiDisplay("none");

    if (count > 3) {
      setBarColor("#22c55e");
    } else {
      setBarColor("red");
    }

    return () => {
      clearInterval(timer); // Clear the interval when the component unmounts
    };
  }, [count, isAutoCounting]);

  const startAutoCount = () => {
    setIsAutoCounting(true);
  };

  const resetCount = () => {
    // setIsAutoCounting(false);
    setCount(10);
    setRound(1);
  };

  const nextRound = () => {
    setCount(10);
    if (count === 0) {
      if (gameResult === false) {
        setRound(0);
      } else {
        setRound((prevCount) => prevCount + 1);
      }
    }
  };
  return (
    <>
      <Canvas className="webGL">
        <Lights />
        <Scene
          target={"topRight"}
          distance={2}
          cutAngle={15}
          side="right"
          showAimPoint={true}
          showCutPoint={true}
          eyeHeight={offset} // min = 1.8, max = 7
          eyeDistance={offset} // min = 0, max = 1
          rotateAngle={moveX} //rotateAngle
          rotateAngleState={pressedState}
          handleCheck={handleCheck}
          changeTargetView={changeView}
          changeTargetViewState={touch}
          isAutoCounting={isAutoCounting}
          countDown={count}
        />
      </Canvas>

      <View style={styles.container}>
        <GestureHandlerRootView className="absolute w-full  flex-1 border-white opacity-0 ">
          <GestureDetector gesture={pan2}>
            <Animated.View
              style={animatedStyles2}
              className="h-screen w-full  flex-col items-center justify-center bg-white"
            ></Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>

        <View className="bg-gray- absolute  top-[25%] ml-4  h-1/2 flex-1 justify-end rounded-full opacity-50">
          <GestureHandlerRootView className="absolute left-0 -ml-2 flex-1 ">
            <GestureDetector gesture={pan}>
              <Animated.View
                style={animatedStyles}
                className="h-[420px] w-5 flex-col items-center justify-center rounded-full bg-white opacity-50"
              >
                {/* <Text className="text-gray-500 text-xs">Up</Text>
                <Text className="text-gray-500 text-xs">Down</Text> */}
              </Animated.View>
            </GestureDetector>
          </GestureHandlerRootView>
        </View>

        <View className="absolute bottom-10 w-full flex-row justify-between px-4">
          <TouchableOpacity
            activeOpacity={0.4}
            onPressIn={changeTarget}
            onPressOut={stopChangeTarget}
          >
            <Animated.View
              style={animatedStylesChangeView}
              className="flex h-12 w-32 items-center justify-center rounded-full bg-gray-500 opacity-40"
            >
              <Text className="font-semibold text-white">Change</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.4}
            // onPressIn={changeTarget}
            // onPressOut={stopChangeTarget}
            onPress={resetCount}
            disabled={!isAutoCounting && count === 0}
          >
            <Animated.View className="flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-white opacity-40">
              <Text className="font-semibold text-white"></Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.4}
            // onPressIn={changeTarget}
            // onPressOut={stopChangeTarget}
            onPress={startAutoCount}
            disabled={isAutoCounting || count === 0}
          >
            <Animated.View className="flex h-12 w-32 items-center justify-center rounded-full bg-gray-500 opacity-40">
              <Text className="font-semibold text-white">Start</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View className="mt-10 h-14  w-full flex-row px-2">
          <View className="z-[1000px] flex h-20 w-20 items-center justify-center rounded-xl border-[3px] border-green-500 bg-black p-2">
            <Text className="text-center font-semibold uppercase text-green-500">Round</Text>
            <Text className="text-center text-4xl font-bold text-green-500">{round}</Text>
          </View>

          <View className="-ml-[10px] w-[250px] rounded-r-lg bg-gray-400/50 py-2 pr-2">
            <View className="w-full rounded-full bg-gray-800/50 p-1">
              <View
                className="h-2.5 rounded-full opacity-80"
                style={[
                  {
                    backgroundColor: barColor,
                    width: `${(count / 10) * 100}%`,
                  },
                ]}
              />
            </View>

            <View className="mt-1.5 w-full rounded-full bg-gray-800/50 p-1">
              <View
                className="h-2.5 rounded-full opacity-80"
                style={[
                  {
                    backgroundColor: "yellow",
                    width: `${(round / 10 - 0.1) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View
          className=" absolute h-screen w-full items-center justify-center"
          style={[{ display: notiDisplay }]}
        >
          <View className="h-[320px] w-[320px] rounded-2xl border-[2.5px] border-gray-500 bg-black/80 p-6 opacity-80">
            <Text className="mt-12 text-center text-3xl font-bold uppercase text-white">
              {gameResult ? "You Pass" : "Game Over"}
            </Text>
            <Text className="mt-2 text-center text-xl font-semibold text-white"></Text>

            <TouchableOpacity
              activeOpacity={0.4}
              // onPressIn={changeTarget}
              // onPressOut={stopChangeTarget}
              onPress={gameResult ? nextRound : resetCount}
              disabled={!isAutoCounting && count === 0}
              className="mx-auto mt-12"
            >
              <Animated.View className="flex h-12 w-32 items-center justify-center rounded-full bg-gray-500 ">
                <Text className="font-semibold text-white">
                  {gameResult ? "Next Round" : "Play Again"}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    color: "#999",
    fontSize: 12,
    position: "absolute",
    padding: 0,
  },

  box: {
    height: 50,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginVertical: 64,
  },
  progressBar: {
    height: 20,
  },
});
