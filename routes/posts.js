const express = require("express");
const router = express.Router();
const { Post } = require("../models");

const authMiddleware = require('../middlewares/auth-Middleware.js');

//전체 게시글 목록조회 ----------------------------------------------------------------------------
router.get('/posts', async(req, res) => {
    const posts = await Post.findAll({
        order : [['createdAt', 'DESC']]
    })
    res.status(200).json({data: posts})
})

// 게시글 작성 ------------------------------------------------------------------------------------
router.post('/posts', authMiddleware, async(req, res) => {
    const {title, content} = req.body
    const User = res.locals.user

    await Post.create({title, content, user_id: User.id}) 
    res.status(201).json({message: "게시글 작성 완료"})

})

// 특정 게시글 조회 -----------------------------------------------------------------------
router.get('/posts/:postId', async(req, res)=> {
    const {postId} = req.params
    const post = await Post.findOne({ where: {id: postId}})

    if (post) {
        res.status(200).json({data: post})
    } else {
        res.status(404).json({message:"해당하는 게시글이 없어요"})
    }
})

// 게시글 수정 ------------------------------------------------------------------------------
router.put('/posts/:postId', authMiddleware, async(req, res) => {
    const {postId} = req.params
    const {title, content} = req.body
    const User = res.locals.user
    const post = await Post.findOne({where: {id:postId}})
    
    if (post && post.user_id === User.id) {
        await Post.update({title, content}, {where: {id:postId}})
        res.status(200).json({message:'게시글이 수정되었습니다.'})
    } else {
        res.status(400).json({message:'게시글이 존재하지 않습니다.'})
    }
})

// 게시글 삭제 -------------------------------------------------------------------------------
router.delete('/posts/:postId', authMiddleware, async(req,res) => {
    const {postId} = req.params
    const User = res.locals.user
    const post = await Post.findOne({where: {id:postId}})

    if (post && post.user_id === User.id) {
        await Post.destroy({where: {id:postId}})
        res.status(200).json({message:'게시글이 삭제되었습니다.'})
    } else {
        res.status(400).json({message:'삭제 권한이 없습니다.'})
    }
})




module.exports = router;