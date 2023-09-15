import { useLoader } from "react-three-fiber";
import { CylinderGeometry, TextureLoader } from "three";
import Hardwood from "../Asset/textures/hardwood_floor.jpg";
import Cloth from "../Asset/textures/cloth.jpg";
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
import {
  BoxGeometry,
  MeshStandardMaterial,
  Shape,
  ExtrudeGeometry,
} from "three";

const Rails = function () {
  // TOP_RAILS:
  const woodTexture = useLoader(TextureLoader, Hardwood);
  const railMaterial = new MeshStandardMaterial({ map: woodTexture });
  const railSideGeometry = new BoxGeometry(
    getRailSideGeometry[0],
    getRailSideGeometry[1],
    getRailSideGeometry[2]
  );
  const railTopGeometry = new BoxGeometry(
    getRailsTopGeometry[0],
    getRailsTopGeometry[1],
    getRailsTopGeometry[2]
  );
  // CUSHIONS:
  const shape1 = new Shape();
  shape1.moveTo(0, 0);
  shape1.lineTo(0, topRailSideH);
  shape1.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    topRailSideH - TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE)
  );
  shape1.lineTo(TABLE_SIZE.CUSHIONS_W, 0.1);
  shape1.lineTo(0, 0);

  const shape2 = new Shape();
  shape2.moveTo(0, 0);
  shape2.lineTo(0, topRailSideH);
  shape2.lineTo(TABLE_SIZE.CUSHIONS_W, topRailSideH - 0.1);
  shape2.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    TABLE_SIZE.CUSHIONS_W / Math.tan(FACING_ANGLE)
  );
  shape2.lineTo(0, 0);

  const shape3 = new Shape();
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

  const extrudeSettings = {
    steps: 1,
    depth: TABLE_SIZE.Z_PARAM,
    bevelEnabled: false,
  };
  const cushion1Geometry = new ExtrudeGeometry(shape1, extrudeSettings);
  // const cushion1Geometry = new CylinderGeometry(
  //   (TABLE_SIZE.CUSHIONS_W * Math.cos((Math.PI / 180) * 60) * 2) / 3,
  //   (TABLE_SIZE.CUSHIONS_W * Math.cos((Math.PI / 180) * 60) * 2) / 3,
  //   topRailSideH,
  //   3
  // );

  const cushion2Geometry = new ExtrudeGeometry(shape2, extrudeSettings);
  const cushion3Geometry = new ExtrudeGeometry(shape3, extrudeSettings);

  const clothMaterial = new MeshStandardMaterial({
    color: 0x42a8ff,
    roughness: 0.4,
    bumpScale: 1,
  });
  const clothTexture = useLoader(TextureLoader, Cloth);
  clothMaterial.map = clothTexture;

  return (
    <>
      {railSideCoordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[railSideGeometry, railMaterial]}
          position={pos}
        />
      ))}
      {railTopCoordinate.map((pos, idx) => (
        <mesh key={idx} args={[railTopGeometry, railMaterial]} position={pos} />
      ))}
      {cushion1Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion1Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        />
      ))}
      {cushion2Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion2Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        />
      ))}
      {cushion3Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion3Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 0 ? [0, 0, -Math.PI / 2] : [0, 0, Math.PI / 2]}
        />
      ))}
    </>
  );
};

export default Rails;
