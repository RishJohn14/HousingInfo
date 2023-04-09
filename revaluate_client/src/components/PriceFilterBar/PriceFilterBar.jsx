import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PriceFilterBar.css';

/**
 * Price Filter Bar component that allows user to restrict the houses displayed by price range
 * @author Alexus Lim
 * @returns Price Filter Bar component
 */
function PriceFilterBar(props){
    const { updateMinCallback, updateMaxCallback } = props;

    //states
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2000000);
    const [inputValid, updateInputValid] = useState(true);

    //function that update states and validate inputs when the user provides input
    const handleChange = () => {
        if(isNaN(minPrice) || isNaN(maxPrice)){
            updateInputValid(false);
            return;
        }
        if(minPrice < 0){
            updateInputValid(false);
            return;
        }
        if(maxPrice > 2000000){
            updateInputValid(false);
            return;
        }
        if (minPrice >= maxPrice){
            updateInputValid(false);
            return;
        }
        else {
            updateInputValid(true);
            return;
        }
    }

    useEffect(() => {
        handleChange()
    }, [minPrice, maxPrice]);

    return(
        <div>
            <div className = 'filterBar'>
                <p className='filterBarLabel'>
                    Only show transactions between
                </p>
                <input id = "minInputBox" type = 'text' placeholder = 'Minimum value' onChange={(e) => setMinPrice(e.target.value)} ></input>
                <p className='filterBarLabel'>to</p>
                <input id = "maxInputBox" type = 'text' placeholder = 'Maximum value' onChange={(e) => setMaxPrice(e.target.value)} ></input>
                <Button
                    variant="outlined"
                    disabled={!inputValid}
                    style={{color: 'grey', borderColor: 'grey'}}
                    onClick={() => {
                        updateMinCallback(minPrice);
                        updateMaxCallback(maxPrice);
                    }}
                >Filter</Button>
            </div>
            <p className={inputValid ? 'filterBarWarningHidden' : 'filterBarWarning'}>Invalid Range. Please change your input.</p>
        </div>
    )
}
export default PriceFilterBar;