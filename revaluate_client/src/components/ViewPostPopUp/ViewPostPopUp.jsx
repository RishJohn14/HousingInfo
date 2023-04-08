import React, { useEffect, useState } from "react";
import './ViewPostPopUp.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import auth from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SendIcon from '@mui/icons-material/Send';

/**
 * Pop up component to view forum post
 * @author Augustine Lee
 * @param {id} props 
 * @returns view post component
 */
function ViewPostPopUp(props) {
    const { id } = props;
    const navigate = useNavigate();

    //state
    const [user, loading] = useAuthState(auth);
    const [postData, updatePostData] = useState('');
    const [comment, updateComment] = useState('');
    const [inputValid, updateInputValid] = useState();

    //function to get forum post data information from backend
    function getPostData() {
        Axios.get('http://localhost:3001/getpostdata', { params: {id} })
        .then((response) => {
            response = response?.data;
            if (response !== 'failure') {
                updatePostData(...response);
            } else { navigate ('/nodata'); }
        })
        .catch((err) => navigate('/nodata'));
    }

    //function to validate user input for comment
    function validateInput() {
        if (comment === '') {updateInputValid(false);}
        else {updateInputValid(true);}
    }

    //function to submit comment if input is validated
    function submitComment() {
        if (!validateInput) {return;}
        Axios.post('http://localhost:3001/addcomment', { params: {
            id,
            username: user.displayName,
            userpiclink: user.photoURL,
            date: new Date(),
            comment
        }})
        .then((response) => {
            getPostData();
            updateComment('');
        })
        .catch((err) => console.log(err))
    }

    //on load, get post data
    useEffect(() => {
        getPostData();
    }, []);

    return <div>
    <Container fluid className="viewPostPopUp">
        <p className="viewPostUser">
            <img className="viewPostUserPic" src={postData?.user?.userpiclink} /> {postData?.user?.username}
        </p>
        <p className="viewPostTitle">{postData?.title}</p>
        <p className="viewPostSubtitle">{postData?.post}</p>
    </Container>
    {postData?.comments && postData?.comments.map((data, idx) => {
        return <Container fluid key={idx} className="viewPostPopUp">
            <p className="viewPostUser">
                <img className="viewPostUserPic" src={data?.user?.userpiclink} /> {data?.user?.username}
            </p>
            <p className="viewPostSubtitle">{data?.content}</p>
        </Container>
    })}
    <Container fluid className="replyBox">
        <Form.Control
            className="replySpace"
            placeholder="Comment"
            value={comment === '' ? '' : comment}
            onChange={(e) => updateComment(e.target.value)}
        />
        <SendIcon onClick={submitComment} />
    </Container>
    </div>
}

export default ViewPostPopUp;