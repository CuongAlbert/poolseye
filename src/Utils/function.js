import { BALL_DIAMETER, cross, outside } from "../constants";
import {
  pointTranslate,
  lineRotate,
  lineAngle,
  pointRotate,
  pointOnLine,
  lineInterpolate,
  angleToRadians,
  lineLength,
  angleToDegrees,
} from "geometric";

// get random Object Ball

export const getRandomOB = () => {
  return [
    Math.random() * 2 * cross.X - cross.X,
    Math.random() * 2 * cross.Y - cross.Y,
    BALL_DIAMETER / 2,
  ];
};
// give line, return point of line and out cover line
export const getCrossPoint = (line, checkPoint, aimPoint) => {
  const angle = lineAngle(line);
  const aConst = Math.tan(angleToRadians(angle));
  const bConst = line[0][1] - aConst * line[0][0];

  const lineCutCross =
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
  const lineCutOutside =
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

  let crossPoints = [];
  for (let [key, value] of Object.entries(lineCutCross)) {
    if (
      value[0] >= -cross.X &&
      value[0] <= cross.X &&
      value[1] >= -cross.Y &&
      value[1] <= cross.Y
    ) {
      crossPoints.push({ key, value });
    }
  }
  let reverseLine, outsidePoint;
  if (pointOnLine(checkPoint, [aimPoint, crossPoints[0].value], 0.0000001)) {
    reverseLine = [
      [...aimPoint, BALL_DIAMETER / 2],
      [...crossPoints[0].value, BALL_DIAMETER / 2],
    ];
    outsidePoint = lineCutOutside[crossPoints[0].key];
  } else if (
    pointOnLine(checkPoint, [aimPoint, crossPoints[1].value], 0.0000001)
  ) {
    reverseLine = [
      [...aimPoint, BALL_DIAMETER / 2],
      [...crossPoints[1].value, BALL_DIAMETER / 2],
    ];
    outsidePoint = lineCutOutside[crossPoints[1].key];
  } else {
    reverseLine = false;
    outsidePoint = false;
  }
  return [reverseLine, outsidePoint];
};

// give line, return position of camera in line

export const getEyePosition = (line, outsidePoint, eyeDistance) => {
  const minEyePosition = outsidePoint
    ? pointTranslate(
        outsidePoint,
        lineAngle(line) - 180,
        8
        // 5 / Math.cos(Math.abs(angleToRadians(angle)))
      )
    : [0, 0];
  const eyePosition = pointTranslate(
    minEyePosition,
    lineAngle(line),
    eyeDistance * 14
  );
  return eyePosition;
};

// give 2 line, return angle of two line

// export const getTwoLineAngle = (line1, line2) => {
//   const aConst1 = Math.tan(angleToRadians(lineAngle(line1)));
//   const aConst2 = Math.tan(angleToRadians(lineAngle(line2)));

//   return angleToDegrees(
//     Math.atan(Math.abs((aConst1 - aConst2) / (1 + aConst1 * aConst2)))
//   );
// };

// give target, cut angle, return cue ball, object ball, aim line,

export const getOBAndCB = (target, distance, cutAngle, eyeDistance) => {
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
        300
      : target[0] === "sideLeft"
      ? 0
      : 180;
  // ? Math.random() * 2 * sidePocketPossibleAngle - sidePocketPossibleAngle
  // : Math.random() * (180 - sidePocketPossibleAngle) +
  // 2 * sidePocketPossibleAngle;

  const objBall = pointTranslate(target[1].slice(0, 2), angle, distance);

  const impactLineAngle = lineAngle([objBall, target[1].slice(0, 2)]);

  const aimPoint = pointTranslate(
    objBall,
    impactLineAngle - 180,
    BALL_DIAMETER
  );
  const lineOfCenter = [objBall, target[1].slice(0, 2)];

  const getAimingLine = (angle) => {
    const aimingLine2D = lineRotate(lineOfCenter, angle, aimPoint);
    const aimingLineCheckPoint = pointRotate(objBall, angle, aimPoint);
    const [aimingLine, outsidePoint] = getCrossPoint(
      aimingLine2D,
      aimingLineCheckPoint,
      aimPoint
    );

    const cueBall2D = aimingLine ? lineInterpolate(aimingLine)(0.3) : false;

    const correctEyePosition = getEyePosition(
      [cueBall2D, aimPoint],
      outsidePoint,
      eyeDistance
    );

    // get camera position from cue ball to object ball
    const lineFromCBToOB = [cueBall2D, objBall];
    const angle2 = lineAngle(lineFromCBToOB);
    const aimPoint2 = pointTranslate(objBall, angle2, BALL_DIAMETER);

    const renderLine = getCrossPoint(lineFromCBToOB, objBall, aimPoint2);
    const eyePosition = getEyePosition(
      lineFromCBToOB,
      renderLine[1],
      eyeDistance
    );

    const lengthOfCBToOB = lineLength([cueBall2D, objBall]);
    const twoBallAngle =
      (Math.asin(BALL_DIAMETER / lengthOfCBToOB) * 180) / Math.PI;

    // const minEyeRotatePosition = pointRotate(
    //   eyePosition,
    //   twoBallAngle,
    //   cueBall2D
    // );

    // const maxEyeRotatePosition = pointRotate(
    //   eyePosition,
    //   -twoBallAngle,
    //   cueBall2D
    // );
    const cueBall = [...cueBall2D, BALL_DIAMETER / 2];

    return {
      aimingLine,
      cueBall,
      eyePosition,
      twoBallAngle,
      correctEyePosition,
    };
  };

  // get camera position from object ball to target
  const angleB = lineAngle(lineOfCenter);
  const aimPointB = pointTranslate(objBall, angleB, BALL_DIAMETER);

  const renderLineB = getCrossPoint(lineOfCenter, objBall, aimPointB);
  const eyePositionB = getEyePosition(
    lineOfCenter,
    renderLineB[1],
    eyeDistance
  );

  return [
    eyePositionB,
    [...objBall, BALL_DIAMETER / 2],
    [...aimPoint, BALL_DIAMETER / 2],
    getAimingLine(180 - cutAngle),
    getAimingLine(cutAngle - 180),
  ];
};

// give cue ball,object ball and target, return camera position that pick object ball to target

export const getLimitPosition = (
  limitTarget,
  objBall,
  cueBall,
  eyeDistance
) => {
  const aimPoint1 = pointTranslate(
    objBall,
    lineAngle([limitTarget, objBall]),
    BALL_DIAMETER
  );
  const limitLine = getCrossPoint([cueBall, aimPoint1], cueBall, aimPoint1);
  const eyeLimitPosition = getEyePosition(
    [cueBall, aimPoint1],
    limitLine[1],
    eyeDistance
  );
  return [eyeLimitPosition, aimPoint1];
};
