import React, { useMemo } from "react";
import PoolBall from "../Component/PoolBall";
import PoolTable from "../Component/PoolTable";
import zero from "../Asset/textures/0.png";
import ten from "../Asset/textures/10.png";
import { useThree } from "react-three-fiber";
import Lines from "../Component/Lines";
import { getOBAndCBCoordinate } from "../Utils/function";
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
  } = props;

  const [ObjBall, aimPoint, aiming1, aiming2] = useMemo(
    () => getOBAndCBCoordinate(target, distance, cutAngle, eyeDistance),
    [target, distance, cutAngle, eyeDistance]
  );

  const cameraPosition =
    side === "left" && aiming1.aimingLine
      ? aiming1.eyePosition
      : side === "right" && aiming2.aimingLine
      ? aiming2.eyePosition
      : [0, 0, 7];

  gl.setClearColor(0xdddd, 0.3);

  camera.fov = 50;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.near = 0.1;
  camera.far = 1000;
  // camera.setFocalLength(5);
  camera.up.set(0, 0, 1);
  camera.position.set(
    cameraPosition[0],
    cameraPosition[1],
    1.8 + eyeHeight * 5.2
  );
  camera.lookAt(aimPoint[0], aimPoint[1], aimPoint[2]);

  return (
    <React.Suspense>
      <PoolTable />
      <PoolBall position={ObjBall} textureURL={ten} />
      {side === "left" && aiming1.cueBall && (
        <PoolBall position={aiming1.cueBall} textureURL={zero} />
      )}
      {side === "right" && aiming2.cueBall && (
        <PoolBall position={aiming2.cueBall} textureURL={zero} />
      )}
      {showAimPoint && <PoolBall position={aimPoint} textureURL={zero} />}

      <Lines start={target[1]} end={ObjBall} />

      {side === "left" && aiming1.aimingLine && (
        <Lines start={aiming1.aimingLine[0]} end={aiming1.aimingLine[1]} />
      )}
      {side === "right" && aiming2.aimingLine && (
        <Lines start={aiming2.aimingLine[0]} end={aiming2.aimingLine[1]} />
      )}
    </React.Suspense>
  );
}

export default Scene;
