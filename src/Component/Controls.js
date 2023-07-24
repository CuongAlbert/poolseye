import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getOBAndCBCoordinate } from "../Utils/function";

function Controls(props) {
  const { target, distance, cutAngle } = props;
  const a = useMemo(
    () => getOBAndCBCoordinate(target, distance, cutAngle),
    [target, distance, cutAngle]
  );
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update());

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target.set(a[1][0], a[1][1], a[1][2]);
    controls.minDistance = 10;
    controls.maxDistance = 28.4;
    controls.ref = controlsRef;
    controls.args = [camera, gl.domElement];
    controls.args[0].receiveShadow = true;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 2;
    controls.panSpeed = 0.4;
    controls.rotateSpeed = 0.4;
    controls.enableZoom = true;
    controls.object = camera;

    return () => {
      controls.dispose();
    };
  }, [camera, gl, a]);

  return null;
}

export default Controls;
