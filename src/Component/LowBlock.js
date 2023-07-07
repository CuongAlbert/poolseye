import { ExtrudeGeometry, MeshBasicMaterial, Shape } from "three";

const LowBlock = function () {
  const [h, tH, tW, bevel] = [4, 6, 3, 1];
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, tH);
  shape.lineTo(bevel, tH - bevel);
  shape.lineTo(bevel, bevel);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    step: 1,
    bevelEnable: false,
    depth: h,
  };
  const blockGeometry = new ExtrudeGeometry(shape, extrudeSettings);
  const blockMaterial = new MeshBasicMaterial({ color: "white" });
  return <mesh position={[0, 0, 0]} args={[blockGeometry, blockMaterial]} />;
};

export default LowBlock;
