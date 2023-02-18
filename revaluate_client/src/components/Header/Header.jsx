import React from "react";
import './Header.css';

function Header(){
    return(
        <div>
            <nav className = "headerBar">
            <a href = '/' className = 'revaluateLink'> REvaluate </a>
            <a href = '/about' className = 'aboutLink'> About Us </a>
            <a href = '/insights' className = 'insightsLink'> Get Insights </a>
            </nav>
        </div>
    )
}
export default Header;