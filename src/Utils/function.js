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
  lineLength,
} from "geometric";

export const getRandomOB = () => {
  return [
    Math.random() * 2 * cross.X - cross.X,
    Math.random() * 2 * cross.Y - cross.Y,
    BALL_DIAMETER / 2,
  ];
};

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

// export const getEyePosition = (outsidePoint, angle, eyeDistance) => {
//   const minEyePosition = outsidePoint
//     ? pointTranslate(
//         outsidePoint,
//         angle,
//         5 / Math.cos(Math.abs(angleToRadians(angle)))
//       )
//     : [0, 0];
//   return pointTranslate(minEyePosition, angle - 180, eyeDistance * 14);
// };

// export const getEyePositionFromOBToCB = (objBall, cueBall, eyeDistance) => {
//   const angle = lineAngle([objBall, cueBall]);
//   const checkPoint = pointRotate(objBall, angle - 180, cueBall);
//   const [reverseLine, crossPoints, outsidePoint] = getCrossPoint(
//     [objBall, cueBall],
//     checkPoint
//   );
//   return getEyePosition(outsidePoint, angle, eyeDistance);
// };

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
        315
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
  const lineOfCenter = [objBall, target[1]];

  const getAimingLine = (angle) => {
    const aimingLine2D = lineRotate(lineOfCenter, angle, aimPoint);
    const aimingAngle = lineAngle(aimingLine2D);

    const aimingLineCheckPoint = pointRotate(objBall, angle, aimPoint);
    const [aimingLine, outsidePoint] = getCrossPoint(
      aimingLine2D,
      aimingLineCheckPoint,
      aimPoint
    );

    // let aimingLine, outsidePoint;
    // if (
    //   pointOnLine(aimingLineCheckPoint, [aimPoint, points[0].value], 0.0000001)
    // ) {
    //   aimingLine = [
    //     [...aimPoint, BALL_DIAMETER / 2],
    //     [...points[0].value, BALL_DIAMETER / 2],
    //   ];
    //   outsidePoint = aimingCutOutside[points[0].key];
    // } else if (
    //   pointOnLine(aimingLineCheckPoint, [aimPoint, points[1].value], 0.0000001)
    // ) {
    //   aimingLine = [
    //     [...aimPoint, BALL_DIAMETER / 2],
    //     [...points[1].value, BALL_DIAMETER / 2],
    //   ];
    //   outsidePoint = aimingCutOutside[points[1].key];
    // } else {
    //   aimingLine = false;
    //   outsidePoint = false;
    // }

    const cueBall2D = aimingLine ? lineInterpolate(aimingLine)(0.3) : false;
    // const line = [cueBall.slice(0, 2), objBall];
    // const checkPoint2 = pointTranslate(
    //   objBall,
    //   lineAngle(line) - 180,
    //   BALL_DIAMETER
    // );

    // get position from cue ball to object ball
    const lineFromCBToOB = [cueBall2D, objBall];
    const angle2 = lineAngle(lineFromCBToOB);
    const aimPoint2 = pointTranslate(objBall, angle2, BALL_DIAMETER);

    const renderLine = getCrossPoint(lineFromCBToOB, objBall, aimPoint2);
    // const eyePosition2 = getEyePosition(
    //   renderLine[1],
    //   lineAngle([cueBall.slice(0, 2), objBall]) - 180,
    //   eyeDistance
    const minEyePosition = renderLine[1]
      ? pointTranslate(
          renderLine[1],
          angle2 - 180,
          8
          // 5 / Math.cos(Math.abs(angleToRadians(angle)))
        )
      : [0, 0];
    const eyePosition = pointTranslate(
      minEyePosition,
      angle2,
      eyeDistance * 14
    );

    // console.log("0", eyePosition);
    const lengthOfCBToOB = lineLength([cueBall2D, objBall]);
    const twoBallAngle =
      (Math.asin(BALL_DIAMETER / lengthOfCBToOB) * 180) / Math.PI;

    // console.log("angle:", twoBallAngle);
    // const lenghtOfCBToEye = lineLength(cueBall2D, eyePosition);
    const minEyeRotatePosition = pointRotate(
      eyePosition,
      twoBallAngle,
      cueBall2D
    );

    const maxEyeRotatePosition = pointRotate(
      eyePosition,
      -twoBallAngle,
      cueBall2D
    );
    // console.log("min:", minEyeRotatePosition);
    // console.log("max:", maxEyeRotatePosition);
    const cueBall = [...cueBall2D, BALL_DIAMETER / 2];

    return {
      aimingLine,
      cueBall,
      eyePosition,
      minEyeRotatePosition,
      maxEyeRotatePosition,
    };
  };

  return [
    [...objBall, BALL_DIAMETER / 2],
    [...aimPoint, BALL_DIAMETER / 2],
    getAimingLine(180 - cutAngle),
    getAimingLine(cutAngle - 180),
  ];
};

export const getAngleTwoBall = (ball1, ball2) => {
  const length = lineLength([ball1, ball2]);
  return 2 * Math.atan(BALL_DIAMETER / length);
};
