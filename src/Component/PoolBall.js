import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { CubeTextureLoader, TextureLoader, Vector2 } from "three";
import { BALL_SIZE } from "../constants";

function PoolBall({ setRef, position, textureURL }) {
  // const ballTexture = useMemo(() => {
  //   const path = textureURL.replace(".png", "") + "/";
  //   return new CubeTextureLoader()
  //     .setPath(path)
  //     .load([
  //       path + "px.png",
  //       path + "nx.png",
  //       path + "py.png",
  //       path + "ny.png",
  //       path + "pz.png",
  //       path + "nz.png",
  //     ]);
  // }, [textureURL]);
  // console.log(ballTexture);

  const ballTexture = useMemo(
    () => new TextureLoader().load(textureURL),
    [textureURL]
  );

  return (
    <mesh ref={setRef} position={position} speed={new Vector2()} castShadow>
      <sphereGeometry attach="geometry" args={[BALL_SIZE, 64, 32]} />
      <meshStandardMaterial
        attach="material"
        color={0xffffff}
        roughness={0.4}
        metalness={0.1}
        // envMap={ballTexture}
        // envMapIntensity={1}

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
