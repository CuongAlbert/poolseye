import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { CubeTextureLoader, Vector2 } from "three";
import { BALL_SIZE } from "../constants";

function PoolBall({ setRef, position, textureURL }) {
  const ballTexture = useMemo(
    () => new CubeTextureLoader().load(textureURL),
    [textureURL]
  );

  console.log(ballTexture);

  return (
    <mesh ref={setRef} position={position} speed={new Vector2()} castShadow>
      <sphereGeometry args={[BALL_SIZE, 64, 32]} />
      <meshStandardMaterial
        color={0xffffff}
        roughness={0}
        metalness={0}
        envMap={ballTexture}
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
