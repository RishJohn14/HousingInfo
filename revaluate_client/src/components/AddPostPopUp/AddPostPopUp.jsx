import React, { useEffect, useState } from "react";
import './AddPostPopUp.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import auth from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

/**
 * Pop-up component for adding new forum posts
 * @author Augustine Lee
 * @param { callback } props 
 * @returns component
 */
function AddPostPopUp(props) {
    const { callback } = props; 
    const navigate = useNavigate();

    //states
    const [user, loading] = useAuthState(auth);
    const [title, updateTitle] = useState('');
    const [post, updatePost] = useState('');
    const [tags, updateTags] = useState([]);
    const [topics, updateTopics] = useState([]);
    const [inputValid, updateInputValid] = useState();

    //this function gets available forum topics from the backend
    function getTopics() {
        Axios.get('http://localhost:3001/forumTopics')
        .then((response) => {
            response = response?.data;
            updateTopics(response);
        })
        .catch((err) => navigate('/nodata'));
    }

    //this function validates whether user-provided inputs are valid
    function validateInput() {
        if (title === '' || post === '' || tags.length <= 0) {updateInputValid(false);}
        else {updateInputValid(true);}
    }

    //this function submits the post by calling the /addpost API endpoint
    function submitPost() {
        Axios.post('http://localhost:3001/addpost', { params: {
            title,
            post,
            tags,
            username: user.displayName,
            userpiclink: user.photoURL,
            date: new Date()
        }})
        .then((response) => {
            console.log(response);
            callback(false); //to update parent component that the post has been added
        })
        .catch((err) => console.log(err))
    }

    //On load, get the available topics
    useEffect(() => {
        getTopics();
    }, []);

    //whenever any of the input fields changes, validate the input and update the inputValid state
    useEffect(() => {
        validateInput();
    }, [title, post, tags])

    return <Container fluid className="addPostPopUp">
        <Form>
        <p className="addPostTitle">Add Post</p>
        <Form.Group className="mb-3 pr-10">
            <Form.Label>Title</Form.Label>
            <Form.Control as={"textarea"} rows={1} onChange={(e) => updateTitle(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Post</Form.Label>
            <Form.Control as={"textarea"} rows={2} onChange={(e) => updatePost(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Tags (At least 1)</Form.Label>
            {topics.map((data, idx) => {
                return <div
                key={idx}
                style={{
                    backgroundColor: data?.colour,
                    padding: 5,
                    paddingLeft: 10,
                    margin: 5,
                    marginLeft: 0,
                    width: '15%',
                    borderRadius: 20,
                    fontWeight: 600
                }}>
                    <Form.Check
                        onClick={(e) => {
                            var temp = [...tags];
                            if (e.target.checked) {
                                temp.push(e.target.name);
                                console.log(temp);
                                updateTags(temp);
                            } else {
                                temp = temp.filter((value) => value !== e.target.name);
                                console.log(temp);
                                updateTags(temp);
                            }
                        }}
                        name={data?.topic}
                        label={data?.topic}
                    />
                </div>
            })}
        </Form.Group>
        <Button disabled={!inputValid} onClick={submitPost} className="addPostSubmitButton">Submit</Button>
        </Form>
    </Container>
}

export default AddPostPopUp;