import { angleToDegrees } from "geometric";

// 1px = 10cm
export const LIGHT_PARAM = {
  LIGHT_HEIGHT: 30,
  LIGHT_ROW: 6,
  LIGHT_COL: 6,
  ROW_DISTANCE: 12,
  COL_DISTANCE: 24,
};
export const TABLE_SIZE = {
  PLAY_FIELD_H: 25.4,
  PLAY_FIELD_W: 12.7,
  POCKET_SIZE: 1.13,
  TOP_RAILS_W: 1.27,
  CUSHIONS_W: 0.51,
  Z_PARAM: 0.4,
};
export const BALL_DIAMETER = 0.57;

export const FACING_ANGLE = (Math.PI / 180) * 40;
export const SHELF_DEPTH = 0.4;

export const pocketSide = TABLE_SIZE.POCKET_SIZE / Math.sqrt(2);
export const topRailSideH =
  TABLE_SIZE.PLAY_FIELD_H / 2 -
  TABLE_SIZE.POCKET_SIZE / 2 +
  TABLE_SIZE.CUSHIONS_W -
  pocketSide;
export const topRailTopW =
  TABLE_SIZE.PLAY_FIELD_W + 2 * TABLE_SIZE.CUSHIONS_W - 2 * pocketSide;
export const centerOfTopRailSideY =
  topRailSideH / 2 + TABLE_SIZE.POCKET_SIZE / 2;
export const centerOfTopRailSideX =
  TABLE_SIZE.PLAY_FIELD_W / 2 +
  TABLE_SIZE.CUSHIONS_W +
  TABLE_SIZE.TOP_RAILS_W / 2;
export const centerOfTopRailTopY =
  TABLE_SIZE.PLAY_FIELD_H / 2 +
  TABLE_SIZE.CUSHIONS_W +
  TABLE_SIZE.TOP_RAILS_W / 2;
export const getRailSideGeometry = [
  TABLE_SIZE.TOP_RAILS_W,
  topRailSideH,
  TABLE_SIZE.Z_PARAM,
];
export const getRailsTopGeometry = [
  topRailTopW,
  TABLE_SIZE.TOP_RAILS_W,
  TABLE_SIZE.Z_PARAM,
];
export const railSideCoordinate = [
  [-centerOfTopRailSideX, centerOfTopRailSideY, TABLE_SIZE.Z_PARAM / 2],
  [centerOfTopRailSideX, centerOfTopRailSideY, TABLE_SIZE.Z_PARAM / 2],
  [-centerOfTopRailSideX, -centerOfTopRailSideY, TABLE_SIZE.Z_PARAM / 2],
  [centerOfTopRailSideX, -centerOfTopRailSideY, TABLE_SIZE.Z_PARAM / 2],
];
export const railTopCoordinate = [
  [0, centerOfTopRailTopY, TABLE_SIZE.Z_PARAM / 2],
  [0, -centerOfTopRailTopY, TABLE_SIZE.Z_PARAM / 2],
];
export const cushion1Coordinate = [
  [
    -(TABLE_SIZE.PLAY_FIELD_W / 2 + TABLE_SIZE.CUSHIONS_W),
    TABLE_SIZE.POCKET_SIZE / 2,
    0,
  ],
  [
    TABLE_SIZE.PLAY_FIELD_W / 2 + TABLE_SIZE.CUSHIONS_W,
    TABLE_SIZE.POCKET_SIZE / 2,
    TABLE_SIZE.Z_PARAM,
  ],
];
export const cushion2Coordinate = [
  [
    -(TABLE_SIZE.PLAY_FIELD_W / 2 + TABLE_SIZE.CUSHIONS_W),
    -topRailSideH - TABLE_SIZE.POCKET_SIZE / 2,
    0,
  ],
  [
    TABLE_SIZE.PLAY_FIELD_W / 2 + TABLE_SIZE.CUSHIONS_W,
    -topRailSideH - TABLE_SIZE.POCKET_SIZE / 2,
    TABLE_SIZE.Z_PARAM,
  ],
];
export const cushion3Coordinate = [
  [-topRailTopW / 2, TABLE_SIZE.PLAY_FIELD_H / 2 + TABLE_SIZE.CUSHIONS_W, 0],
  [topRailTopW / 2, -(TABLE_SIZE.PLAY_FIELD_H / 2 + TABLE_SIZE.CUSHIONS_W), 0],
];

export const targetPointCoordinate = {
  sideX: TABLE_SIZE.PLAY_FIELD_W / 2,
  sideY:
    TABLE_SIZE.PLAY_FIELD_H / 2 +
    TABLE_SIZE.CUSHIONS_W -
    TABLE_SIZE.POCKET_SIZE / Math.sqrt(2) -
    TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE),
  topX:
    TABLE_SIZE.PLAY_FIELD_W / 2 -
    TABLE_SIZE.POCKET_SIZE / Math.sqrt(2) -
    TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE),
  topY: TABLE_SIZE.PLAY_FIELD_H / 2,
};

export const targetLimitPoint = {
  topRight: [
    "topRight",
    [targetPointCoordinate.sideX, targetPointCoordinate.sideY],
    [targetPointCoordinate.topX, targetPointCoordinate.topY],
  ],
  topLeft: [
    "topLeft",
    [-targetPointCoordinate.sideX, targetPointCoordinate.sideY],
    [-targetPointCoordinate.topX, targetPointCoordinate.topY],
  ],
  bottomLeft: [
    "bottomLeft",
    [-targetPointCoordinate.sideX, -targetPointCoordinate.sideY],
    [-targetPointCoordinate.topX, -targetPointCoordinate.topY],
  ],
  bottomRight: [
    "bottomRight",
    [targetPointCoordinate.sideX, -targetPointCoordinate.sideY],
    [targetPointCoordinate.topX, -targetPointCoordinate.topY],
  ],
  sideLeft: [
    "sideLeft",
    [-TABLE_SIZE.PLAY_FIELD_W / 2, TABLE_SIZE.POCKET_SIZE / 2 + 0.1],
    [-TABLE_SIZE.PLAY_FIELD_W / 2, -(TABLE_SIZE.POCKET_SIZE / 2 + 0.1)],
  ],
  sideRight: [
    "sideRight",
    [TABLE_SIZE.PLAY_FIELD_W / 2, TABLE_SIZE.POCKET_SIZE / 2 + 0.1],
    [TABLE_SIZE.PLAY_FIELD_W / 2, -(TABLE_SIZE.POCKET_SIZE / 2 + 0.1)],
  ],
};

export const cross = {
  X: TABLE_SIZE.PLAY_FIELD_W / 2 - BALL_DIAMETER / 2,
  Y: TABLE_SIZE.PLAY_FIELD_H / 2 - BALL_DIAMETER / 2,
};
export const outside = {
  X:
    TABLE_SIZE.PLAY_FIELD_W / 2 +
    TABLE_SIZE.CUSHIONS_W +
    TABLE_SIZE.TOP_RAILS_W,
  Y:
    TABLE_SIZE.PLAY_FIELD_H / 2 +
    TABLE_SIZE.CUSHIONS_W +
    TABLE_SIZE.TOP_RAILS_W,
};
export const targetCoordinate = {
  topRight: ["topRight", [cross.X, cross.Y, BALL_DIAMETER / 2]],
  topLeft: ["topLeft", [-cross.X, cross.Y, BALL_DIAMETER / 2]],
  bottomLeft: ["bottomLeft", [-cross.X, -cross.Y, BALL_DIAMETER / 2]],
  bottomRight: ["bottomRight", [cross.X, -cross.Y, BALL_DIAMETER / 2]],
  sideRight: ["sideRight", [targetPointCoordinate.sideX, 0, BALL_DIAMETER / 2]],
  sideLeft: ["sideLeft", [-targetPointCoordinate.sideX, 0, BALL_DIAMETER / 2]],
};
// export const targetCoordinate = {
//   topRight: [...targetMidPoint.topRight, BALL_SIZE / 2],
//   topLeft: [...targetMidPoint.topLeft, BALL_SIZE / 2],
//   bottomLeft: [...targetMidPoint.bottomLeft, BALL_SIZE / 2],
//   bottomRight: [...targetMidPoint.bottomRight, BALL_SIZE / 2],
//   sideRight: [targetPointCoordinate.sideX, 0, BALL_SIZE / 2],
//   sideLeft: [-targetPointCoordinate.sideX, 0, BALL_SIZE / 2],
// };

export const sidePocketPossibleAngle =
  90 -
  angleToDegrees(Math.asin(BALL_DIAMETER / (TABLE_SIZE.POCKET_SIZE + 0.2)));
