import React, { useMemo } from "react";
// import LowBlock from "../Component/LowBlock";
import PoolBall from "../Component/PoolBall";
import PoolTable from "../Component/PoolTable";
import zero from "../Asset/textures/0.png";
import one from "../Asset/textures/1.png";
import { BALL_SIZE, TABLE_SIZE } from "../constants";
import { useThree } from "react-three-fiber";
function Scene() {
  const { camera, gl } = useThree();

  gl.setClearColor(0x151515, 1);
  gl.shadowMap.enabled = false;

  camera.fov = 45;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.near = 0.1;
  camera.far = 1000;

  camera.up.set(0, 0, 1);
  camera.position.set(-5, 7, 5);

  const targetBallCoordinate = [
    Math.random() * (TABLE_SIZE.TABLE_WIDTH / 2),
    Math.random() * (TABLE_SIZE.TABLE_HEIGHT / 2),
    BALL_SIZE / 2 + 1.2 * TABLE_SIZE.Z_PARAM,
  ];

  const getGhostBallCoordinate = (A, a) => {
    const aR = Math.atan(Math.abs(A[1] - a[1]) / (A[0] - a[0]));
    return [a[0] - BALL_SIZE * Math.cos(aR), a[1] - BALL_SIZE * Math.sin(aR)];
  };

  const ghostBallCoordinate = useMemo(
    () =>
      getGhostBallCoordinate(
        [TABLE_SIZE.TABLE_WIDTH / 2, TABLE_SIZE.TABLE_HEIGHT / 2],
        [targetBallCoordinate[0], targetBallCoordinate[1]]
      ),
    []
  );
  ghostBallCoordinate.push(BALL_SIZE * 1.2);

  return (
    <React.Suspense>
      <PoolTable />
      {/* <LowBlock /> */}
      <PoolBall
        position={[0, 0, BALL_SIZE / 2 + 1.2 * TABLE_SIZE.Z_PARAM]}
        textureURL={zero}
      />
      <PoolBall position={targetBallCoordinate} textureURL={one} />
      {/* <PoolBall position={ghostBallCoordinate} textureURL={zero} /> */}
    </React.Suspense>
  );
}

export default Scene;
