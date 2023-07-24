import classes from "./Adjust.module.css";
const Adjust = (props) => {
  return (
    <div className={classes.adjust} style={{ top: props.top }}>
      <label className={classes.label}>{props.label}</label>
      <div className={classes.slider}>
        <input
          className={classes.input}
          type="range"
          onChange={props.changeValue}
          min={0}
          max={1}
          step={0.01}
          value={props.value}
        ></input>
        <p>{props.value}</p>
      </div>
    </div>
  );
};

export default Adjust;
