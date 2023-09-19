import React, { useRef, useMemo } from "react";
import PoolTable from "../components/PoolTable";
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

import {
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PerspectiveCamera, Vector3, WebGLRenderer } from "three";

export type SceneProps = {
  target: string;
  distance: number;
  cutAngle: number;
  side: string;
  showAimPoint: boolean;
  eyeHeight: SharedValue<number>;
  eyeDistance: SharedValue<number>;
  rotateAngle: number;
  changeTargetView: SharedValue<number>;
};

function Scene(props: SceneProps) {
  const { camera, gl }: { camera: PerspectiveCamera; gl: WebGLRenderer } =
    useThree();
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
    () =>
      getOBAndCB(
        targetCoordinate[target],
        distance,
        cutAngle,
        eyeDistance.value
      ),
    [target, distance, cutAngle, eyeDistance]
  );

  let aimingLine: Line = [
      [0, 0],
      [0, 0],
    ],
    eyePosition: Point = [0, 0],
    cueBall2D: Point = [0, 0],
    twoBallAngle: number = 0;
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
        eyeDistance.value
      ),
    [objBall, eyeDistance, target]
  );

  const [maxTrueEyePosition, maxAimPoint] = useMemo(
    () =>
      getLimitPosition(
        targetLimitPoint[target][2],
        objBall,
        cueBall2D,
        eyeDistance.value
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
    lineAngle([cueBall2D, maxTrueEyePosition]),
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

  const transX = useSharedValue(0);
  const transY = useSharedValue(0);
  transX.value = camera.position.x;
  transY.value = camera.position.y;

  React.useEffect(() => {
    transX.value = withTiming(-transX.value, { duration: 1500 });
  }, []);

  useFrame(() => {
    if (changeTargetView.value == 1) {
      if (transX.value <= eyePositionB[0] + 1)
        transX.value += Math.abs(transX.value - eyePositionB[0]) / 20;
      if (transY.value <= eyePositionB[1])
        transY.value += Math.abs(transY.value - eyePositionB[1]) / 20;
    } else {
      if (transX.value > eyePosition[0])
        transX.value -= Math.abs(transX.value - eyePosition[0]) / 20;
      if (transY.value > eyePosition[1])
        transY.value -= Math.abs(transY.value - eyePosition[1]) / 20;
    }

    camera.fov = 50;
    camera.aspect = 0.45;
    camera.near = 0.1;
    camera.far = 1000;
    camera.up.set(0, 0, 1);
    let zoom = 10;

    const rotateCamera = [
      ...pointRotate(eyePosition, step.value * twoBallAngle, cueBall2D),
      0.36 + eyeHeight.value * 5.2,
    ];

    [camera.position.x, camera.position.y, camera.position.z] = rotateCamera;
    camera.position.x = transX.value;
    camera.position.y = transY.value;
    camera.updateProjectionMatrix();
    camera.lookAt(...objBall, BALL_DIAMETER / 2);
  });

  gl.setClearColor(0x0000, 1);

  camera.fov = 50;
  camera.aspect = 0.45;
  camera.near = 0.1;
  camera.far = 1000;
  camera.up.set(0, 0, 1);
  let zoom = 10;

  const rotateCamera = [
    ...pointRotate(eyePosition, rotateAngle * twoBallAngle, cueBall2D),
    0.36 + eyeHeight.value * 5.2,
  ];

  [camera.position.x, camera.position.y, camera.position.z] = rotateCamera;

  camera.updateProjectionMatrix();
  camera.lookAt(...objBall, BALL_DIAMETER / 2);

  const cueLine: Point = [camera.position.x, camera.position.y];

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

  const cueLineMidPoint: Vector3 = new Vector3(
    ...lineMidpoint([cueLine, cueBall2D]),
    BALL_DIAMETER / 2
  );

  const zero: string = require("../assets/textures/0.png");
  const ten: string = require("../assets/textures/10.png");

  return (
    <React.Suspense>
      <PoolTable />
      <PoolBall
        position={[...objBall, BALL_DIAMETER / 2]}
        textureURL={ten}
        opacity={1}
      />
      <Lines
        start={cueLineMidPoint}
        end={new Vector3(...cueBall2D, BALL_DIAMETER / 2)}
      />
      <PoolBall
        position={[...cueBall2D, BALL_DIAMETER / 2]}
        textureURL={zero}
        opacity={1}
      />
      {/* {showAimPoint && (
        <PoolBall position={aimPoint} textureURL={zero} opacity={0.5} />
      )} */}
      <Lines
        start={new Vector3(...objBall, BALL_DIAMETER / 2)}
        end={new Vector3(...targetCoordinate[target][1], BALL_DIAMETER / 2)}
      />
      <Lines
        start={new Vector3(...objBall, BALL_DIAMETER / 2)}
        end={new Vector3(...eyePositionB, BALL_DIAMETER / 2)}
      />
    </React.Suspense>
  );
}

export default Scene;
