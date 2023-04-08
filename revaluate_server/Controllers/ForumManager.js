/*
* Forum Controller
*/

//import models
const forumTopics = require("../Models/Topics");
const discussion = require("../Models/Discussion");

/**
 * function to get forum topics from database
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function getForumTopics(req, res) {
    forumTopics.find()
    .then((response) => res.send(response))
    .catch((err) => res.send('error'));
};

/**
 * function to get forum posts from database
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function getForumPosts(req, res) {
    discussion.find()
    .then((response) => res.send(response))
    .catch((err) => res.send('error'))
};

/**
 * function to add a post to the database
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function addPost(req, res) {
    const reqData = req.body.params;
    discussion.insertMany([{
        user: {
        username: reqData.username,
        userpiclink: reqData.userpiclink,
        },
        timestamp: reqData.date,
        title: reqData.title,
        post: reqData.post,
        topics: reqData.tags
    }])
    .then((response) => res.send('success'))
    .catch((err) => res.send('failure'))
};

/**
 * function to get a post by its ID
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function getPostDataById(req, res) {
    const reqData = req.query;
    const id = reqData?.id;
    if (!id) {
        res.send('failure');
        return
    }
    discussion.find({_id: id})
    .then((response) => res.send(response))
    .catch((err) => res.send('failure'))
};

/**
 * function to add a comment to a post of a particular ID
 * @author Augustine Lee
 * @param {*} req 
 * @param {*} res 
 */
function addComment(req, res) {
    const reqData = req.body.params;
    discussion.updateOne(
        {_id: reqData.id},
        { $push: {comments: {
        user: {
            username: reqData.username,
            userpiclink: reqData.userpiclink
        },
        timestamp: reqData.date,
        content: reqData.comment
        }}}
    )
    .then((response) => res.send(response))
    .catch((err) => res.send('failure'))
};

module.exports = {
    getForumTopics,
    getForumPosts,
    addPost,
    getPostDataById,
    addComment
};