import React from 'react';
import Header from '../../components/Header/Header';
import './GetInsightsPage.css'

function GetInsightsPage() {
    return (
        <div>
        <Header/>
            <div className="big-container">
            <div className="grid-container container-insights">
                <div className="grid-item">1</div>
                <div className="grid-item">2</div>
                <div className="grid-item">3</div>
                <div className="grid-item">4</div>
            </div>
            </div>


        </div>
    )
}

export default GetInsightsPage;