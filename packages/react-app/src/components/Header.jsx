import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="/landing" rel="noopener noreferrer">
      <PageHeader
        title="🦜 CO2ken"
        // subTitle="Platform to bring carbon credits on chain"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
