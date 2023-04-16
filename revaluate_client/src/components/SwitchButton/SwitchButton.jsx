import React, { useState } from "react";
import "./SwitchButton.css";

/**
 * Switch Button component to toggle between buyer and seller on home page
 * @param {callback}
 * @returns Switch Button component
 */
function SwitchButton({ callback }) {
    //state
    const [isBuyer, updateIsBuyer] = useState(true);

    //handle click by updating state and parent component using callback
    function handleClick() {
      updateIsBuyer(!isBuyer);
      callback(!isBuyer);
    }

    return <label className="switchButtonContainer">
    <input
        type="checkbox"
        checked={!isBuyer}
        onChange={handleClick}
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