import React, { useMemo } from "react";
import { useLoader } from "react-three-fiber";

import {
  TextureLoader,
  RepeatWrapping,
  Shape,
  ExtrudeGeometry,
  BoxGeometry,
  MeshStandardMaterial,
  CylinderGeometry,
  MeshBasicMaterial,
} from "three";
import { TABLE_SIZE } from "../constants";
import Cloth from "../Asset/textures/cloth.jpg";
import Hardwood from "../Asset/textures/hardwood_floor.jpg";

const getCoordinateTable = (
  hTable,
  wTable,
  sideThick,
  holeSize,
  widthCursor,
  z
) => {
  const holeSide = holeSize / Math.sqrt(2);
  const hSideGeometry = hTable / 2 - holeSize - holeSide;
  const wSideGeometry = wTable - holeSide - holeSize;
  const centerHSide = hSideGeometry / 2 + holeSize;
  const getHBoxSizeGeometry = [sideThick, hSideGeometry, z];
  const getWBoxSizeGeometry = [wSideGeometry, sideThick, z];
  const coordinateSide = [
    [-((wTable + sideThick) / 2 + widthCursor), centerHSide, z],
    [(wTable + sideThick) / 2 + widthCursor, centerHSide, z],
    [-((wTable + sideThick) / 2 + widthCursor), -centerHSide, z],
    [(wTable + sideThick) / 2 + widthCursor, -centerHSide, z],
  ];
  const coordinateTop = [
    [0, hTable / 2 + sideThick / 2 + widthCursor, z],
    [0, -(hTable / 2 + sideThick / 2 + widthCursor), z],
  ];
  return [
    holeSide,
    hSideGeometry,
    wSideGeometry,
    coordinateSide,
    coordinateTop,
    getHBoxSizeGeometry,
    getWBoxSizeGeometry,
  ];
};
function PoolTable() {
  const tableSize = TABLE_SIZE;
  const [
    holeSide,
    hSideGeometry,
    wSideGeometry,
    coordinateSide,
    coordinateTop,
    getHBoxSizeGeometry,
    getWBoxSizeGeometry,
  ] = useMemo(
    () =>
      getCoordinateTable(
        tableSize.TABLE_HEIGHT,
        tableSize.TABLE_WIDTH,
        tableSize.SIDE_THICK - tableSize.WIDTH_CURSOR,
        tableSize.HOLE_SIZE,
        tableSize.WIDTH_CURSOR,
        tableSize.Z_PARAM
      ),
    [
      tableSize.TABLE_HEIGHT,
      tableSize.TABLE_WIDTH,
      tableSize.SIDE_THICK,
      tableSize.HOLE_SIZE,
      tableSize.WIDTH_CURSOR,
      tableSize.Z_PARAM,
    ]
  );

  const shape1 = new Shape();
  shape1.moveTo(0, 0);
  shape1.lineTo(0, hSideGeometry);
  shape1.lineTo(tableSize.WIDTH_CURSOR, hSideGeometry - tableSize.WIDTH_CURSOR);
  shape1.lineTo(tableSize.WIDTH_CURSOR, 0.08);
  shape1.lineTo(0, 0);

  const shape2 = new Shape();
  shape2.moveTo(0, 0);
  shape2.lineTo(0, hSideGeometry);
  shape2.lineTo(tableSize.WIDTH_CURSOR, hSideGeometry - 0.08);
  shape2.lineTo(0.3, tableSize.WIDTH_CURSOR);
  shape2.lineTo(0, 0);

  const shape3 = new Shape();
  shape3.moveTo(0, 0);
  shape3.lineTo(0, wSideGeometry);
  shape3.lineTo(tableSize.WIDTH_CURSOR, wSideGeometry - tableSize.WIDTH_CURSOR);
  shape3.lineTo(tableSize.WIDTH_CURSOR, tableSize.WIDTH_CURSOR);
  shape3.lineTo(0, 0);

  const extrudeSettings = {
    steps: 2,
    depth: tableSize.Z_PARAM,
    bevelEnabled: false,
  };
  const cushion1Geometry = new ExtrudeGeometry(shape1, extrudeSettings);
  const cushion2Geometry = new ExtrudeGeometry(shape2, extrudeSettings);
  const cushion3Geometry = new ExtrudeGeometry(shape3, extrudeSettings);
  const clothMaterial = new MeshStandardMaterial({
    color: 0x42a8ff,
    roughness: 0.4,
    bumpScale: 1,
  });

  const edgeSideGeometry = new BoxGeometry(
    getHBoxSizeGeometry[0],
    getHBoxSizeGeometry[1],
    getHBoxSizeGeometry[2]
  );

  const edgeTopGeometry = new BoxGeometry(
    getWBoxSizeGeometry[0],
    getWBoxSizeGeometry[1],
    getWBoxSizeGeometry[2]
  );
  const pocketGeometry = new CylinderGeometry(
    tableSize.HOLE_SIZE * 1.2,
    tableSize.HOLE_SIZE,
    0.5,
    64
  );
  const pocketMaterial = new MeshBasicMaterial({ color: "grey" });
  const clothTexture = useLoader(TextureLoader, Cloth);
  const woodTexture = useLoader(TextureLoader, Hardwood);
  const edgeMaterial = new MeshStandardMaterial({ map: woodTexture });
  clothMaterial.map = clothTexture;

  return (
    <>
      <mesh receiveShadow>
        <boxGeometry
          attach="geometry"
          args={[
            tableSize.TABLE_WIDTH + 2 * tableSize.WIDTH_CURSOR,
            tableSize.TABLE_HEIGHT + 2 * tableSize.WIDTH_CURSOR,
            tableSize.Z_PARAM,
          ]}
        />
        <meshStandardMaterial
          attach="material"
          color={0x42a8ff}
          roughness={0.4}
          bumpScale={1}
          map={clothTexture}
        />
      </mesh>
      {coordinateSide.map((pos, idx) => (
        <mesh
          key={idx}
          args={[edgeSideGeometry, edgeMaterial]}
          position={pos}
        />
      ))}

      {coordinateTop.map((pos, idx) => (
        <mesh key={idx} args={[edgeTopGeometry, edgeMaterial]} position={pos} />
      ))}

      {[
        [
          -tableSize.TABLE_WIDTH / 2 - tableSize.WIDTH_CURSOR,
          tableSize.HOLE_SIZE,
          0,
        ],
        [
          tableSize.TABLE_WIDTH / 2 + tableSize.WIDTH_CURSOR,
          tableSize.HOLE_SIZE,
          TABLE_SIZE.Z_PARAM,
        ],
      ].map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion1Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        />
      ))}

      {[
        [
          -tableSize.TABLE_WIDTH / 2 - tableSize.WIDTH_CURSOR,
          -tableSize.TABLE_HEIGHT / 2 + holeSide,
          0,
        ],
        [
          tableSize.TABLE_WIDTH / 2 + tableSize.WIDTH_CURSOR,
          -tableSize.TABLE_HEIGHT / 2 + holeSide,
          tableSize.Z_PARAM,
        ],
      ].map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion2Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        />
      ))}

      {[
        [
          -wSideGeometry / 2,
          tableSize.TABLE_HEIGHT / 2 + tableSize.WIDTH_CURSOR,
          tableSize.Z_PARAM / 2,
        ],
        [
          wSideGeometry / 2,
          -(tableSize.TABLE_HEIGHT / 2 + tableSize.WIDTH_CURSOR),
          tableSize.Z_PARAM / 2,
        ],
      ].map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion3Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 0 ? [0, 0, -Math.PI / 2] : [0, 0, Math.PI / 2]}
        />
      ))}

      {[
        [
          -(tableSize.TABLE_WIDTH / 2 + tableSize.WIDTH_CURSOR),
          tableSize.TABLE_HEIGHT / 2 + tableSize.WIDTH_CURSOR,
          0,
        ],
        [
          tableSize.TABLE_WIDTH / 2 + tableSize.WIDTH_CURSOR,
          tableSize.TABLE_HEIGHT / 2 + tableSize.WIDTH_CURSOR,
          0,
        ],
        [
          -(tableSize.TABLE_WIDTH / 2 + holeSide + tableSize.WIDTH_CURSOR),
          0,
          0,
        ],
        [tableSize.TABLE_WIDTH / 2 + holeSide + tableSize.WIDTH_CURSOR, 0, 0],
        [
          -(tableSize.TABLE_WIDTH / 2 + tableSize.WIDTH_CURSOR),
          -(tableSize.TABLE_HEIGHT / 2 + tableSize.WIDTH_CURSOR),
          0,
        ],
        [
          tableSize.TABLE_WIDTH / 2 + tableSize.WIDTH_CURSOR,
          -(tableSize.TABLE_HEIGHT / 2 + tableSize.WIDTH_CURSOR),
          0,
        ],
      ].map((pos, idx) => (
        <mesh
          key={idx}
          args={[pocketGeometry, pocketMaterial]}
          position={pos}
          rotation={[1.5708, 0, 0]}
        />
      ))}
    </>
  );
}
export default PoolTable;
