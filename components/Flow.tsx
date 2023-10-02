// import * as THREE from "three";
import { Mesh } from "three";

import React from "react";
import { MeshProps } from "@react-three/fiber";

const FlowInner = (props: MeshProps, ref: React.ForwardedRef<Mesh>) => {
  console.log(props);
  return <mesh ref={ref} />;
};
const Flow = React.forwardRef(FlowInner);
export default Flow;
