import { possibleAngle, BALL_DIAMETER, cross } from "../constants";
import {
  pointTranslate,
  lineRotate,
  lineAngle,
  pointRotate,
  pointOnLine,
  lineInterpolate,
  angleToRadians,
} from "geometric";

export const getOBAndCBCoordinate = (target, distance, cutAngle) => {
  // target = bottomLeft -> angleRotate = 0 -> 90
  // target = bottomRight -> angleRotate = 90 -> 180
  // target = topRight -> angleRotate = 180 -> 270
  // target = topLeft -> angleRotate = 270 -> 360
  // target = sideLeft -> angleRotate = -possibleAngle -> possibleAngle
  // target = sideRight -> angleRotate = 180-possibleAngle -> possibleAngle-180

  const angle =
    target[0] === "bottomLeft"
      ? Math.random() * 90
      : target[0] === "bottomRight"
      ? Math.random() * 90 + 90
      : target[0] === "topRight"
      ? Math.random() * 90 + 180
      : target[0] === "topLeft"
      ? Math.random() * 90 + 270
      : target[0] === "sideLeft"
      ? Math.random() * 2 * possibleAngle - possibleAngle
      : Math.random() * (180 - possibleAngle) + 2 * possibleAngle;

  const ObjBall = pointTranslate(target[1].slice(0, 2), angle, distance);

  const impactLineAngle = lineAngle([ObjBall, target[1].slice(0, 2)]);

  const aimPoint = pointTranslate(
    ObjBall,
    impactLineAngle - 180,
    BALL_DIAMETER
  );
  const lineOfCenter = [ObjBall, target[1]];

  const getAimingLine = (angle) => {
    const aimingLine2D = lineRotate(lineOfCenter, angle, aimPoint);

    const aimingLineCheckPoint = pointRotate(ObjBall, angle, aimPoint);
    const aimingAngle = lineAngle(aimingLine2D);
    const aConst = Math.tan(angleToRadians(aimingAngle));
    const bConst = aimPoint[1] - aConst * aimPoint[0];

    const aimingCut =
      aConst === 0
        ? {
            LeftSide: [-cross.X, bConst],
            RightSide: [cross.X, bConst],
          }
        : {
            LeftSide: [-cross.X, aConst * -cross.X + bConst],
            RightSide: [cross.X, aConst * cross.X + bConst],
            Top: [(cross.Y - bConst) / aConst, cross.Y],
            Bottom: [(-cross.Y - bConst) / aConst, -cross.Y],
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
      aimingLineCheckPoint,
      [aimPoint, points[0]],
      0.0000001
    )
      ? [
          [...aimPoint, BALL_DIAMETER / 2],
          [...points[0], BALL_DIAMETER / 2],
        ]
      : pointOnLine(aimingLineCheckPoint, [aimPoint, points[1]], 0.0000001)
      ? [
          [...aimPoint, BALL_DIAMETER / 2],
          [...points[1], BALL_DIAMETER / 2],
        ]
      : false;

    const cueBall = aimingLine
      ? [...lineInterpolate(aimingLine)(Math.random()), BALL_DIAMETER / 2]
      : false;
    return { aimingLine, cueBall };
  };

  return [
    [...ObjBall, BALL_DIAMETER / 2],
    [...aimPoint, BALL_DIAMETER / 2],
    getAimingLine(180 - cutAngle),
    getAimingLine(cutAngle - 180),
  ];
};
