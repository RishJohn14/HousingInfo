import React from "react";
import './Header.css';

/**
 * Header component used in every page for navigation
 * @returns Header component
 */
function Header(){
    return(
        <div>
            <nav className = "headerBar">
            <a href = '/' className = 'revaluateLink'> REvaluate </a>
            <a href = '/about' className = 'aboutLink'> About Us </a>
            <a href = '/insights' className = 'insightsLink'> Get Insights </a>
            <a href = '/login' className = 'insightsLink'> REvaluate+ </a>
            </nav>
        </div>
    )
}
export default Header;