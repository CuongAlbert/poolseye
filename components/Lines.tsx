import { useLayoutEffect, useRef } from "react";
import { Vector3, BufferGeometry, Line, LineBasicMaterial } from "three";

export type Props = {
  start: Vector3;
  end: Vector3;
  shareValue: number;
};

function Lines(props: Props) {
  const { start, end, shareValue } = props;
  const points: Vector3[] = [];
  points.push(new Vector3(...start));
  points.push(new Vector3(...end));
  const ref = useRef<BufferGeometry>(null!);
  useLayoutEffect(() => {
    if (ref.current) ref.current.setFromPoints(points);
  }, []);

  return (
    <line>
      <bufferGeometry attach="geometry" ref={ref} />
      <lineBasicMaterial attach="material" color="white" opacity={0} />
    </line>
  );
}
export default Lines;
