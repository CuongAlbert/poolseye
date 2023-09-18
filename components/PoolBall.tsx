import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
  TextureLoader,
  Vector2,
  MeshBasicMaterial,
  Mesh,
  BufferGeometry,
  Material,
  Object3DEventMap,
  NormalBufferAttributes,
} from "three";
import { BALL_DIAMETER } from "../constants";
import { Canvas, Vector3, useFrame } from "@react-three/fiber";
import { useSharedValue } from "react-native-reanimated";

export type Props = {
  position: Vector3;
  textureURL: string;
  opacity: number;
};

function PoolBall({ position, textureURL, opacity }: Props) {
  const ballTexture = useMemo(
    () => new TextureLoader().load(textureURL),
    [textureURL]
  );

  const mesh =
    useRef<
      Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[],
        Object3DEventMap
      >
    >();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x -= 0.1;
      // mesh.current.rotation.y += 0.05;
      // mesh.current.position.z += 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={position} speed={new Vector2()} castShadow>
      <sphereGeometry attach="geometry" args={[BALL_DIAMETER / 2, 64, 32]} />

      <meshStandardMaterial
        attach="material"
        color={0xffffff}
        roughness={0.25}
        metalness={0}
        map={ballTexture}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
}

PoolBall.propTypes = {
  ref: PropTypes.objectOf(PropTypes.any),
  position: PropTypes.arrayOf(PropTypes.number),
  textureURL: PropTypes.string,
};

PoolBall.defaultProps = {
  setRef: {},
  position: [],
  textureURL: "",
};

export default PoolBall;
