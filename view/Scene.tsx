import React, { useRef, useMemo } from "react";
//import PoolBall from "../Component/PoolBall";
import PoolTable from "../components/PoolTable";
import zero from "../assets/textures/0.png";
import ten from "../assets/textures/10.png";
import { useFrame, useThree } from "@react-three/fiber";
import PoolBall from "../components/PoolBall";
import Lines from "../components/Lines";

import { getLimitPosition, getOBAndCB } from "../utils/function";
import {
  BALL_DIAMETER,
  targetCoordinate,
  targetLimitPoint,
} from "../constants";
import {
  Line,
  Point,
  lineAngle,
  lineLength,
  lineMidpoint,
  pointRotate,
  pointTranslate,
} from "geometric";

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type sceneProps = {
  target: string;
  distance: number;
  cutAngle: number;
  side: string;
  showAimPoint: boolean;
  eyeHeight: number;
  eyeDistance: number;
  rotateAngle: number;
  changeTargetView: number;
};

function Scene(props: sceneProps) {
  const { camera, gl } = useThree();
  const {
    target,
    distance,
    cutAngle,
    side,
    showAimPoint,
    eyeHeight,
    eyeDistance,
    rotateAngle,
    changeTargetView,
  } = props;

  const [eyePositionB, objBall, aimPoint, aiming1, aiming2] = useMemo(
    () => getOBAndCB(targetCoordinate[target], distance, cutAngle, eyeDistance),
    [target, distance, cutAngle, eyeDistance]
  );

  let aimingLine, eyePosition: Point, cueBall2D: Point, twoBallAngle: number;
  if (side === "left" && aiming1 !== undefined) {
    (aimingLine = aiming1.aimingLine),
      (eyePosition = aiming1.eyePosition),
      (cueBall2D = aiming1.cueBall2D),
      (twoBallAngle = aiming1.twoBallAngle);
  }
  if (side === "right" && aiming2 !== undefined) {
    (aimingLine = aiming2.aimingLine),
      (eyePosition = aiming2.eyePosition),
      (cueBall2D = aiming2.cueBall2D),
      (twoBallAngle = aiming2.twoBallAngle);
  }

  const [minTrueEyePosition, minAimPoint] = useMemo(
    () =>
      getLimitPosition(
        targetLimitPoint[target][1],
        objBall,
        cueBall2D,
        eyeDistance
      ),
    [objBall, eyeDistance, target]
  );

  const [maxTrueEyePosition, maxAimPoint] = useMemo(
    () =>
      getLimitPosition(
        targetLimitPoint[target][2],
        objBall,
        cueBall2D,
        eyeDistance
      ),
    [target, objBall, eyeDistance]
  );
  const eyePositionAndCueBallLength = lineLength([cueBall2D, eyePosition]);

  const minTrueCameraPosition = pointTranslate(
    cueBall2D,
    lineAngle([cueBall2D, minTrueEyePosition]),
    eyePositionAndCueBallLength
  );
  const maxTrueCameraPosition = pointTranslate(
    cueBall2D,
    lineAngle([cueBall.slice(0, 2), maxTrueEyePosition]),
    eyePositionAndCueBallLength
  );

  // const minLimitEyePosition = pointRotate(
  //   eyePosition,
  //   -twoBallAngle,
  //   cueBall.slice(0, 2)
  // );

  // const maxLimitEyePosition = pointRotate(
  //   eyePosition,
  //   twoBallAngle,
  //   cueBall.slice(0, 2)
  // );

  const step = useSharedValue(0);
  gl.setClearColor(0x0000, 1);

  let frame = 0.3;
  camera.position;

  const transX = useSharedValue(0);
  const transY = useSharedValue(0);
  transX.value = camera.position.x;
  transY.value = camera.position.y;

  // React.useEffect(() => {
  //   transX.value = withTiming(transX.value, { duration: 1000 });
  // }, []);

  // let sv = useSharedValue(0), lookAt = cueBall;
  // camera position:

  // camera.position.x = eyePosition[0] + sv * (eyePositionB[0] - eyePosition[0])
  // camera.position.y = eyePosition[1] + sv * (eyePositionB[1] - eyePosition[1])
  //look at:

  // lookAt[0] = cueBall[0] + sv * (objBall[0] - cueBall[0]);
  // lookAt[1] = cueBall[1] + sv * (objBall[1] - cueBall[1]);

  const moveX = Math.abs(transX.value - eyePositionB[0]) / 60;
  const moveY = Math.abs(transY.value - eyePositionB[1]) / 60;
  const backX = Math.abs(transX.value - eyePosition[0]) / 60;
  const backY = Math.abs(transY.value - eyePosition[1]) / 60;

  React.useEffect(() => {
    transX.value = withTiming(-transX.value, { duration: 1500 });
  }, []);

  useFrame(() => {
    if (changeTargetView == 1) {
      // if (step.value < 5.4) {
      //   step.value = withTiming(step.value + frame, { duration: 10 });
      //   // transX.value += 0.1;
      //   transY.value += 0.01;
      // }

      if (transX.value <= eyePositionB[0] + 1)
        transX.value += Math.abs(transX.value - eyePositionB[0]) / 20;
      if (transY.value <= eyePositionB[1])
        transY.value += Math.abs(transY.value - eyePositionB[1]) / 20;

      console.log(eyePositionB);
      console.log(transX.value, " ", transY.value);
      console.log(moveX);
      // if (transY.value < eyePositionB[1]) transX.value += 0.1;
    } else {
      if (transX.value > eyePosition[0])
        transX.value -= Math.abs(transX.value - eyePosition[0]) / 20;
      if (transY.value > eyePosition[1])
        transY.value -= Math.abs(transY.value - eyePosition[1]) / 20;
      // step.value -= 0.1;
    }

    if (changeTargetView.value == 0) changeTargetView.value = camera.fov = 50;
    camera.aspect = 0.45; //2.16;
    camera.near = 0.1;
    camera.far = 1000;
    camera.up.set(0, 0, 1);
    let zoom = 10;

    // React.useEffect(() => {
    //   step.value = withTiming(step.value, { duration: 1000 });
    // }, []);

    const rotateCamera = [
      ...pointRotate(
        eyePosition,
        step.value * twoBallAngle,
        cueBall.slice(0, 2)
      ),
      0.36 + eyeHeight.value * 5.2,
    ];

    [camera.position.x, camera.position.y, camera.position.z] = rotateCamera;
    camera.position.x = transX.value;
    camera.position.y = transY.value;
    camera.updateProjectionMatrix();
    camera.lookAt(...objBall);

    const cueLine = [camera.position.x, camera.position.y, BALL_DIAMETER / 2];

    const cueLineMidPoint = lineMidpoint([cueLine, cueBall]);
  });

  gl.setClearColor(0x0000, 1);

  camera.fov = 50;
  camera.aspect = 0.45; //2.16;
  camera.near = 0.1;
  camera.far = 1000;
  camera.up.set(0, 0, 1);
  let zoom = 10;

  const rotateCamera = [
    ...pointRotate(
      eyePosition,
      rotateAngle * twoBallAngle,
      cueBall.slice(0, 2)
    ),
    0.36 + eyeHeight.value * 5.2,
  ];

  [camera.position.x, camera.position.y, camera.position.z] = rotateCamera;
  // console.log("eyePositionB", eyePositionB);
  // camera.position.x = eyePositionB[0];
  // camera.position.y = eyePositionB[1];
  // camera.position.z = 4;

  camera.updateProjectionMatrix();
  camera.lookAt(...objBall);

  const cueLine = [camera.position.x, camera.position.y, BALL_DIAMETER / 2];

  let result;
  if (minTrueCameraPosition[0] === maxTrueCameraPosition[0]) {
    if (minTrueCameraPosition[1] < maxTrueCameraPosition[1])
      result =
        cueLine[1] > minTrueCameraPosition[1] &&
        cueLine[1] < maxTrueCameraPosition[1];
    if (minTrueCameraPosition[1] > maxTrueCameraPosition[1])
      result =
        cueLine[1] < minTrueCameraPosition[1] &&
        cueLine[1] > maxTrueCameraPosition[1];
  }
  if (minTrueCameraPosition[0] < maxTrueCameraPosition[0])
    result =
      cueLine[0] > minTrueCameraPosition[0] &&
      cueLine[0] < maxTrueCameraPosition[0];
  if (minTrueCameraPosition[0] > maxTrueCameraPosition[0])
    result =
      cueLine[0] < minTrueCameraPosition[0] &&
      cueLine[0] > maxTrueCameraPosition[0];

  const cueLineMidPoint = lineMidpoint([cueLine, cueBall]);

  return (
    <React.Suspense>
      <PoolTable ref={ref} />
      <PoolBall position={objBall} textureURL={ten} opacity={1} />
      <Lines start={cueLineMidPoint} end={cueBall} />
      <PoolBall position={cueBall} textureURL={zero} opacity={1} />
      {/* {showAimPoint && (
        <PoolBall position={aimPoint} textureURL={zero} opacity={0.5} />
      )} */}
      {/* <Lines
        start={cueBall}
        end={[...minTrueCameraPosition, BALL_DIAMETER / 2]}
      />
      <Lines
        start={cueBall}
        end={[...maxTrueCameraPosition, BALL_DIAMETER / 2]}
      /> */}
      <Lines
        start={objBall}
        end={[...targetCoordinate[target][1], BALL_DIAMETER / 2]}
      />
      <Lines start={objBall} end={eyePositionB} />

      {/* <PoolBall position={oneBall} textureURL={one} opacity={1} />
      <PoolBall position={twoBall} textureURL={two} opacity={1} />
      <PoolBall position={threeBall} textureURL={three} opacity={1} /> */}
      {/* <PoolBall position={oneBall} textureURL={eight} opacity={1} /> */}
      {/* <PoolBall position={[1.2, -1.2, 0.114]} textureURL={eight} opacity={1} />
      <PoolBall position={[-1.2, 1.2, 0.114]} textureURL={seven} opacity={1} /> */}

      {/* <Lines start={aimingLine[0]} end={aimingLine[1]} /> */}

      {/* <Lines start={aimPoint} end={[...eyePosition, BALL_DIAMETER / 2]} /> */}

      {/* <Lines
        start={cueBall}
        end={[...minLimitEyePosition, BALL_DIAMETER / 2]}
      />
      <Lines
        start={cueBall}
        end={[...maxLimitEyePosition, BALL_DIAMETER / 2]}
      /> */}

      {/* <Lines
        start={[...minAimPoint, BALL_DIAMETER / 2]}
        end={[...minTrueEyePosition, BALL_DIAMETER / 2]}
      />
      <Lines
        start={[...maxAimPoint, BALL_DIAMETER / 2]}
        end={[...maxTrueEyePosition, BALL_DIAMETER / 2]}
      /> */}
    </React.Suspense>
  );
}

export default Scene;
