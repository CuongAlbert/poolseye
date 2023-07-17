import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { TextureLoader, Vector2 } from "three";
import { BALL_SIZE } from "../constants";

function PoolBall({ setRef, position, textureURL }) {
  const ballTexture = useMemo(
    () => new TextureLoader().load(textureURL),
    [textureURL]
  );

  return (
    <mesh ref={setRef} position={position} speed={new Vector2()} castShadow>
      <sphereGeometry attach="geometry" args={[BALL_SIZE / 2, 64, 32]} />
      <meshStandardMaterial
        attach="material"
        color={0xffffff}
        roughness={0.25}
        metalness={0}
        map={ballTexture}
      />
    </mesh>
  );
}

PoolBall.propTypes = {
  setRef: PropTypes.objectOf(PropTypes.any),
  position: PropTypes.arrayOf(PropTypes.number),
  textureURL: PropTypes.string,
};

PoolBall.defaultProps = {
  setRef: {},
  position: [],
  textureURL: "",
};

export default PoolBall;
