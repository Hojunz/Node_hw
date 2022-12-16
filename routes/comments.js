const express = require('express') 
const { cp } = require('fs')
const comment = require('../schemas/comment')
const router = express.Router()  

const Comment = require('../schemas/comment')
const Post = require('../schemas/post')


//댓글 목록 조회
router.get("/comments/:postId", async(req, res) => {
    const comments = await Comment.find({})

    const postIds = comments.map((comment) => {
        return comment.postId
    })
    const id = await Post.find({postId: postIds})

    const results = comments.map((comment) => {
        return {
            user: comment.user,
            content: comment.content,
            createdAt: comment.createdAt,
            postId: id.find((item) => item.postId === comment.postId),
        }
    })
    res.json({
        "data": results, 
    })
})

// 댓글 작성
router.post('/comments/:postId', async(req, res) => {
    const {postId} = req.params
    const {commentId, user, password, content} = req.body

    await Comment.create({commentId, postId, user, password, content})

    res.json({result:'success'})
})

// 댓글 수정
router.put('/comments/:commentId', async(req, res) => {
    const {commentId} = req.params
    const {user, password, content} = req.body

    const edit = await Comment.find({commentId})
    if(edit.length) {
        await Comment.updateOne(
            {commentId: commentId},
            {$set: {content:content}}
        )
    }else{
        return res.status(404).json({
            success:false,
            errorMessage:"댓글 조회에 실패하였습니다."
        })
    }
})

//댓글 삭제
router.delete('/comments/:commentId', async(req, res) => {
    const {commentId} = req.params

    const edit = await Comment.find({commentId})
    if(edit.length) {
        await Comment.deleteOne({commentId})
    }
})


module.exports = router