import classes from "./Adjust.module.css";
const Adjust = (props) => {
  return (
    <div className={classes.adjust} style={{ top: props.top }}>
      <label className={classes.label}>{props.label}</label>
      <div className={classes.slider}>
        <input
          className={classes.input}
          type="range"
          {...props}
          onChange={props.changeValue}
          min={props.min}
          max={props.max}
          step={0.001}
          value={props.value}
        ></input>
        <p>{props.value}</p>
      </div>
    </div>
  );
};

export default Adjust;
