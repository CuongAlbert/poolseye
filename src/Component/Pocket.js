// import { useMemo } from "react";
// import { getCoordinateTopRails } from "../Utils/function";
import { TABLE_SIZE } from "../constants";
import { CylinderGeometry, MeshBasicMaterial } from "three";

const Pocket = function () {
  // const topRails = useMemo(
  //   () =>
  //     getCoordinateTopRails(
  //       TABLE_SIZE.PLAY_FIELD_H,
  //       TABLE_SIZE.PLAY_FIELD_W,
  //       TABLE_SIZE.TOP_RAILS_W,
  //       TABLE_SIZE.POCKET_SIZE,
  //       TABLE_SIZE.CUSHIONS_W,
  //       TABLE_SIZE.Z_PARAM
  //     ),
  //   []
  // );

  const pocketGeometry = new CylinderGeometry(
    TABLE_SIZE.POCKET_SIZE,
    TABLE_SIZE.POCKET_SIZE,
    2,
    64
  );
  const pocketMaterial = new MeshBasicMaterial({ color: 0x00000 });
  const pocket5X = TABLE_SIZE.PLAY_FIELD_W / 2 + TABLE_SIZE.CUSHIONS_W;
  const pocket5Y = TABLE_SIZE.PLAY_FIELD_H / 2 + 2 * TABLE_SIZE.CUSHIONS_W;
  const pocket10X =
    pocket5X + TABLE_SIZE.POCKET_SIZE / 2 + TABLE_SIZE.CUSHIONS_W / 2;
  const pocketZ = 1.6 * TABLE_SIZE.Z_PARAM;
  const pocketCoordinate = [
    [-pocket5X, pocket5Y, -pocketZ],
    [pocket5X, pocket5Y, -pocketZ],
    [-pocket10X, 0, -pocketZ],
    [pocket10X, 0, -pocketZ],
    [-pocket5X, -pocket5Y, -pocketZ],
    [pocket5X, -pocket5Y, -pocketZ],
  ];

  return pocketCoordinate.map((pos, idx) => (
    <mesh
      key={idx}
      args={[pocketGeometry, pocketMaterial]}
      position={pos}
      rotation={[1.5708, 0, 0]}
    />
  ));
};

export default Pocket;
