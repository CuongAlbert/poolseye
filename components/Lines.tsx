import { Vector3, BufferGeometry, Line } from "three";

export type Props = {
  start: Vector3;
  end: Vector3;
  shareValue: number;
};

function Lines(props: Props) {
  const { start, end, shareValue } = props;
  const points = [];
  points.push(new Vector3(...start));
  points.push(new Vector3(...end));
  const lineGeometry = new BufferGeometry().setFromPoints(points);
  console.log("shareValue_Line", shareValue);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="white" opacity={0} />
    </line>
  );
}
export default Lines;
