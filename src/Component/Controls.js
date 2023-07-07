import { useRef, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function Controls() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update());

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controls.ref = controlsRef;
    controls.args = [camera, gl.domElement];
    controls.args[0].receiveShadow = true;
    // controls.minPolarAngle = Math.PI / 6;
    // controls.maxPolarAngle = Math.PI / 2;
    controls.panSpeed = 0.4;
    controls.rotateSpeed = 0.4;
    controls.enableZoom = true;
    console.log(controls);

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
}

export default Controls;
