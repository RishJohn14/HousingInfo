import React from "react";
import './Header.css';

function Header(){
    return(
        <div>
            <nav class = "headerBar">
            <a href = '/' class = 'revaluateLink'> REvaluate </a>
            <a href = '/about' class = 'aboutLink'> About Us </a>
            <a href = '/insights' class = 'insightsLink'> Get Insights </a>
            </nav>
        </div>
    )
}
export default Header;