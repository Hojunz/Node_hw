const express = require("express");
const router = express.Router();
const { Comment, Post } = require("../models");

const authMiddleware = require("../middlewares/auth-middleware");

//댓글목록 조회 -------------------------------------------------------------------
router.get('/comments/:postId', async(req,res) => {
    const {postId} = req.params
    const comments = await Comment.findAll({
        attributes: ['comment', 'user_id'],
        where: {post_id: postId},
        order: [['createdAt', 'DESC']],
    })
    res.status(200).json({data:comments})
})

//댓글 작성 --------------------------------------------------------------------
router.post('/comments/:postId', authMiddleware, async(req, res) => {
    const {postId} = req.params
    const {comment} = req.body
    const User = res.locals.user
    const post = await Post.findOne({where: {id: postId}})
    
     if(!post) {
        return res.status(400).json({message: '해당하는 게시글이 없습니다.'})
    }
    if(!comment) {
        return res.status(400).json({message:"댓글 내용을 입력하세요"})
    }
    await Comment.create({comment, post_id:postId, user_id: User.id})
    res.status(201).json({message:'댓글을 생성하였습니다.'})
})

// 댓글 수정 ---------------------------------------------------------------------------
router.put('/comments/:commentId', authMiddleware, async(req,res) => {
    const {commentId} = req.params
    const {comment} = req.body
    const User = res.locals.user
    if (!comment) {
        return res.status(400).json({success:false, message:"수정 내용을 입력하세요."})
    }
    const comment2 = await Comment.findOne({
        where : {id: commentId}
    })
    if (comment2.user_id === User.id) {
        await Comment.update({comment}, {where: {id: commentId}})
        res.status(201).json({ message: "댓글을 수정하였습니다." })
    } else {
        return res.status(404).json({message:'수정 권한이 없습니다.'})
    }
})
 
// 댓글 삭제 ---------------------------------------------------------------------------------------
router.delete('/comments/:commentId', authMiddleware, async(req, res) => {
    const {commentId} = req.params
    const User = res.locals.user
    const comment2 = await Comment.findOne({where: {id: commentId}})
    if (comment2.user_id === User.id) {
        await Comment.destroy({where: {id:commentId}})
        return res.status(200).json({message:'댓글을 삭제하였습니다.'})
    } else {
        return res.status(400).json({message: '해당하는 댓글이 없습니다.'})
    }
})

module.exports = router;