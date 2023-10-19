<<<<<<< HEAD
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import PoolTable from "../components/PoolTable";
import { useFrame, useThree } from "@react-three/fiber";
import PoolBall from "../components/PoolBall";
import Lines from "../components/Lines";
import * as THREE from "three";
=======
import React, { useMemo, useRef } from "react";
import PoolTable from "../components/PoolTable";
import { useFrame, useThree } from "@react-three/fiber";
import PoolBall from "../components/PoolBall";
import Flow from "../components/Flow";
>>>>>>> origin/main

import {
  getFlowCueBall,
  getLimitPosition,
  getOBAndCB,
} from "../utils/function";
import {
  BALL_DIAMETER,
  targetCoordinate,
  targetLimitPoint,
} from "../constants";
import {
  Line,
  Point,
  angleToRadians,
  lineAngle,
  lineLength,
  lineMidpoint,
  pointRotate,
  pointTranslate,
} from "geometric";

import { SharedValue } from "react-native-reanimated";
import {
  BufferGeometry,
<<<<<<< HEAD
  LineBasicMaterial,
  NormalBufferAttributes,
} from "three";

import {
  SharedValue,
  runOnJS,
  runOnUI,
  useDerivedValue,
} from "react-native-reanimated";
import { PerspectiveCamera, Vector3, WebGLRenderer } from "three";
=======
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
>>>>>>> origin/main

export type SceneProps = {
  target: string;
  distance: number;
  cutAngle: number;
  side: string;
  showAimPoint: boolean;
<<<<<<< HEAD
  handleCheck: Function;
=======
  showCutPoint: boolean;
>>>>>>> origin/main
  eyeHeight: SharedValue<number>;
  eyeDistance: SharedValue<number>;
  rotateAngle: SharedValue<number>; // number
  rotateAngleState: SharedValue<boolean>;
  changeTargetView: SharedValue<number>;
  changeTargetViewState: SharedValue<boolean>;
  isAutoCounting: boolean;
  countDown: number;
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
    showCutPoint,
    eyeHeight,
    eyeDistance,
    rotateAngle,
    handleCheck,
    rotateAngleState,
    changeTargetView,
    changeTargetViewState,
    isAutoCounting,
    countDown,
  } = props;

  console.log("count", countDown);

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

  const [minTrueEyePosition, minAimPoint]: Point[] = useMemo(
    () =>
      getLimitPosition(
        targetLimitPoint[target][1],
        objBall,
        cueBall2D,
        eyeDistance.value
      ),
    [objBall, eyeDistance, target]
  );

  const [maxTrueEyePosition, maxAimPoint]: Point[] = useMemo(
    () =>
      getLimitPosition(
        targetLimitPoint[target][2],
        objBall,
        cueBall2D,
        eyeDistance.value
      ),
    [target, objBall, eyeDistance]
  );
  const eyePositionAndCueBallLength: number = lineLength([
    cueBall2D,
    eyePosition,
  ]);

  const minTrueCameraPosition: Point = pointTranslate(
    cueBall2D,
    lineAngle([cueBall2D, minTrueEyePosition]),
    eyePositionAndCueBallLength
  );
  const maxTrueCameraPosition: Point = pointTranslate(
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

  let lookAtX: number = cueBall2D[0],
    lookAtY: number = cueBall2D[1];

  const Ref = useRef<BufferGeometry>(null!);
<<<<<<< HEAD

  const posX_B = eyePositionB[0];
  const posY_B = eyePositionB[1];

  useFrame(() => {
    // console.log(changeTargetViewState.value);
=======
  const meshRef = useRef<Mesh>(null!);
  const cueLineRef = useRef<Line>([cueBall2D, objBall]);

  useFrame((state) => {
    // set camera position
>>>>>>> origin/main
    const rotateCamera: number[] = [
      ...pointRotate(eyePosition, rotateAngle.value * twoBallAngle, cueBall2D),
      0.36 + eyeHeight.value * 5.2,
    ];
    camera.position.x = rotateCamera[0];
    camera.position.y = rotateCamera[1];
<<<<<<< HEAD
    const posX_A = rotateCamera[0];
    const posY_A = rotateCamera[1];

    const cameraPositionX = posX_A + changeTargetView.value * (posX_B - posX_A);
    const cameraPositionY = posY_A + changeTargetView.value * (posY_B - posY_A);
=======

    // set camera position when hold press
    const cameraPositionX =
      rotateCamera[0] +
      changeTargetView.value * (eyePositionB[0] - rotateCamera[0]);
    const cameraPositionY =
      rotateCamera[1] +
      changeTargetView.value * (eyePositionB[1] - rotateCamera[1]);
    // set look at position when hold press
>>>>>>> origin/main
    lookAtX =
      cueBall2D[0] + (objBall[0] - cueBall2D[0]) * changeTargetView.value;
    lookAtY =
      cueBall2D[1] + (objBall[1] - cueBall2D[1]) * changeTargetView.value;

    camera.position.x = cameraPositionX;
    camera.position.y = cameraPositionY;
    camera.updateProjectionMatrix();

    camera.position.z = 0.36 + eyeHeight.value * 5.2;

    camera.updateProjectionMatrix();
    camera.lookAt(lookAtX, lookAtY, BALL_DIAMETER / 2);
<<<<<<< HEAD

    if (rotateAngleState.value) {
      const cueLine: Point = [camera.position.x, camera.position.y];
      const cueLineMidPoint: Vector3 = new Vector3(
        ...lineMidpoint([cueLine, cueBall2D]),
        BALL_DIAMETER / 2
      );

      const points: Vector3[] = [];
      points.push(new Vector3(...cueLineMidPoint));
      points.push(new Vector3(...new Vector3(...cueBall2D, BALL_DIAMETER / 2)));

      // useLayoutEffect(() => {
      if (Ref.current) Ref.current.setFromPoints(points);
    }
=======
    // set flow cue ball when camera position change
    const cueLine: Point = [camera.position.x, camera.position.y];
    const lineToOb: Line = getFlowCueBall([cueLine, cueBall2D], objBall);
    if (cueLineRef.current) cueLineRef.current = lineToOb;

    const flowCueBallGeometry = new PlaneGeometry(
      BALL_DIAMETER,
      lineLength(lineToOb)
    );
    if (meshRef.current) {
      meshRef.current.position.fromArray([
        ...lineMidpoint(lineToOb),
        BALL_DIAMETER / 2,
      ]);
      meshRef.current.rotation.set(
        0,
        0,
        angleToRadians(lineAngle(lineToOb) - 90)
      );
      meshRef.current.geometry = flowCueBallGeometry;
      meshRef.current.material = new MeshStandardMaterial({
        color: 0xffff,
        opacity: 0.2,
        transparent: true,
      });
    }

    // set cue line when camera position change
    const cueLineMidPoint: Vector3 = new Vector3(
      ...lineMidpoint([cueLine, cueBall2D]),
      BALL_DIAMETER / 2
    );
    const points: Vector3[] = [];
    points.push(new Vector3(...cueLineMidPoint));
    points.push(new Vector3(...new Vector3(...cueBall2D, BALL_DIAMETER / 2)));

    if (Ref.current) Ref.current.setFromPoints(points);
>>>>>>> origin/main
  });

  gl.setClearColor(0x0000, 1);

  camera.fov = 40;
  camera.aspect = 0.45;
  camera.near = 0.1;
  camera.far = 1000;
  camera.up.set(0, 0, 1);

<<<<<<< HEAD
  const rotateCamera: number[] = [
    ...pointRotate(eyePosition, rotateAngle.value * twoBallAngle, cueBall2D),
    0.36 + eyeHeight.value * 5.2,
  ];

  [camera.position.x, camera.position.y, camera.position.z] = rotateCamera;

  camera.updateProjectionMatrix();
  camera.lookAt(...cueBall2D, BALL_DIAMETER / 2);

  const cueLine: Point = [camera.position.x, camera.position.y];
  const cueLineMidPoint: Vector3 = new Vector3(
    ...lineMidpoint([cueLine, cueBall2D]),
    BALL_DIAMETER / 2
  );

  const points: Vector3[] = [];
  points.push(new Vector3(...cueLineMidPoint));
  points.push(new Vector3(...new Vector3(...cueBall2D, BALL_DIAMETER / 2)));

  // useLayoutEffect(() => {
  if (Ref.current) Ref.current.setFromPoints(points);

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

  console.log("result", result);
  handleCheck(result);
  // const [gameresult, setGameResult] = useState<boolean>(false);
  // setGameResult(result);
=======
  camera.updateProjectionMatrix();
  camera.lookAt(...cueBall2D, BALL_DIAMETER / 2);

  // let result;
  // if (minTrueCameraPosition[0] === maxTrueCameraPosition[0]) {
  //   if (minTrueCameraPosition[1] < maxTrueCameraPosition[1])
  //     result =
  //       cueLine[1] > minTrueCameraPosition[1] &&
  //       cueLine[1] < maxTrueCameraPosition[1];
  //   if (minTrueCameraPosition[1] > maxTrueCameraPosition[1])
  //     result =
  //       cueLine[1] < minTrueCameraPosition[1] &&
  //       cueLine[1] > maxTrueCameraPosition[1];
  // }
  // if (minTrueCameraPosition[0] < maxTrueCameraPosition[0])
  //   result =
  //     cueLine[0] > minTrueCameraPosition[0] &&
  //     cueLine[0] < maxTrueCameraPosition[0];
  // if (minTrueCameraPosition[0] > maxTrueCameraPosition[0])
  //   result =
  //     cueLine[0] < minTrueCameraPosition[0] &&
  //     cueLine[0] > maxTrueCameraPosition[0];

  const cutPoint: Point = lineMidpoint([objBall, aimPoint]);
>>>>>>> origin/main

  const zero: string = require("../assets/textures/0.png");
  const six: string = require("../assets/textures/6_basecolor.png");
  const ten: string = require("../assets/textures/10_basecolor.png");
  const fifteen: string = require("../assets/textures/15_basecolor.png");
  const point: string = require("../assets/textures/red_point.jpeg");

  return (
    <React.Suspense>
      <PoolTable />
      <PoolBall
        r={BALL_DIAMETER / 2}
        position={[...objBall, BALL_DIAMETER / 2]}
        textureURL={six}
        opacity={1}
      />
      <Flow ref={meshRef} />

      <line>
        <bufferGeometry attach="geometry" ref={Ref} />
        <lineBasicMaterial attach="material" color="white" opacity={0} />
      </line>
      {/* <Lines
<<<<<<< HEAD
        ref={Ref}
=======
        start={new Vector3(...lineToOb[0], BALL_DIAMETER / 2)}
        end={new Vector3(...lineToOb[1], BALL_DIAMETER / 2)}
      />
      <Lines
        start={new Vector3(...flow1[0], BALL_DIAMETER / 2)}
        end={new Vector3(...flow1[1], BALL_DIAMETER / 2)}
      />
      <Lines
        start={new Vector3(...flow2[0], BALL_DIAMETER / 2)}
        end={new Vector3(...flow2[1], BALL_DIAMETER / 2)}
      /> */}
      {/* <Lines
>>>>>>> origin/main
        start={cueLineMidPoint}
        end={new Vector3(...cueBall2D, BALL_DIAMETER / 2)}
      /> */}
      <line>
        <bufferGeometry attach="geometry" ref={Ref} />
        <lineBasicMaterial attach="material" color="white" opacity={0} />
      </line>
      <PoolBall
        r={BALL_DIAMETER / 2}
        position={[...cueBall2D, BALL_DIAMETER / 2]}
        textureURL={zero}
        opacity={1}
      />
      {showAimPoint && (
        <PoolBall
          r={0.01}
          position={[...aimPoint, 0.005]}
          textureURL={point}
          opacity={1}
        />
      )}
      {showCutPoint && (
        <PoolBall
          r={0.01}
          position={[...cutPoint, BALL_DIAMETER / 2]}
          textureURL={point}
          opacity={1}
        />
      )}
      {/* <Lines
        start={new Vector3(...objBall, BALL_DIAMETER / 2)}
        end={new Vector3(...targetCoordinate[target][1], BALL_DIAMETER / 2)}
      />
      <Lines
        start={new Vector3(...objBall, BALL_DIAMETER / 2)}
        end={new Vector3(...eyePositionB, BALL_DIAMETER / 2)}
      /> */}
    </React.Suspense>
  );
}

export default Scene;
