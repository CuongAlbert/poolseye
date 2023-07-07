import React from "react";
// import LowBlock from "../Component/LowBlock";
import PoolBall from "../Component/PoolBall";
import PoolTable from "../Component/PoolTable";
import zero from "../Asset/textures/0.png";
import { BALL_SIZE, TABLE_SIZE } from "../constants";
function Scene() {
  return (
    <React.Suspense>
      <PoolTable />
      {/* <LowBlock /> */}
      <PoolBall
        position={[0, 0, BALL_SIZE + TABLE_SIZE.Z_PARAM]}
        textureURL={zero}
      />
    </React.Suspense>
  );
}

export default Scene;
