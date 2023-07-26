import React, { useMemo } from "react";
import PoolBall from "../Component/PoolBall";
import PoolTable from "../Component/PoolTable";
import zero from "../Asset/textures/0.png";
import ten from "../Asset/textures/10.png";
import { useThree } from "react-three-fiber";
import Lines from "../Component/Lines";
import { getOBAndCB } from "../Utils/function";
import { BALL_DIAMETER } from "../constants";
import { lineMidpoint } from "geometric";
function Scene(props) {
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
  } = props;

  const [objBall, aimPoint, aiming1, aiming2] = useMemo(
    () => getOBAndCB(target, distance, cutAngle, eyeDistance),
    [target, distance, cutAngle, eyeDistance]
  );

  const [
    aimingLine,
    eyePosition,
    cueBall,
    minEyeRotatePosition,
    maxEyeRotatePosition,
  ] =
    side === "left" && aiming1.aimingLine
      ? [
          aiming1.aimingLine,
          aiming1.eyePosition,
          aiming1.cueBall,
          aiming1.minEyeRotatePosition,
          aiming1.maxEyeRotatePosition,
        ]
      : side === "right" && aiming2.aimingLine
      ? [
          aiming2.aimingLine,
          aiming2.eyePosition,
          aiming2.cueBall,
          aiming2.minEyeRotatePosition,
          aiming2.maxEyeRotatePosition,
        ]
      : [0, 0, 7];

  gl.setClearColor(0xdddd, 0.3);

  camera.fov = 50;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.near = 0.1;
  camera.far = 1000;
  camera.up.set(0, 0, 1);
  camera.position.set(eyePosition[0], eyePosition[1], 1.8 + eyeHeight * 5.2);

  [camera.position.y, camera.position.x, camera.position.z] =
    minEyeRotatePosition[1] < maxEyeRotatePosition[1]
      ? [
          eyePosition[1] +
            rotateAngle * (maxEyeRotatePosition[1] - eyePosition[1]),
          eyePosition[0] +
            rotateAngle * (maxEyeRotatePosition[0] - eyePosition[0]),
          1.8 + eyeHeight * 5.2,
        ]
      : [
          eyePosition[1] +
            rotateAngle * (minEyeRotatePosition[1] - eyePosition[1]),
          eyePosition[0] +
            rotateAngle * (maxEyeRotatePosition[0] - eyePosition[0]),
          1.8 + eyeHeight * 5.2,
        ];
  camera.updateProjectionMatrix();

  // console.log(camera.position);
  // console.log("cue ball:", cueBall);

  const cueLine = [camera.position.x, camera.position.y, camera.position.z];
  const cueLineMidPoint = lineMidpoint([cueLine, cueBall]);
  // console.log("hand:", cueLine);
  // console.log("eye:", eyePosition);
  camera.lookAt(...cueBall);

  return (
    <React.Suspense>
      <PoolTable />
      <PoolBall position={objBall} textureURL={ten} opacity={1} />

      <Lines start={cueLineMidPoint} end={cueBall} />

      <PoolBall position={cueBall} textureURL={zero} opacity={1} />
      {/* <Lines start={objBall} end={cueBall} /> */}

      {showAimPoint && (
        <PoolBall position={aimPoint} textureURL={zero} opacity={0.4} />
      )}

      {/* <Lines start={target[1]} end={objBall} /> */}

      {/* <Lines start={aimingLine[0]} end={aimingLine[1]} /> */}
    </React.Suspense>
  );
}

export default Scene;
