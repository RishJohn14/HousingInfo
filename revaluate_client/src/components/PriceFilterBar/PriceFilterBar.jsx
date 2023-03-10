import React, { useState } from 'react';
import './PriceFilterBar.css';

function PriceFilterBar(){
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    
    const handleChange = (event, type) => {
        const value = event.target.value;
        if(isNaN(value) == true ){
            alert("Invalid, Please enter Numeric values only.");
            event.target.value = '';
            return false;
        } 
        if(value < 0){
            alert("Invalid, Price entered is negative.");
            event.target.value = '';
            return false;
        }
        if(value > 10000000){
            alert("Invalid, Price entered exceeds the maximum value.");
            event.target.value = '';
            return false;
        }
        if (type == 'MIN'){
            /* doesn't function properly because setState is 1 state behind
            if (value > maxPrice){
                alert("Invalid range.");
                event.target.value = '';
                return false;
            }
            */
            setMinPrice(value); 
        }
        else{
            /* doesn't function properly because setState is 1 state behind
            if (value < minPrice){
                alert("Invalid range.");
                event.target.value = '';
                return false;
            }
            */
            setMaxPrice(value); 
        }
        console.log(value);
        console.log("min value = " + minPrice);
        console.log("max value = " + maxPrice);
    }
    
    return(
        <div className = 'filterBar'>
            <p>
                Only show transactions between
            </p>
            <input id = "minInputBox" type = 'text' placeholder = 'Minimum value' onChange={(e) => handleChange(e, 'MIN')} ></input>
            <p>to</p>
            <input id = "maxInputBox" type = 'text' placeholder = 'Maximum value' onChange={(e) => handleChange(e, 'MAX')} ></input>
        </div>
    )
}
export default PriceFilterBar;