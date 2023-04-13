import React from 'react';
import './NotFoundPage.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

/**
 * Page that user gets redirected to when there is no results for their search
 * @returns No Data Page
 */
function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div>
            <img className="findpic" src={require('./finding.png')} />
            <p className='notFoundTitle'>It appears that there is insufficient data for your search queries</p>
            <Button onClick={() => navigate('/')}>Return To Home</Button>
        </div>
    )
}

export default NotFoundPage;