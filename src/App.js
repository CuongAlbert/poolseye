import React from "react";
import { Canvas } from "react-three-fiber";
import Controls from "./Component/Controls";
import Scene from "./View/Scene";
import Lights from "./Component/Lights";
import { targetCoordinate } from "./constants";

function App() {
  const target = targetCoordinate.sideLeft;
  return (
    <Canvas>
      <Lights />
      <Scene
        position={[0, 0, 0]}
        target={target}
        distance={4}
        cutAngle={30}
        side="right"
        showAimPoint={false}
        showGhostBall={false}
      />
      <Controls />
    </Canvas>
  );
}

export default App;
