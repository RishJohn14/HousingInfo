import React, { useState } from 'react';
import './PriceFilterBar.css';

function PriceFilterBar(){
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
   
    const handleChangeMin = (event) => {
        const value = event.target.value;
        setMinPrice(value);
      }
    const handleChangeMax = (event) => {
        const value = event.target.value;
        setMaxPrice(value);
      }      

      if(minPrice < 0){
        alert("Invalid, Price entered is negative");
    }
    
    if(maxPrice > 10000000){
        alert("Invalid, Price entered exceeds maximum price");
    }
      return(
        <div className = 'filterBar'>
            <p>
                Only show transactions between
            </p>
            <input id = "minInputBox" type = 'text' placeholder = 'Minimum value' onChange={handleChangeMin} value={minPrice} ></input>
            <p>
                to
            </p>
            <input id = "maxInputBox" type = 'text' placeholder = 'Maximum value' onChange={handleChangeMax} value={maxPrice}></input>
        </div>
    )
}
export default PriceFilterBar;