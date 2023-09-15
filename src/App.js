import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
// import Controls from "./Component/Controls";
import Scene from "./View/Scene";
import Lights from "./Component/Lights";
// import { targetCoordinate } from "./constants";
import Adjust from "./Component/Adjust";

function App() {
  const [eyeDistance, setEyeDistance] = useState(0);
  const [eyeHeight, setEyeHeight] = useState(1);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [checkValue, setCheckValue] = useState();
  const [check, setCheck] = useState(1);
  const changeEyeDistanceValue = (e) => setEyeDistance(e.target.value);
  const changeEyeHeightValue = (e) => setEyeHeight(e.target.value);
  const changeRotateAngleValue = (e) => setRotateAngle(e.target.value);

  const handleCheck = (result) => {
    setCheckValue(result);
  };

  const handleChange = () => {
    check === 1 ? setCheck(0) : setCheck(1);
    console.log(check);
  };

  return (
    <>
      <Canvas className="webGL">
        <Lights />
        <Scene
          position={[0, 0, 0]}
          target={"sideLeft"}
          distance={4}
          cutAngle={30}
          side="right"
          showAimPoint={false}
          eyeHeight={eyeHeight} // min = 1.8, max = 7
          eyeDistance={eyeDistance} // min= 0, max = 1
          rotateAngle={rotateAngle}
          handleCheck={handleCheck}
          check={check}
        />
        {/* <Controls target={target} distance={2} cutAngle={15} /> */}
      </Canvas>
      <button
        className="button"
        style={{
          backgroundColor: checkValue ? "green" : "red",
          cursor: "pointer",
          borderRadius: 5,
          width: 60,
          height: 30,
          top: 2,
          left: "50%",
          position: "absolute",
        }}
      >
        CHECK
      </button>
      <button
        className="check"
        style={{
          cursor: "pointer",
          borderRadius: 5,
          width: 60,
          height: 30,
          top: 32,
          left: "50%",

          position: "absolute",
        }}
        onClick={handleChange}
      >
        CHANGE
      </button>

      <Adjust
        top={2}
        label="Eye Height"
        min={0}
        max={1}
        changeValue={changeEyeHeightValue}
        value={eyeHeight}
      />
      <Adjust
        top={60}
        label="Eye Distance"
        min={0}
        max={1}
        changeValue={changeEyeDistanceValue}
        value={eyeDistance}
      />
      <Adjust
        top={120}
        label="Rotate"
        min={-1}
        max={1}
        changeValue={changeRotateAngleValue}
        value={rotateAngle}
      />
    </>
  );
}

export default App;
