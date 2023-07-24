import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
// import Controls from "./Component/Controls";
import Scene from "./View/Scene";
import Lights from "./Component/Lights";
import { targetCoordinate } from "./constants";
import Adjust from "./Component/Adjust";

function App() {
  const [eyeDistance, setEyeDistance] = useState(0);
  const [eyeHeight, setEyeHeight] = useState(1);
  const changeEyeDistanceValue = (e) => setEyeDistance(e.target.value);
  const changeEyeHeightValue = (e) => setEyeHeight(e.target.value);

  const target = targetCoordinate.sideLeft;
  return (
    <>
      <Canvas className="webGL">
        <Lights />
        <Scene
          position={[0, 0, 0]}
          target={target}
          distance={4}
          cutAngle={30}
          side="right"
          showAimPoint={false}
          eyeHeight={eyeHeight} // min = 1.8, max = 7
          eyeDistance={eyeDistance} // min= 0, max = 1
        />
        {/* <Controls target={target} distance={2} cutAngle={15} /> */}
      </Canvas>

      <Adjust
        top={60}
        label="Eye Distance"
        changeValue={changeEyeDistanceValue}
        value={eyeDistance}
      />
      <Adjust
        top={2}
        label="Eye Height"
        changeValue={changeEyeHeightValue}
        value={eyeHeight}
      />
    </>
  );
}

export default App;
