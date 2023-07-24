import { useLoader } from "react-three-fiber";

import { TextureLoader, MeshStandardMaterial } from "three";
import { TABLE_SIZE } from "../constants";
import Cloth from "../Asset/textures/cloth.jpg";
import TopRails from "./Rails";
import Pocket from "./Pocket";

function PoolTable() {
  const clothMaterial = new MeshStandardMaterial({
    color: 0x42a8ff,
    roughness: 0.4,
    bumpScale: 1,
  });
  const clothTexture = useLoader(TextureLoader, Cloth);
  clothMaterial.map = clothTexture;

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
    </>
  );
}
export default PoolTable;
