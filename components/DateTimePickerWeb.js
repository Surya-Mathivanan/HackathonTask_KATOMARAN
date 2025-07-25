import React from "react";
import { Platform } from "react-native";

const DateTimePickerWeb = ({
  value,
  onChange,
  mode = "date",
  display = "default",
}) => {
  if (Platform.OS === "web") {
    return (
      <input
        type={mode === "date" ? "date" : "time"}
        value={value.toISOString().split("T")[0]}
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          onChange(
            { type: "set", nativeEvent: { timestamp: newDate.getTime() } },
            newDate
          );
        }}
        style={{
          padding: 12,
          fontSize: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          backgroundColor: "#FAFAFA",
          width: "100%",
          color: "#111827",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      />
    );
  }

  return null;
};

export default DateTimePickerWeb;