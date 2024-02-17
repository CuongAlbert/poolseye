import * as THREE from "three";
import React, { useMemo } from "react";
import { TextureLoader, Texture } from "three";
import { TABLE_SIZE } from "../constants";
import Pocket from "./Pocket";
import RailsTable from "./RailsTable";

function PoolTable() {
  const cloth = require("../assets/textures/mat_ban.png");
  const clothMaterial: Texture = useMemo(() => new TextureLoader().load(cloth), [cloth]);
  clothMaterial.wrapS = THREE.RepeatWrapping;
  clothMaterial.wrapT = THREE.RepeatWrapping;
  clothMaterial.offset.set(0, 0);
  // clothMaterial.repeat.set(0, 0);

  return (
    <>
      <mesh receiveShadow>
        <boxGeometry
          attach="geometry"
          args={[
            TABLE_SIZE.PLAY_FIELD_W + 2 * TABLE_SIZE.CUSHIONS_W,
            TABLE_SIZE.PLAY_FIELD_H + 2 * TABLE_SIZE.CUSHIONS_W,
            0.001,
          ]}
        />
        <meshStandardMaterial
          attach="material"
          color={0x42a8ff}
          roughness={1}
          bumpScale={1}
          map={clothMaterial}
        />
      </mesh>
      <Pocket />
      <RailsTable />
    </>
  );
}
export default React.memo(PoolTable);
