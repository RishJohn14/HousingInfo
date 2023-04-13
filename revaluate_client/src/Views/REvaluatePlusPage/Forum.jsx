import React, { useEffect, useState } from "react";
import './REvaluatePlusPage.css';
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPostPopUp from "../../components/AddPostPopUp/AddPostPopUp";
import ViewPostPopUp from "../../components/ViewPostPopUp/ViewPostPopUp";

/**
 * Forum Page
 * @returns Forum Page
 */
function Forum() {
    const navigate = useNavigate();

    //states
    const [topics, updateTopics] = useState([]);
    const [posts, updatePosts] = useState([]);
    const [selectedTopic, updateSelectedTopic] = useState(null);
    const [selectedPosts, updateSelectedPosts] = useState([]);
    const [colourMapping, updateColourMapping] = useState({});
    const [addingPost, updateAddingPost] = useState(false);
    const [viewingPost, updateViewingPost] = useState(false);
    var topicsColourMapping = {};

    //function to get topics from backend
    function getTopics() {
        Axios.get('http://localhost:3001/forumTopics')
        .then((response) => {
            response = response?.data;
            if (response === 'error') { navigate('/nodata'); }
            updateTopics(response);
            for (var i = 0; i < response.length; i++) {
                topicsColourMapping[response[i].topic] = response[i]['colour'];
            }
            updateColourMapping(topicsColourMapping);
        })
        .catch((err) => navigate('/nodata'));
    }

    //function to handle when user selects a topic
    function handleTopicChange(value) {
        if (selectedTopic === value) {updateSelectedTopic(null);}
        else {updateSelectedTopic(value);}
    }

    //function to get posts from backend
    function getPosts() {
        Axios.get('http://localhost:3001/forumPosts')
        .then((response) => {
            response = response?.data;
            if (response === 'error') { navigate('/nodata'); }
            updatePosts(response);
            updateSelectedPosts(response);
        })
        .catch((err) => navigate('/nodata'));
    }

    //function to filter posts according to the selected topic
    function filterByTopics() {
        //selected topic is null, return all posts
        if (!selectedTopic) {updateSelectedPosts(posts)}
        else {
            var validPosts = []
            for (var i = 0; i < posts.length; i++) {
                for (var j = 0; j < posts[i].topics.length; j++) {
                    //topic matches the selected topic
                    if (posts[i].topics[j] === selectedTopic) {
                        validPosts.push(posts[i]);
                        break;
                    }
                }
            }
            updateSelectedPosts(validPosts);
        }
    }

    //on load, get topics and posts from backend
    useEffect(() => {
        getTopics();
        getPosts();
    }, [addingPost]);

    //filter the posts to get posts that matches the selected topic whenever the topic is changed
    useEffect(() => {
        filterByTopics();
    }, [selectedTopic]);

    return <div>
        <p className="forumPageTitle">Connect With Others!</p>
        <div className="topicsDiv">
        {topics.map((data, idx) => {
            return <p
            key={idx}
            className="forumTopics"
            style={selectedTopic === null || selectedTopic === data?.topic ? {backgroundColor: data?.colour} : {backgroundColor: '#9F9F9F'}}
            onClick={() => handleTopicChange(data?.topic)}
            >
                {data?.topic}
            </p>
        })}
        <div className="forum">
            {addingPost && <div>
                <span className="addPostBack" onClick={() => updateAddingPost(false)}>
                    <ArrowBackIcon style={{margin: 5}} /> Back
                </span>
                <AddPostPopUp callback={updateAddingPost} />
            </div>}

            {viewingPost && <div>
                <span className="addPostBack" onClick={() => updateViewingPost(false)}>
                    <ArrowBackIcon style={{margin: 5}} /> Back
                </span>
                <ViewPostPopUp id={viewingPost} />
            </div>
            }

            {!addingPost && !viewingPost &&
            <div>
            <p className="forumAddNewPost" onClick={() => updateAddingPost(true)}>
                Add New Post <AddCommentIcon fontSize="medium" />
            </p>
            {selectedPosts.map((data, idx) => {
                return <div className="forumCard" key={idx} onClick={() => updateViewingPost(data._id)}>
                <Card style={{height:'10rem'}}>
                    <Card.Body>
                        <Card.Title>{data?.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{data?.user?.username}</Card.Subtitle>
                        <p className="forumCardPost">{data?.post}</p>
                        {data?.topics.map((data2, idx2) => {
                            return <p
                                key={idx2}
                                className="forumTopics"
                                style={{backgroundColor: colourMapping[data2]}}
                                >
                                {data2}
                            </p>
                        })}
                    </Card.Body>
                </Card>
                </div>
            })}
            </div>
            }
        </div>
        </div>
    </div>
}

export default Forum;