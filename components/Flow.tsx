// import * as THREE from "three";
import { MeshStandardMaterial, PlaneGeometry } from "three";
import { getFlowCueBall } from "../utils/function";
import {
  Line,
  Point,
  angleToRadians,
  lineAngle,
  lineLength,
  lineMidpoint,
} from "geometric";
import { BALL_DIAMETER } from "../constants";

const Flow = ({ line, objBall }: { line: Line; objBall: Point }) => {
  const lineToOb: Line = getFlowCueBall(line, objBall);
  const flowCueBallGeometry = new PlaneGeometry(
    BALL_DIAMETER,
    lineLength(lineToOb)
  );

  const flowMaterial = new MeshStandardMaterial({
    color: 0xffff,
    opacity: 0.2,
    transparent: true,
    // side: THREE.DoubleSide,
  });
  return (
    <mesh
      args={[flowCueBallGeometry, flowMaterial]}
      position={[...lineMidpoint(lineToOb), BALL_DIAMETER / 2]}
      rotation={[0, 0, angleToRadians(lineAngle(lineToOb) - 90)]}
    />
  );
};

export default Flow;
