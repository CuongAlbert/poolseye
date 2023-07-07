import React from "react";
import { Canvas } from "react-three-fiber";
import Controls from "./Component/Controls";
import Scene from "./View/Scene";
import Lights from "./Component/Lights";

function App() {
  return (
    <Canvas>
      <Lights />
      <Scene position={[0, 0, 0]} />
      <Controls />
    </Canvas>
  );
}

export default App;
