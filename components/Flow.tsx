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
import React, { Ref, forwardRef } from "react";
import { Props } from "@react-three/fiber";

const Flow = forwardRef<Ref, Props>((ref, props) => {
  // const lineToOb: Line = getFlowCueBall(ref.current, objBall);
  const flowCueBallGeometry = new PlaneGeometry(
    BALL_DIAMETER,
    lineLength(ref.current)
  );

  const flowMaterial = new MeshStandardMaterial({
    color: 0xffff,
    opacity: 0.2,
    transparent: true,
  });
  return (
    <mesh
      args={[flowCueBallGeometry, flowMaterial]}
      position={[...lineMidpoint(ref.current), BALL_DIAMETER / 2]}
      rotation={[0, 0, angleToRadians(lineAngle(ref.current) - 90)]}
    ></mesh>
  );
});

export default Flow;
