import React, { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, MeshStandardMaterial, Texture } from "three";
import { TABLE_SIZE } from "../constants";
// import Cloth from "../assets/textures/cloth.jpg";
import Pocket from "./Pocket";
import RailsTable from "./RailsTable";

function PoolTable() {
  const cloth = require("../assets/textures/cloth.jpg");
  const clothMaterial: Texture = useMemo(
    () => new TextureLoader().load(cloth),
    [cloth]
  );
  const mesh = useRef();

  // useFrame(() => {
  //   if (mesh.current) {
  //     mesh.current.rotation.z += 0.001;
  //   }

  //   // console.log(translationX.value);
  // });
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
          roughness={0.4}
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
