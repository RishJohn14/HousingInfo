import React, { useState } from "react";
import "./SwitchButton.css";
import { motion } from "framer-motion";

function SwitchButton() {
    const [selected, updateSelected] = useState(false);

    return <motion.div animate className={selected ? "switchButton on" : "switchButton off"} onClick={() => updateSelected(!selected)}>
        <motion.div animate>
            <p className="text">BUY A HOUSE</p>
        </motion.div>
        <p className="unselected-text">SELL A HOUSE</p>
    </motion.div>
}

export default SwitchButton;