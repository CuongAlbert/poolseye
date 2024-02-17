import React from "react";
import { StyleSheet, Text, View } from "react-native";

// import Slider;
export type AdjustProps = {
  value: number;
  changeValue: (e: number) => {};
  max: number;
  min: number;
  label: string;
};

const Adjust = (props: AdjustProps) => {
  return (
    <View style={styles.adjust}>
      <Text style={styles.label}>
        {props.label} : {props.value.toFixed(3)}
      </Text>
      {/* <Slider
        value={props.value}
        onValueChange={(newValue) => setValue(newValue)}
        maximumValue={props.max}
        minimumValue={props.min}
        step={0.01}
      /> */}
    </View>
  );
};

export default Adjust;

const styles = StyleSheet.create({
  adjust: {
    color: "white",
    width: 180,
    height: 60,
    fontSize: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "white",
    left: 10,
    top: 10,
    border: 1,
    borderRadius: 8,
    padding: 4,
  },
  label: {
    color: "white",
  },
});
