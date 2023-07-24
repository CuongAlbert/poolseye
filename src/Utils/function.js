import {
  sidePocketPossibleAngle,
  BALL_DIAMETER,
  cross,
  outside,
} from "../constants";
import {
  pointTranslate,
  lineRotate,
  lineAngle,
  pointRotate,
  pointOnLine,
  lineInterpolate,
  angleToRadians,
} from "geometric";

export const getOBAndCBCoordinate = (
  target,
  distance,
  cutAngle,
  eyeDistance
) => {
  // target = bottomLeft -> angleRotate = 0 -> 90
  // target = bottomRight -> angleRotate = 90 -> 180
  // target = topRight -> angleRotate = 180 -> 270
  // target = topLeft -> angleRotate = 270 -> 360
  // target = sideLeft -> angleRotate = -sidePocketPossibleAngle -> sidePocketPossibleAngle
  // target = sideRight -> angleRotate = 180-sidePocketPossibleAngle -> sidePocketPossibleAngle-180

  const angle =
    target[0] === "bottomLeft"
      ? 45
      : // ? Math.random() * 90
      target[0] === "bottomRight"
      ? 135
      : // ? Math.random() * 90 + 90
      target[0] === "topRight"
      ? 225
      : // ? Math.random() * 90 + 180
      target[0] === "topLeft"
      ? // ? Math.random() * 90 + 270
        315
      : target[0] === "sideLeft"
      ? 0
      : 180;
  // ? Math.random() * 2 * sidePocketPossibleAngle - sidePocketPossibleAngle
  // : Math.random() * (180 - sidePocketPossibleAngle) +
  // 2 * sidePocketPossibleAngle;

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

    const aimingCutCross =
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
    const aimingCutOutside =
      aConst === 0
        ? {
            LeftSide: [-outside.X, bConst],
            RightSide: [outside.X, bConst],
          }
        : {
            LeftSide: [-outside.X, aConst * -outside.X + bConst],
            RightSide: [outside.X, aConst * outside.X + bConst],
            Top: [(outside.Y - bConst) / aConst, outside.Y],
            Bottom: [(-outside.Y - bConst) / aConst, -outside.Y],
          };

    let points = [];
    for (let [key, value] of Object.entries(aimingCutCross)) {
      if (
        value[0] >= -cross.X &&
        value[0] <= cross.X &&
        value[1] >= -cross.Y &&
        value[1] <= cross.Y
      ) {
        points.push({ key, value });
      }
    }

    let aimingLine, outsidePoint;
    if (
      pointOnLine(aimingLineCheckPoint, [aimPoint, points[0].value], 0.0000001)
    ) {
      aimingLine = [
        [...aimPoint, BALL_DIAMETER / 2],
        [...points[0].value, BALL_DIAMETER / 2],
      ];
      outsidePoint = aimingCutOutside[points[0].key];
    } else if (
      pointOnLine(aimingLineCheckPoint, [aimPoint, points[1].value], 0.0000001)
    ) {
      aimingLine = [
        [...aimPoint, BALL_DIAMETER / 2],
        [...points[1].value, BALL_DIAMETER / 2],
      ];
      outsidePoint = aimingCutOutside[points[1].key];
    } else {
      aimingLine = false;
      outsidePoint = false;
    }

    const minEyePosition = outsidePoint
      ? pointTranslate(outsidePoint, aimingAngle, 5)
      : [0, 0];
    const eyePosition = pointTranslate(
      minEyePosition,
      aimingAngle - 180,
      eyeDistance * 14
    );

    const cueBall = aimingLine
      ? [...lineInterpolate(aimingLine)(0.5), BALL_DIAMETER / 2]
      : false;
    return { aimingLine, cueBall, eyePosition };
  };

  return [
    [...ObjBall, BALL_DIAMETER / 2],
    [...aimPoint, BALL_DIAMETER / 2],
    getAimingLine(180 - cutAngle),
    getAimingLine(cutAngle - 180),
  ];
};
