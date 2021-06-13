import React from "react";
import { Button } from "@chakra-ui/react";

export default function GasGauge(props) {
  return (
    <Button
      onClick={() => {
        window.open("https://ethgasstation.info/");
      }}
      colorScheme="gray"
    >
      <span style={{ marginRight: 8 }}>
        <span role="img" aria-label="fuelpump">
          ⛽️
        </span>
      </span>
      {parseInt(props.gasPrice, 10) / 10 ** 9}g
    </Button>
  );
}
