import React from "react";
import { Box } from "@mui/material";

type CircleIconProps = {
  value: number;
  label: string;
};

const CircleIcon: React.FC<CircleIconProps> = ({ value, label }) => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "lightgray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
      }}
    >
      {label ? label : value}
    </Box>
  );
};

export default CircleIcon;
