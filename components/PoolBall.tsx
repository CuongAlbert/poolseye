import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { TextureLoader } from "three";
import { BALL_DIAMETER } from "../constants";
import { Vector3 } from "@react-three/fiber";

export type PoolBallProps = {
  r: number;
  position: Vector3;
  textureURL: string;
  opacity: number;
};

function PoolBall({ r, position, textureURL, opacity }: PoolBallProps) {
  const ballTexture = useMemo(() => new TextureLoader().load(textureURL), [textureURL]);

  const mesh = useRef(null!);

  return (
    <mesh ref={mesh} position={position} castShadow>
      <sphereGeometry attach="geometry" args={[r, 64, 32]} />

      <meshStandardMaterial
        attach="material"
        color={0xffffff}
        roughness={0.05}
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
