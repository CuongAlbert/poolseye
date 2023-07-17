// import React, { useMemo } from "react";
import { useLoader } from "react-three-fiber";

import {
  TextureLoader,
  MeshStandardMaterial,
  // CylinderGeometry,
  // MeshBasicMaterial,
} from "three";
import { TABLE_SIZE } from "../constants";
import Cloth from "../Asset/textures/cloth.jpg";
import TopRails from "./TopRails";
// import { getCoordinateTopRails } from "../Utils/function";
import Pocket from "./Pocket";

function PoolTable() {
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

  const clothMaterial = new MeshStandardMaterial({
    color: 0x42a8ff,
    roughness: 0.4,
    bumpScale: 1,
  });
  const clothTexture = useLoader(TextureLoader, Cloth);
  clothMaterial.map = clothTexture;

  // const pocketGeometry = new CylinderGeometry(
  //   TABLE_SIZE.POCKET_SIZE,
  //   TABLE_SIZE.POCKET_SIZE,
  //   2,
  //   64
  // );
  // const pocketMaterial = new MeshBasicMaterial({ color: "grey" });

  return (
    <>
      <mesh receiveShadow>
        <boxGeometry
          attach="geometry"
          args={[
            TABLE_SIZE.PLAY_FIELD_W + 2 * TABLE_SIZE.CUSHIONS_W,
            TABLE_SIZE.PLAY_FIELD_H + 2 * TABLE_SIZE.CUSHIONS_W,
            0.04,
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
      <TopRails />
      <Pocket />

      {/* {[
        [
          -(TABLE_SIZE.PLAY_FIELD_W / 2 + 2 * TABLE_SIZE.CUSHIONS_W),
          TABLE_SIZE.PLAY_FIELD_H / 2 + 2 * TABLE_SIZE.CUSHIONS_W,
          -1,
        ],
        [
          TABLE_SIZE.PLAY_FIELD_W / 2 + 2 * TABLE_SIZE.CUSHIONS_W,
          TABLE_SIZE.PLAY_FIELD_H / 2 + 2 * TABLE_SIZE.CUSHIONS_W,
          -1,
        ],
        [
          -(
            TABLE_SIZE.PLAY_FIELD_W / 2 +
            topRails.pocketSide +
            2 * TABLE_SIZE.CUSHIONS_W
          ),
          0,
          -1,
        ],
        [
          TABLE_SIZE.PLAY_FIELD_W / 2 +
            topRails.pocketSide +
            2 * TABLE_SIZE.CUSHIONS_W,
          0,
          -1,
        ],
        [
          -(TABLE_SIZE.PLAY_FIELD_W / 2 + 2 * TABLE_SIZE.CUSHIONS_W),
          -(TABLE_SIZE.PLAY_FIELD_H / 2 + 2 * TABLE_SIZE.CUSHIONS_W),
          -1,
        ],
        [
          TABLE_SIZE.PLAY_FIELD_W / 2 + 2 * TABLE_SIZE.CUSHIONS_W,
          -(TABLE_SIZE.PLAY_FIELD_H / 2 + 2 * TABLE_SIZE.CUSHIONS_W),
          -1,
        ],
      ].map((pos, idx) => (
        <mesh
          key={idx}
          args={[pocketGeometry, pocketMaterial]}
          position={pos}
          rotation={[1.5708, 0, 0]}
        />
      ))} */}
    </>
  );
}
export default PoolTable;
