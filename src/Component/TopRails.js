import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three";
import Hardwood from "../Asset/textures/hardwood_floor.jpg";
import Cloth from "../Asset/textures/cloth.jpg";
import { TABLE_SIZE } from "../constants";
import { useMemo } from "react";
import {
  BoxGeometry,
  MeshStandardMaterial,
  Shape,
  ExtrudeGeometry,
} from "three";
import { getCoordinateTopRails } from "../Utils/function";

const TopRails = function () {
  const topRails = useMemo(
    () =>
      getCoordinateTopRails(
        TABLE_SIZE.PLAY_FIELD_H,
        TABLE_SIZE.PLAY_FIELD_W,
        TABLE_SIZE.TOP_RAILS_W,
        TABLE_SIZE.POCKET_SIZE,
        TABLE_SIZE.CUSHIONS_W,
        TABLE_SIZE.Z_PARAM
      ),
    []
  );
  // TOP_RAILS:
  const woodTexture = useLoader(TextureLoader, Hardwood);
  const topRailMaterial = new MeshStandardMaterial({ map: woodTexture });
  const topRailSideGeometry = new BoxGeometry(
    topRails.getTopRailSideGeometry[0],
    topRails.getTopRailSideGeometry[1],
    topRails.getTopRailSideGeometry[2]
  );
  const topRailTopGeometry = new BoxGeometry(
    topRails.getTopRailsTopGeometry[0],
    topRails.getTopRailsTopGeometry[1],
    topRails.getTopRailsTopGeometry[2]
  );
  // CUSHIONS:
  const shape1 = new Shape();
  shape1.moveTo(0, 0);
  shape1.lineTo(0, topRails.topRailSideH);
  shape1.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    topRails.topRailSideH - TABLE_SIZE.CUSHIONS_W
  );
  shape1.lineTo(TABLE_SIZE.CUSHIONS_W, 0.1);
  shape1.lineTo(0, 0);

  const shape2 = new Shape();
  shape2.moveTo(0, 0);
  shape2.lineTo(0, topRails.topRailSideH);
  shape2.lineTo(TABLE_SIZE.CUSHIONS_W, topRails.topRailSideH - 0.08);
  shape2.lineTo(TABLE_SIZE.CUSHIONS_W, TABLE_SIZE.CUSHIONS_W);
  shape2.lineTo(0, 0);

  const shape3 = new Shape();
  shape3.moveTo(0, 0);
  shape3.lineTo(0, topRails.topRailTopW);
  shape3.lineTo(
    TABLE_SIZE.CUSHIONS_W,
    topRails.topRailTopW - TABLE_SIZE.CUSHIONS_W
  );
  shape3.lineTo(TABLE_SIZE.CUSHIONS_W, TABLE_SIZE.CUSHIONS_W);
  shape3.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: TABLE_SIZE.Z_PARAM,
    bevelEnabled: false,
  };
  const cushion1Geometry = new ExtrudeGeometry(shape1, extrudeSettings);
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
      {topRails.topRailSideCoordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[topRailSideGeometry, topRailMaterial]}
          position={pos}
        />
      ))}
      {topRails.topRailTopCoordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[topRailTopGeometry, topRailMaterial]}
          position={pos}
        />
      ))}
      {topRails.cushion1Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion1Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        />
      ))}
      {topRails.cushion2Coordinate.map((pos, idx) => (
        <mesh
          key={idx}
          args={[cushion2Geometry, clothMaterial]}
          position={pos}
          rotation={idx === 1 ? [0, Math.PI, 0] : [0, 0, 0]}
        />
      ))}
      {topRails.cushion3Coordinate.map((pos, idx) => (
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

export default TopRails;
