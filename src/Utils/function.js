export const getCoordinateTopRails = (
  playFieldH,
  playFieldW,
  topRailsW,
  pocketSize,
  cushionW,
  z
) => {
  const pocketSide = pocketSize / Math.sqrt(2);
  const topRailSideH = playFieldH / 2 + cushionW - pocketSide;
  const topRailTopW = playFieldW + 2 * cushionW - 2 * pocketSide;
  const centerOfTopRailSideY = topRailSideH / 2 + pocketSize / 2;
  const centerOfTopRailSideX = playFieldW / 2 + cushionW + topRailsW / 2;
  const centerOfTopRailTopY = playFieldH / 2 + cushionW + topRailsW / 2;
  const getTopRailSideGeometry = [topRailsW, topRailSideH, z];
  const getTopRailsTopGeometry = [topRailTopW, topRailsW, z];
  const topRailSideCoordinate = [
    [-centerOfTopRailSideX, centerOfTopRailSideY, z / 2],
    [centerOfTopRailSideX, centerOfTopRailSideY, z / 2],
    [-centerOfTopRailSideX, -centerOfTopRailSideY, z / 2],
    [centerOfTopRailSideX, -centerOfTopRailSideY, z / 2],
  ];
  const topRailTopCoordinate = [
    [0, centerOfTopRailTopY, z / 2],
    [0, -centerOfTopRailTopY, z / 2],
  ];
  const cushion1Coordinate = [
    [-(playFieldW / 2 + cushionW), pocketSize / 2, 0],
    [playFieldW / 2 + cushionW, pocketSize / 2, z],
  ];
  const cushion2Coordinate = [
    [-(playFieldW / 2 + cushionW), -topRailSideH - pocketSize / 2, 0],
    [playFieldW / 2 + cushionW, -topRailSideH - pocketSize / 2, z],
  ];
  const cushion3Coordinate = [
    [-topRailTopW / 2, playFieldH / 2 + cushionW, 0],
    [topRailTopW / 2, -(playFieldH / 2 + cushionW), 0],
  ];

  return {
    pocketSide,
    topRailSideH,
    topRailTopW,
    getTopRailSideGeometry,
    getTopRailsTopGeometry,
    topRailSideCoordinate,
    topRailTopCoordinate,
    cushion1Coordinate,
    cushion2Coordinate,
    cushion3Coordinate,
  };
};
