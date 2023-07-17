import React, { useMemo } from "react";
import PoolBall from "../Component/PoolBall";
import PoolTable from "../Component/PoolTable";
import zero from "../Asset/textures/0.png";
import ten from "../Asset/textures/10.png";
import { BALL_SIZE, TABLE_SIZE } from "../constants";
import { useThree } from "react-three-fiber";
import Lines from "../Component/Lines";
import {
  angleToRadians,
  lineAngle,
  lineInterpolate,
  lineLength,
  lineMidpoint,
  lineRotate,
  pointTranslate,
} from "geometric";
import { pointOnLine } from "geometric";
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

  const BALL_Z = BALL_SIZE / 2;

  const targetBallCoordinate = useMemo(
    () => [
      Math.random() * 2 * (TABLE_SIZE.PLAY_FIELD_W / 2 - BALL_SIZE) -
        (TABLE_SIZE.PLAY_FIELD_W / 2 - BALL_SIZE),
      Math.random() * 2 * (TABLE_SIZE.PLAY_FIELD_H / 2 - BALL_SIZE) -
        (TABLE_SIZE.PLAY_FIELD_H / 2 - BALL_SIZE),
      BALL_Z,
    ],
    [BALL_Z]
  );

  const targetCoordinate = useMemo(() => {
    return {
      topRight: [
        TABLE_SIZE.PLAY_FIELD_W / 2,
        TABLE_SIZE.PLAY_FIELD_H / 2,
        BALL_Z,
      ],
      topLeft: [
        -TABLE_SIZE.PLAY_FIELD_W / 2,
        TABLE_SIZE.PLAY_FIELD_H / 2,
        BALL_Z,
      ],
      bottomLeft: [
        -TABLE_SIZE.PLAY_FIELD_W / 2,
        -TABLE_SIZE.PLAY_FIELD_H / 2,
        BALL_Z,
      ],
      bottomRight: [
        TABLE_SIZE.PLAY_FIELD_W / 2,
        -TABLE_SIZE.PLAY_FIELD_H / 2,
        BALL_Z,
      ],
      sideRight: [TABLE_SIZE.PLAY_FIELD_W / 2, 0, BALL_Z],
      sideLeft: [-TABLE_SIZE.PLAY_FIELD_W / 2, 0, BALL_Z],
    };
  }, [BALL_Z]);

  const cross = {
    X: TABLE_SIZE.PLAY_FIELD_W / 2 - BALL_Z,
    Y: TABLE_SIZE.PLAY_FIELD_H / 2 - BALL_Z,
  };

  const nearestTarget = useMemo(() => {
    let min = Infinity;
    let minKey;
    for (let key of Object.keys(targetCoordinate)) {
      let length = lineLength([
        targetBallCoordinate.slice(0, 2),
        targetCoordinate[key].slice(0, 2),
      ]);
      if (length <= min) {
        min = length;
        minKey = key;
      }
    }
    return minKey;
  }, [targetBallCoordinate, targetCoordinate]);

  const target = targetCoordinate[nearestTarget];

  const impactLineAngle = lineAngle([
    targetBallCoordinate.slice(0, 2),
    target.slice(0, 2),
  ]);

  const ghostBallCoordinate2D = pointTranslate(
    targetBallCoordinate.slice(0, 2),
    impactLineAngle - 180,
    BALL_SIZE
  );

  const lineOfCenter = lineRotate(
    [targetBallCoordinate, target],
    180,
    targetBallCoordinate
  );

  const cutAngle = 30;

  const aimingLine2D = lineRotate(
    lineOfCenter,
    cutAngle || -cutAngle,
    ghostBallCoordinate2D
  );

  const aimingLineMidPoint = lineMidpoint(aimingLine2D);

  const aimingAngle = lineAngle(aimingLine2D);
  const aConst = Math.tan(angleToRadians(aimingAngle));
  const bConst = ghostBallCoordinate2D[1] - aConst * ghostBallCoordinate2D[0];

  const aimingCut =
    aConst === 0
      ? {
          aimingCutLeftSide: [-cross.X, bConst],
          aimingCutRightSide: [cross.X, bConst],
        }
      : {
          aimingCutLeftSide: [-cross.X, aConst * -cross.X + bConst],
          aimingCutRightSide: [cross.X, aConst * cross.X + bConst],
          aimingCutTop: [(cross.Y - bConst) / aConst, cross.Y],
          aimingCutBottom: [(-cross.Y - bConst) / aConst, -cross.Y],
        };
  let points = [];

  for (let value of Object.values(aimingCut)) {
    if (
      value[0] >= -cross.X &&
      value[0] <= cross.X &&
      value[1] >= -cross.Y &&
      value[1] <= cross.Y
    )
      points.push(value);
  }
  const aimingLine = pointOnLine(
    aimingLineMidPoint,
    [ghostBallCoordinate2D, points[1]],
    0.0000001
  )
    ? [
        [...ghostBallCoordinate2D, BALL_Z],
        [...points[1], BALL_Z],
      ]
    : [
        [...ghostBallCoordinate2D, BALL_Z],
        [...points[0], BALL_Z],
      ];
  console.log("1:", aimingLine2D[1], "2:", points[1]);
  console.log(
    pointOnLine(aimingLine2D[1], [ghostBallCoordinate2D, points[1]], 0.0000001)
  );
  const randomCue = lineInterpolate(aimingLine)(Math.random());

  // const ghostBallCoordinate = [...ghostBallCoordinate2D, BALL_Z];

  return (
    <React.Suspense>
      <PoolTable />
      <PoolBall position={targetBallCoordinate} textureURL={ten} />
      <PoolBall position={[...randomCue, BALL_Z]} textureURL={zero} />
      {/* <PoolBall position={ghostBallCoordinate} textureURL={zero} /> */}
      <Lines start={target} end={targetBallCoordinate} />
      <Lines
        start={[...lineOfCenter[0], BALL_Z]}
        end={[...lineOfCenter[1], BALL_Z]}
      />
      <Lines start={aimingLine[0]} end={aimingLine[1]} />
      {/* <Lines
        start={[...aimingLine2D[0], BALL_Z]}
        end={[...aimingLine2D[1], BALL_Z]}
      /> */}
      {/* <Lines start={aimingLine[0]} end={[...points[0], BALL_Z]} /> */}
      {/* <Lines start={aimingLine[0]} end={[...points[1], BALL_Z]} /> */}
    </React.Suspense>
  );
}

export default Scene;
