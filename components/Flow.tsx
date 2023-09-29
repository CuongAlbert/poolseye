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
import React, { useRef } from "react";
import { MeshProps } from "@react-three/fiber";

const Flow = (props: { line: Line }) => {
  // const lineToOb: Line = getFlowCueBall(line, objBall);
  const flowCueBallGeometry = new PlaneGeometry(
    BALL_DIAMETER,
    lineLength(props.line)
  );

  const flowMaterial = new MeshStandardMaterial({
    color: 0xffff,
    opacity: 0.2,
    transparent: true,
  });
  return (
    <mesh
      args={[flowCueBallGeometry, flowMaterial]}
      position={[...lineMidpoint(props.line), BALL_DIAMETER / 2]}
      rotation={[0, 0, angleToRadians(lineAngle(props.line) - 90)]}
    ></mesh>
  );
};

export default Flow;
