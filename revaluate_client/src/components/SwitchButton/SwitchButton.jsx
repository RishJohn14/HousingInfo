import React, { useState } from "react";
import "./SwitchButton.css";

function SwitchButton({ callback }) {
    const [isBuyer, updateIsBuyer] = useState(true);

    return <label className="switchButtonContainer">
    <input
        type="checkbox"
        checked={!isBuyer}
        onChange={() => {
            updateIsBuyer(!isBuyer);
            callback(!isBuyer);
        }}
        className="invisibleCheckbox"
    />
    <div className="switchButton" />
    <div className="switchLabels">
      <span>Buy a house</span>
      <span>Sell a house</span>
    </div>
  </label>
}

export default SwitchButton;