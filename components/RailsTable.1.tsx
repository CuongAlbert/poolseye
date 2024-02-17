import * as THREE from "three";
import React, { useMemo } from "react";
import {
  TextureLoader,
  Texture,
  BoxGeometry,
  Shape,
  ExtrudeGeometry,
} from "three";
import {
  TABLE_SIZE,
  FACING_ANGLE,
  topRailSideH,
  topRailTopW,
  getRailSideGeometry,
  getRailsTopGeometry,
  railSideCoordinate,
  railTopCoordinate,
  cushion1Coordinate,
  cushion2Coordinate,
  cushion3Coordinate,
} from "../constants";

export const RailsTable = function () {
  const hardWood = require("../assets/textures/tablefloor.jpg");

  const railMaterial: Texture = useMemo(
    () => new TextureLoader().load(hardWood),
    [hardWood]
  );
  railMaterial.wrapS = THREE.RepeatWrapping;
  railMaterial.wrapT = THREE.RepeatWrapping;
  railMaterial.offset.set(0, 0);
  const cloth = require("../assets/textures/mat_ban.png");
  const clothMaterial: Texture = useMemo(
    () => new TextureLoader().load(cloth),
    [cloth]
  );
  // clothMaterial.offset = new Vector2(0, 1);
  clothMaterial.wrapS = THREE.RepeatWrapping;
  clothMaterial.wrapT = THREE.RepeatWrapping;
  clothMaterial.offset.set(0, 0);

  const railSideGeometry: BoxGeometry = new BoxGeometry(...getRailSideGeometry);

  const railTopGeometry: BoxGeometry = new BoxGeometry(...getRailsTopGeometry);

  const shape1: Shape = new Shape();
  shape1.moveTo(0, 0);
  shape1.lineTo(0, topRailSideH);
  shape1.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    topRailSideH - TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE)
  );
  shape1.lineTo(TABLE_SIZE.CUSHIONS_W, 0.1);
  shape1.lineTo(0, 0);

  const shape2: Shape = new Shape();
  shape2.moveTo(0, 0);
  shape2.lineTo(0, topRailSideH);
  shape2.lineTo(TABLE_SIZE.CUSHIONS_W, topRailSideH - 0.1);
  shape2.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE)
  );

  const shape3: Shape = new Shape();
  shape3.moveTo(0, 0);
  shape3.lineTo(0, topRailTopW);
  shape3.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    topRailTopW - TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE)
  );
  shape3.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE)
  );
  shape3.lineTo(0, 0);

  const extrudeSettings: {
    steps: number;
    depth: number;
    bevelEnabled: boolean;
  } = {
    steps: 1,
    depth: TABLE_SIZE.Z_PARAM,
    bevelEnabled: false,
  };

  const cushion1Geometry = new ExtrudeGeometry(shape1, extrudeSettings);
  const cushion2Geometry = new ExtrudeGeometry(shape2, extrudeSettings);
  const cushion3Geometry = new ExtrudeGeometry(shape3, extrudeSettings);

  return (
    <>
      {railSideCoordinate.map((pos, idx) => (
        <mesh key={idx} args={[railSideGeometry]} position={pos}>
          <meshStandardMaterial
            attach="material"
            map={railMaterial}
            roughness={1}
            bumpScale={1}
          />
        </mesh>
      ))}

      {railTopCoordinate.map((pos, idx) => (
        <mesh key={idx} args={[railTopGeometry]} position={pos}>
          <meshStandardMaterial
            attach="material"
            map={railMaterial}
            roughness={1}
            bumpScale={1}
          />
        </mesh>
      ))}

      {cushion1Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion1Geometry]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        >
          <meshStandardMaterial
            attach="material"
            map={clothMaterial}
            color={4368639}
            roughness={1}
            bumpScale={1}
          />
        </mesh>
      ))}

      {cushion2Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion2Geometry]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        >
          <meshStandardMaterial
            attach="material"
            map={clothMaterial}
            color={4368639}
            roughness={1}
            bumpScale={1}
          />
        </mesh>
      ))}

      {cushion3Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion3Geometry]}
          position={pos}
          rotation={idx === 0 ? [0, 0, -Math.PI / 2] : [0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial
            attach="material"
            map={clothMaterial}
            color={4368639}
            roughness={1}
            bumpScale={1}
          />
        </mesh>
      ))}
    </>
  );
};
