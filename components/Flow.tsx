// import * as THREE from "three";
import {
  DoubleSide,
  ExtrudeGeometry,
  MeshStandardMaterial,
  Plane,
  PlaneGeometry,
  Shape,
  Texture,
  TextureLoader,
} from "three";
import { getFlowCueBall } from "../utils/function";
import {
  Line,
  Point,
  angleToRadians,
  lineAngle,
  lineLength,
  lineMidpoint,
} from "geometric";
import { useLoader } from "@react-three/fiber";
import { BALL_DIAMETER } from "../constants";

const Flow = ({ line, objBall }: { line: Line; objBall: Point }) => {
  const [flow1, flow2, lineToOb]: Line[] = getFlowCueBall(line, objBall);

  // const flowCueBall = new Plane();
  // flowCueBall.moveTo(line[1][0], line[0][1]);
  // flowCueBall.lineTo(flow1[0][0], flow1[0][1]);
  // flowCueBall.lineTo(flow1[1][0], flow1[1][1]);
  // flowCueBall.lineTo(flow2[1][0], flow2[1][1]);
  // flowCueBall.lineTo(flow2[0][0], flow2[0][1]);
  // const extrudeSettings = {
  //   steps: 1,
  //   depth: 0.01,
  //   bevelEnabled: false,
  const flowCueBallGeometry = new PlaneGeometry(
    BALL_DIAMETER,
    lineLength(lineToOb)
  );
  // const flowTexture: Texture = new TextureLoader().load(
  //   "../assets/textures/white.jpeg"
  // );
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
